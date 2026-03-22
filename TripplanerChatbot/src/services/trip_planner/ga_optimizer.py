import math
import random
from typing import List, Dict
from datetime import datetime, timedelta
from .models import Location, DailyItinerary, TimeSlot, TripInput

class GeneticScheduler:
    def __init__(self, locations: List[Location], start_point: Location, 
                 w_time: float, w_cost: float, user_input: TripInput):
        self.locations = locations
        self.start_point = start_point
        self.user_input = user_input
        self.pop_size = 50
        self.generations = 100
        self.w_time = w_time
        self.w_cost = w_cost
        self.FUEL_COST_PER_KM = 4.0
        self.AVG_SPEED_KMH = 30.0 # ตั้งค่าความเร็วเฉลี่ยเผื่อไว้ (คุณอาจจะมีประกาศไว้ระดับ Class)

        self.TYPE_DURATION_MAP = {
            'museum': 90, 'place_of_worship': 45, 'park': 60,
            'shopping_mall': 120, 'food': 60, 'cafe': 45, 'tourist_attraction': 60,
            'night_market': 90
        }

    def calculate_distance(self, loc1: Location, loc2: Location) -> float:
        R = 6371
        dlat = math.radians(loc2.latitude - loc1.latitude)
        dlon = math.radians(loc2.longitude - loc1.longitude)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(loc1.latitude)) * math.cos(math.radians(loc2.latitude)) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c

    # 🌟 [กฎข้อที่ 1] บังคับเวลาบุฟเฟต์ 120 นาที
    def get_visit_duration(self, loc: Location) -> int:
        name_lower = loc.name.lower()
        buffet_keywords = ['หมูกระทะ', 'ปิ้งย่าง', 'บุฟเฟต์', 'สุกี้', 'ตี๋น้อย', 'buffet', 'barbecue', 'bbq']
        if any(kw in name_lower for kw in buffet_keywords) or any('barbecue' in t for t in loc.types):
            return 120
        # 2. หาเวลาพื้นฐานจาก Type
        base_duration = 60
        for t in loc.types:
            if t in self.TYPE_DURATION_MAP:
                base_duration = self.TYPE_DURATION_MAP[t]
                break
        
        # 🌟 3. ปรับตาม Pace ที่ User เลือกมาจริง ๆ
        if self.user_input.trip_pace == "relaxed":
            return base_duration + 30
        elif self.user_input.trip_pace == "packed":
            return max(30, base_duration - 15)
            
        return base_duration

    # 🌟 ฟังก์ชันใหม่: เช็คร้านกลางคืน
    def is_evening_place(self, loc: Location) -> bool:
        evening_keywords = ['barbecue_restaurant', 'night_market', 'bar', 'night_club', 'pub', 'izakaya']
        name_lower = loc.name.lower()
        if any(kw in name_lower for kw in ['หมูกระทะ', 'ปิ้งย่าง', 'บุฟเฟต์', 'สุกี้', 'ตี๋น้อย', 'บาร์', 'ตลาดกลางคืน']):
            return True
        if any(t in evening_keywords for t in loc.types):
            return True
        return False

    def check_is_open(self, loc: Location, arrival_dt: datetime) -> Dict:
        if not loc.opening_hours or 'periods' not in loc.opening_hours:
            return {'is_open': True, 'wait_min': 0, 'status': 'Open (No Data)'}

        google_day = (arrival_dt.weekday() + 1) % 7
        arrival_minutes = arrival_dt.hour * 60 + arrival_dt.minute
        
        periods = loc.opening_hours['periods']
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

    def fitness(self, route):
        total_score = 0
        penalty = 0
        seen_brands = set()
        restaurant_count = 0
        cafe_count = 0
        last_meal_time = None
        end_time_limit = datetime.strptime(f"2025-01-01 {self.user_input.end_time}", "%Y-%m-%d %H:%M")
        current_dt = datetime.strptime(f"2025-01-01 {self.user_input.start_time}", "%Y-%m-%d %H:%M")
        curr = self.start_point
        seen_brands = set()
        for loc in route:
            # 1. ❌ ป้องกันแบรนด์ซ้ำ (เช่น สุกี้ตี๋น้อย 2 รอบ)
            # ตัดชื่อเอาแค่คำหลักก่อนวงเล็บ หรือก่อนชื่อสาขา
            base_name = loc.name.split('(')[0].split('สาขา')[0].strip()
            if base_name in seen_brands:
                penalty += 5000  # ทำโทษหนักมากเพื่อให้ GA เลือกสาขาเดียว
            seen_brands.add(base_name)

            # 2. ❌ คัดกรองโรงแรม (Lodging) ออกจากระหว่างวัน
            if "lodging" in loc.types:
                penalty += 10000 # ห้ามโรงแรมโผล่มาเป็นที่เที่ยว

            # 3. 🍱 จำกัดประเภทสถานที่ (Category Balancing)
            if 'restaurant' in loc.types or 'food' in loc.types:
                restaurant_count += 1
            if 'cafe' in loc.types:
                cafe_count += 1

            is_food = any(t in ['restaurant', 'food'] for t in loc.types)
            if is_food:
                if last_meal_time and (current_dt - last_meal_time).total_seconds() / 60 < 180:
                    penalty += 3000 # ทำโทษถ้ากินมื้อใหญ่ติดกันเกินไป (ภายใน 3 ชม.)
                last_meal_time = current_dt

            dist = self.calculate_distance(curr, loc)
            travel_min = (dist / self.AVG_SPEED_KMH) * 60
            arrival_dt = current_dt + timedelta(minutes=travel_min)
            if current_dt > end_time_limit:
                total_score += 5000 # ลงโทษหนักมาก เพื่อให้ GA สลับเอาสถานที่นี้ไปวันอื่นหรือตัดออก
            open_info = self.check_is_open(loc, arrival_dt)
            gap_minutes = 0

            # คำนวณเวลารอคอย (Time Padding Simulation ในสมอง GA)
            if not open_info['is_open']:
                if open_info['status'] == 'Waiting':
                    # ถ้ารอนานเกินไป (เช่น รอนานกว่า 2 ชม.) ให้ทำโทษ
                    if open_info['wait_min'] > 120:
                        penalty += 5000
                    arrival_dt += timedelta(minutes=open_info['wait_min'])
                else:
                    penalty += 20000 # ทำโทษหนักมากถ้าไปที่ที่ปิดแล้ว (ห้ามเลือกเด็ดขาด)
            elif self.is_evening_place(loc) and arrival_dt.hour < 17:
                target_dt = arrival_dt.replace(hour=17, minute=0, second=0)
                gap_minutes = int((target_dt - arrival_dt).total_seconds() / 60)

            penalty = 0
            if not open_info['is_open'] and open_info['status'] != 'Waiting':
                penalty += 1000 # โทษหนักสุดถ้าร้านปิด
            else:
                if gap_minutes > 0:
                    arrival_dt += timedelta(minutes=gap_minutes)
                    # โทษเบาๆ เพื่อให้ GA พยายามเลี่ยงตารางที่มีเวลาว่างเยอะๆ (ดันร้านกลางคืนไปท้ายวันเอง)
                    penalty += (gap_minutes * 0.5) 
            
            # 4. ⏰ เบรกมือเรื่องเวลา (Time Limit Penalty)
            if arrival_dt > end_time_limit:
                penalty += 2000 # ทำโทษถ้าเวลาไหลเกินที่ User กำหนด

            visit_min = self.get_visit_duration(loc)   
            total_score += (dist * 1.0) + (dist * self.FUEL_COST_PER_KM * self.w_cost)
            current_dt = arrival_dt + timedelta(minutes=visit_min)
            curr = loc

        # 5. 📉 ทำโทษถ้ากินเยอะเกินไป (Optional)
        if restaurant_count > 3: penalty += (restaurant_count - 3) * 1000
        if cafe_count > 3: penalty += (cafe_count - 3) * 1000
            
        return 1 / (total_score + 1)

    def solve_route(self):
        pop = [random.sample(self.locations, len(self.locations)) for _ in range(self.pop_size)]
        for _ in range(self.generations):
            pop.sort(key=self.fitness, reverse=True)
            new_pop = pop[:10]
            while len(new_pop) < self.pop_size:
                p = random.choice(pop[:20])
                c = p[:]
                if random.random() < 0.3:
                    i, j = random.sample(range(len(c)), 2)
                    c[i], c[j] = c[j], c[i]
                new_pop.append(c)
            pop = new_pop
        return max(pop, key=self.fitness)

    def generate_detailed_itinerary(self, sorted_route, days, start_date_str):
        itineraries = []
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
        end_time_limit_obj = datetime.strptime(self.user_input.end_time, "%H:%M").time()
        total_places = len(sorted_route)
        per_day = math.ceil(total_places / days)
        idx = 0

        for i in range(days):
            day_schedule = []
            current_date = start_date + timedelta(days=i)
            current_dt = datetime.combine(current_date.date(), datetime.strptime(self.user_input.start_time, "%H:%M").time())
            
            current_loc = self.start_point
            day_cost = 0; day_travel = 0

            for _ in range(per_day):
                if idx >= total_places: break
                dest = sorted_route[idx]
                
                if current_dt.time() > end_time_limit_obj:
                    # ถ้าเกินแล้ว ไม่ต้องเพิ่มสถานที่นี้ในวันนี้ ข้ามไปที่พักเลย
                    break

                dist = self.calculate_distance(current_loc, dest)
                travel_min = int((dist / self.AVG_SPEED_KMH) * 60)
                arrival_at_door = current_dt + timedelta(minutes=travel_min)
                
                # 🌟 [กฎข้อที่ 2] ระบบ TIME PADDING
                open_info = self.check_is_open(dest, arrival_at_door)
                gap_minutes = 0
                
                if open_info['status'] == 'Waiting':
                    gap_minutes = open_info['wait_min']
                elif self.is_evening_place(dest) and arrival_at_door.hour < 17:
                    target_dt = arrival_at_door.replace(hour=17, minute=0, second=0)
                    gap_minutes = int((target_dt - arrival_at_door).total_seconds() / 60)

                wait_min = 0
                if gap_minutes > 45:
                    dummy_loc = Location(
                        id="free_time_dummy",
                        name="☕ พักผ่อนตามอัธยาศัย / แวะเดินเล่นชิลๆ",
                        latitude=current_loc.latitude, longitude=current_loc.longitude,
                        types=["free_time"], rating=0.0
                    )
                    free_departure = current_dt + timedelta(minutes=gap_minutes)
                    day_schedule.append(TimeSlot(
                        place=dummy_loc, arrival_time=current_dt.strftime("%H:%M"),
                        departure_time=free_departure.strftime("%H:%M"), travel_time_min=0,
                        distance_km=0.0, status="Free Time", wait_time_min=0
                    ))
                    current_dt = free_departure
                    arrival_at_door = current_dt + timedelta(minutes=travel_min)
                    
                    open_info = self.check_is_open(dest, arrival_at_door)
                    if open_info['status'] == 'Waiting':
                        wait_min = open_info['wait_min']
                else:
                    wait_min = gap_minutes
                
                dest.opening_hours = None
                start_activity_dt = arrival_at_door + timedelta(minutes=wait_min)
                visit_min = self.get_visit_duration(dest)
                departure_dt = start_activity_dt + timedelta(minutes=visit_min)
                
                day_schedule.append(TimeSlot(
                    place=dest,
                    arrival_time=arrival_at_door.strftime("%H:%M"),
                    departure_time=departure_dt.strftime("%H:%M"),
                    travel_time_min=travel_min, distance_km=round(dist, 2),
                    status=open_info['status'] if wait_min == 0 else "Waiting",
                    wait_time_min=wait_min
                ))
                
                current_dt = departure_dt
                current_loc = dest
                day_cost += (dist * self.FUEL_COST_PER_KM) + 100
                day_travel += travel_min
                idx += 1
            
            # 🌟 [กฎข้อที่ 3] คำนวณการกลับโรงแรม (ยกเว้นวันสุดท้าย)
            if i < days - 1:
                if current_loc and self.start_point:
                    dist = self.calculate_distance(current_loc, self.start_point)
                    travel_min = int((dist / self.AVG_SPEED_KMH) * 60)
                    arrival_at_hotel = current_dt + timedelta(minutes=travel_min)
                    
                    day_schedule.append(TimeSlot(
                        place=self.start_point,
                        arrival_time=arrival_at_hotel.strftime("%H:%M"),
                        departure_time=arrival_at_hotel.strftime("%H:%M"),
                        travel_time_min=travel_min, distance_km=round(dist, 2),
                        status="End of Day (Return to Hotel)", wait_time_min=0
                    ))
                    day_cost += (dist * self.FUEL_COST_PER_KM)
                    day_travel += travel_min

            itineraries.append(DailyItinerary(
                day=i+1, date=current_date.strftime("%Y-%m-%d"),
                schedule=day_schedule, day_cost_estimate=round(day_cost, 2),
                day_travel_time_total=day_travel
            ))
            
        return itineraries