import json
import math
from datetime import datetime, timedelta
from openai import OpenAI
from typing import List
from src.core.config import API_KEY, BASE_URL, MODEL_NAME
from .models import Place, TripInput, DailyItinerary, TimeSlot, CoreInfo, Location as LocModel, Contact, Address

class LLMTripPlanner:
    def __init__(self, candidates: List[Place], start_point: Place = None):
        self.candidates = candidates
        self.start_point = start_point
        self.location_map = {loc.id: loc for loc in candidates}
        self.base_url = BASE_URL
        self.api_key = API_KEY
        self.default_model = MODEL_NAME
        self.client = OpenAI(api_key=self.api_key, base_url=self.base_url)

    def calculate_distance(self, loc1: Place, loc2: Place) -> float:
        R = 6371
        dlat = math.radians(loc2.latitude - loc1.latitude)
        dlon = math.radians(loc2.longitude - loc1.longitude)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(loc1.latitude)) * math.cos(math.radians(loc2.latitude)) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c
    
    def get_visit_duration(self, loc: Place, pace: str) -> int:
            name_lower = loc.name.lower()
            buffet_keywords = ['หมูกระทะ', 'ปิ้งย่าง', 'บุฟเฟต์', 'สุกี้', 'ตี๋น้อย', 'buffet', 'barbecue', 'bbq']
        
            # ถ้าร้านมีคำพวกนี้อยู่ในชื่อ หรืออยู่ในหมวดหมู่ ให้บังคับเวลาเป็น 120 นาทีทันที
            if any(kw in name_lower for kw in buffet_keywords) or any('barbecue' in t for t in loc.types):
                return 120

            TYPE_DURATION_MAP = {
                'museum': 90, 'place_of_worship': 45, 'park': 60,
                'shopping_mall': 120, 'food': 60, 'cafe': 45, 'tourist_attraction': 60
            }
            
            # หาเวลาแวะพักพื้นฐาน
            base_duration = 60
            for t in loc.types:
                if t in TYPE_DURATION_MAP:
                    base_duration = TYPE_DURATION_MAP[t]
                    break
                    
            # 🚨 ถ้าเป็นสายชิลล์ (relaxed) ให้บวกเวลาพักเพิ่มที่ละ 30 นาที
            if pace == "relaxed":
                return base_duration + 30
            # ถ้าเป็นสายรีบ (packed) ให้ลดเวลาพักลง 15 นาที
            elif pace == "packed":
                return max(30, base_duration - 15) # ขั้นต่ำต้องมี 30 นาที
                
            return base_duration
    
    def check_is_open(self, loc: Place, arrival_dt: datetime) -> dict:
        """เช็คว่าร้านเปิดไหม ณ เวลา arrival_dt"""
        if not loc.opening_hours or not loc.opening_hours.periods:
            return {'is_open': True, 'wait_min': 0, 'status': 'Open (No Data)'}

        # Google Maps: 0=Sunday, 1=Monday... | Python: 0=Monday, 6=Sunday
        google_day = (arrival_dt.weekday() + 1) % 7
        arrival_minutes = arrival_dt.hour * 60 + arrival_dt.minute
        
        periods = loc.opening_hours.periods
        today_periods = [p for p in periods if p['open']['day'] == google_day]

        if not today_periods:
             return {'is_open': False, 'wait_min': 0, 'status': 'Closed Today'}

        for p in today_periods:
            open_min = p['open']['hour'] * 60 + p['open']['minute']
            
            if 'close' in p and p['close']['day'] == google_day:
                close_min = p['close']['hour'] * 60 + p['close']['minute']
                if open_min <= arrival_minutes < close_min:
                    return {'is_open': True, 'wait_min': 0, 'status': 'Open'}
                elif arrival_minutes < open_min:
                    return {'is_open': False, 'wait_min': open_min - arrival_minutes, 'status': 'Waiting'}
            else:
                 if arrival_minutes >= open_min:
                     return {'is_open': True, 'wait_min': 0, 'status': 'Open'}

        return {'is_open': False, 'wait_min': 0, 'status': 'Closed'}

    def generate_prompt(self, user_input: TripInput, pace_instruction: str, budget_instruction: str) -> str:
        # ... (ส่วนนี้เหมือนเดิม ไม่ต้องแก้) ...
        places_str = ""
        for loc in self.candidates:
            places_str += f"- ID: {loc.id}, Name: {loc.name}, Type: {loc.types}, Rating: {loc.rating}\n"

        prompt = f"""
       You are a proficient travel planner. Based on the provided candidate locations and the user query, please create a detailed travel plan.
        

        [USER QUERY]
        - Duration: {user_input.trip_duration_days} days
        - Pace: {user_input.trip_pace}
        - Budget: {user_input.budget_level}
        - Interests: {', '.join(user_input.interests)}
        - Must Go: {', '.join(user_input.must_go)}
        - Start: {user_input.start_time}, End: {user_input.end_time}
        
        [DYNAMIC CONSTRAINTS]
        {pace_instruction}
        {budget_instruction}

        [PROVIDED DATA - CANDIDATE LOCATIONS]
        {places_str}
        
        [STRICT RULES]
        1. All the information in your plan (especially place_id) MUST be derived ONLY from the PROVIDED DATA above. Do not invent places.
        2. Output STRICTLY in JSON format. Do not write any other text.
        3. Align with commonsense: Do not put heavy restaurants back-to-back. Mix attractions, cafes, and restaurants logically.
        4. Do not include "Accommodation/Hotels" in the schedule! Only include tourist attractions, cafes, and restaurants. The system will calculate the return trip to your accommodation automatically.
        
        [EXAMPLE JSON OUTPUT FORMAT]
        {{
            "itinerary": [
                {{
                    "day": 1,
                    "schedule": [
                        {{
                            "place_id": "ID_FROM_LIST",
                            "arrival_time": "HH:MM",
                            "departure_time": "HH:MM"
                        }}
                    ]
                }}
            ]
        }}
        """
        return prompt

    def clean_json_string(self, json_str: str) -> str:
        # ... (ส่วนนี้เหมือนเดิม) ...
        json_str = json_str.strip()
        if json_str.startswith("```json"): json_str = json_str[7:]
        elif json_str.startswith("```"): json_str = json_str[3:]
        if json_str.endswith("```"): json_str = json_str[:-3]
        return json_str.strip()

    def solve_route_with_llm(self, user_input: TripInput, pace_instruction: str, budget_instruction: str) -> List[DailyItinerary]:
        prompt = self.generate_prompt(user_input, pace_instruction, budget_instruction)
        model_name = self.default_model 
        
        print(f"🤖 Calling LLM: {model_name}...")

        try:
            response = self.client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": "You are a helpful travel assistant. Output JSON only."},
                    {"role": "user", "content": prompt},
                ],
                stream=False,
                temperature=0.7,
            )
            
            # ... (ส่วนแกะ JSON ด้านล่างเหมือนเดิมทุกอย่าง) ...
            content = response.choices[0].message.content
            cleaned_content = self.clean_json_string(content)
            data = json.loads(cleaned_content)
            
            final_itinerary = []
            trip_data = data.get("itinerary", [])
            
            for day_data in trip_data:
                day_num = day_data['day']
                schedule = []
                current_loc = self.start_point # จุดเริ่มต้นคือโรงแรม
                day_cost = 0
                day_travel = 0

                current_dt = datetime.strptime(user_input.start_time, "%H:%M")

                for slot in day_data['schedule']:
                    loc_id = slot['place_id']
                    if loc_id in self.location_map:
                        dest = self.location_map[loc_id]

                        # คำนวณระยะทางและเวลาเดินทาง
                        dist = 0
                        travel_min = 0
                        if current_loc:
                            dist = self.calculate_distance(current_loc, dest)
                            travel_min = int((dist / 30.0) * 60) # สมมติความเร็วรถ 30 กม./ชม.

                        # 1. ลองคำนวณเวลาไปถึงหน้าประตูร้านแบบปกติดูก่อน
                        arrival_at_door = current_dt + timedelta(minutes=travel_min)
                        
                        # 2. เช็คเวลาเปิด-ปิด ของสถานที่ถัดไป
                        open_info = self.check_is_open(dest, arrival_at_door)
                        gap_minutes = 0

                        if open_info['status'] == 'Waiting':
                            # ถ้าร้านมีเวลาเปิดชัดเจนและเราไปถึงก่อนเวลา ให้เอาเวลาที่ต้องรอมาเป็น Gap
                            gap_minutes = open_info['wait_min']
                        elif self.is_evening_place(dest) and arrival_at_door.hour < 17:
                            # Fallback สำรอง: ถ้าร้านไม่มีข้อมูลเวลาใน DB แต่เป็นร้านกลางคืน ให้ใช้ 17:00 เป็นเกณฑ์
                            target_dt = arrival_at_door.replace(hour=17, minute=0, second=0)
                            gap_minutes = int((target_dt - arrival_at_door).total_seconds() / 60)
                        else:
                            gap_minutes = 0

                        wait_min = 0
                            
                            # ถ้ามีเวลาว่างเกิน 45 นาที ให้แทรก "เวลาพักผ่อน" ลงในตาราง
                        if gap_minutes > 45:
                            dummy_loc = Place(
                                google_place_id="free_time_dummy",
                                core=CoreInfo(
                                    name="☕ พักผ่อนตามอัธยาศัย / แวะเดินเล่นชิลๆ",
                                    location=LocModel(
                                        lat=current_loc.latitude if current_loc else dest.latitude,
                                        lng=current_loc.longitude if current_loc else dest.longitude
                                    ),
                                    types=["free_time"],
                                    rating=0.0,
                                    primaryType="free_time",
                                    userRatingCount=0,
                                    priceLevel=None,
                                    businessStatus="OPERATIONAL"
                                ),
                                contact=Contact(),
                                address=Address()
                            )
                            
                            free_departure = current_dt + timedelta(minutes=gap_minutes)
                            schedule.append(TimeSlot(
                                place=dummy_loc,
                                arrival_time=current_dt.strftime("%H:%M"),
                                departure_time=free_departure.strftime("%H:%M"),
                                travel_time_min=0,
                                distance_km=0.0,
                                status="Free Time",
                                wait_time_min=0
                            ))
                            # อัปเดตเวลาปัจจุบันให้ข้ามช่วงพักผ่อนไปเลย
                            current_dt = free_departure
                            
                            # คำนวณเวลาไปถึงร้านใหม่อีกครั้ง (เดินทางหลังจากพักเสร็จ)
                            arrival_at_door = current_dt + timedelta(minutes=travel_min)
                            # รีเช็คสถานะร้านอีกรอบ (เผื่อไปถึงแล้วยังต้องรออีกนิดหน่อย)
                            open_info = self.check_is_open(dest, arrival_at_door)
                            if open_info['status'] == 'Waiting':
                                wait_min = open_info['wait_min']
                            else:
                            # ถ้ารอไม่เกิน 45 นาที ไม่ต้องแทรกเวลาพัก ให้ขับรถไปรอหน้าประตูร้านเลย
                                wait_min = 0
                        else:
                            wait_min = gap_minutes

                        start_activity_dt = arrival_at_door + timedelta(minutes=wait_min)
                        visit_min = self.get_visit_duration(dest, user_input.trip_pace)
                        departure_dt = start_activity_dt + timedelta(minutes=visit_min)

                        schedule.append(TimeSlot(
                            place=dest,
                            arrival_time=arrival_at_door.strftime("%H:%M"),
                            departure_time=departure_dt.strftime("%H:%M"),
                            travel_time_min=travel_min,
                            distance_km=round(dist, 2),
                            status=open_info['status'] if wait_min == 0 else "Waiting",
                            wait_time_min=wait_min
                        ))
                        
                        # 1. ค่าน้ำมัน (4 บาท / กม.)
                        fuel_cost = dist * 4.0
                        
                        # 2. ประเมินค่าใช้จ่ายแต่ละสถานที่
                        place_cost = 0
                        p_level = getattr(dest, 'price_level', None) # ลองดึง price_level
                        
                        if p_level is not None:
                            # ถ้ามี price_level จาก Google Maps (0-4)
                            price_map = {0: 0, 1: 150, 2: 400, 3: 800, 4: 1500}
                            place_cost = price_map.get(p_level, 150)
                        else:
                            # ถ้าไม่มี ให้ประเมินจากประเภทสถานที่ (Fallback)
                            types_str = " ".join(dest.types).lower()
                            if any(t in types_str for t in ['restaurant', 'food', 'cafe']):
                                place_cost = 250 # ค่ากินเฉลี่ย
                            elif any(t in types_str for t in ['shopping_mall', 'night_market']):
                                place_cost = 300 # ค่าช้อปปิ้ง/ของจุกจิก
                            elif any(t in types_str for t in ['park', 'place_of_worship', 'museum']):
                                place_cost = 0   # วัด สวนสาธารณะ พิพิธภัณฑ์ มักจะฟรีหรือถูกมาก
                            else:
                                place_cost = 100 # สถานที่อื่นๆ เหมาจ่าย 100
                                
                        # 3. สะสมค่าใช้จ่ายและเวลา
                        day_cost += fuel_cost + place_cost
                        day_travel += travel_min
                        current_loc = dest         # อัปเดตจุดปัจจุบัน
                        current_dt = departure_dt  # อัปเดตเวลาปัจจุบัน

                # เช็คว่า ไม่ใช่วันสุดท้าย ใช่หรือไม่? (day_num < จำนวนวันทั้งหมด)
                if day_num < user_input.trip_duration_days:
                    # ถ้าไม่ใช่วันสุดท้าย ให้ขับรถกลับโรงแรม
                    if current_loc and self.start_point:
                        dist = self.calculate_distance(current_loc, self.start_point)
                        travel_min = int((dist / 30.0) * 60)
                        
                        arrival_at_hotel = current_dt + timedelta(minutes=travel_min)
                        
                        schedule.append(TimeSlot(
                            place=self.start_point,  # <-- จุดหมายคือโรงแรม
                            arrival_time=arrival_at_hotel.strftime("%H:%M"),
                            departure_time=arrival_at_hotel.strftime("%H:%M"), # ถึงแล้วพักผ่อนเลย ไม่ต้องมีเวลาออก
                            travel_time_min=travel_min,
                            distance_km=round(dist, 2),
                            status="End of Day (Return to Hotel)",
                            wait_time_min=0
                        ))
                        
                        day_cost += (dist * 4.0)
                        day_travel += travel_min
                else:
                    # ถ้าเป็น "วันสุดท้าย" (Last Day)
                    # ปล่อยให้จบทริปที่ร้านสุดท้ายได้เลย (หรือกลับบ้าน) ระบบจะไม่เพิ่มโรงแรมต่อท้ายให้
                    pass

                
                final_itinerary.append(DailyItinerary(
                    day=day_num, date=f"Day {day_num}", 
                    schedule=schedule, 
                    day_cost_estimate=round(day_cost, 2), 
                    day_travel_time_total=day_travel
                ))
                
            return final_itinerary

        except Exception as e:
            print(f"❌ LLM Error: {e}")
            return []
        
    def is_evening_place(self, loc: Place) -> bool:
        """เช็คว่าสถานที่นี้ควรไปช่วงเย็น/ค่ำหรือไม่"""
        evening_keywords = ['barbecue_restaurant', 'night_market', 'bar', 'night_club', 'pub', 'izakaya']
        name_lower = loc.name.lower()
        
        # เช็คจากชื่อร้าน
        if any(kw in name_lower for kw in ['หมูกระทะ', 'ปิ้งย่าง', 'บุฟเฟต์', 'สุกี้', 'ตี๋น้อย', 'บาร์', 'ตลาดกลางคืน']):
            return True
            
        # เช็คจากหมวดหมู่ (Types)
        if any(t in evening_keywords for t in loc.types):
            return True
            
        return False