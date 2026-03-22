from src.core.database import find_place_by_name, find_places_by_types, find_place_by_id # <--- แก้ไข Path
from src.services.rag.retriever import PlaceRetriever
from .models import Location, TripInput, TripSummary, DaySummary
from datetime import datetime

class TripBuilderService:
    def __init__(self):
        self.retriever = PlaceRetriever()
    async def build_candidate_list(self, user_input: TripInput):
        # 1. หาโรงแรม
        accommodation = await find_place_by_name(user_input.accommodation_name)
        if not accommodation:
            accommodation = {
                "id": "hotel_dummy", 
                "name": user_input.accommodation_name, 
                "latitude": 16.4322, 
                "longitude": 102.8236,
                "types": ["lodging"],
                "rating": 4.5
            }
        if "_id" in accommodation: del accommodation["_id"]
        hotel_obj = Location(**accommodation)

        # 2. หา Must-Go
        must_go_list = []
        for name in user_input.must_go:
            place = await find_place_by_name(name)
            if place:
                if "_id" in place: del place["_id"]
                must_go_list.append(Location(**place))

        # 3. คำนวณ Slot ว่าง
        start_dt = datetime.strptime(user_input.start_time, "%H:%M")
        end_dt = datetime.strptime(user_input.end_time, "%H:%M")
        
        # หาจำนวนชั่วโมงที่เที่ยวต่อวัน
        total_trip_hours = (end_dt - start_dt).seconds / 3600 

        # คำนวณจำนวนสถานที่: สมมติสายชิลล์ใช้เวลา 2.5 ชม./ที่ | สายรีบใช้เวลา 1.5 ชม./ที่
        if user_input.trip_pace == "relaxed":
            places_per_day = max(3, int(total_trip_hours / 2.5))
        else:
            places_per_day = max(5, int(total_trip_hours / 1.5))
            
        total_slots = places_per_day * user_input.trip_duration_days
        remaining_slots = total_slots - len(must_go_list)

        # 4. เติม Interests
        interest_list = []
        if remaining_slots > 0:
            query_str =",".join(user_input.interests)
            if not query_str:
                query_str = "สถานที่ท่องเที่ยวยอดนิยม ขอนแก่น"
        print(f"🔎 [RAG] กำลังค้นหาสถานที่ที่ตรงกับ: '{query_str}'")

        rag_results = self.retriever.search(query=query_str, limit=remaining_slots * 10)

        existing_ids = {p.id for p in must_go_list}
        
        budget_map = {
            "economy": [0, 1],       # ฟรี หรือ ถูก
            "standard": [0, 1, 2],    # ถึงปานกลาง
            "premium": [1, 2, 3],     # ถึงแพง (ไม่เอาของฟรี/ถูกเกินไป)
            "luxury": [2, 3, 4]       # ปานกลาง ถึง หรูหราสุดๆ
        }
        allowed_prices = budget_map.get(user_input.budget_level, [0, 1, 2])


        for res in rag_results:
            place_id = res['id']
            if place_id not in existing_ids:
                place_data = await find_place_by_id(place_id)

                if place_data:
                    if "_id" in place_data: del place_data["_id"]
                    place_price = place_data.get('price_level', 1) # ถ้าไม่มีข้อมูลใน JSON ให้ตีเป็น 1
                    place_types = place_data.get('types', [])

                    if place_price in allowed_prices and "lodging" not in place_types:
                        interest_list.append(Location(**place_data))
                        existing_ids.add(place_id)
                        if len(interest_list) >= remaining_slots:
                            break

        all_candidates = must_go_list + interest_list
        return hotel_obj, all_candidates

    def map_user_input_to_weights(self, user_input: TripInput):
        w_time = 0.5
        w_cost = 0.5
        if user_input.trip_pace == "packed": w_time = 0.8
        elif user_input.trip_pace == "relaxed": w_time = 0.3
        
        weight_config = {
            "economy": 0.9,   # เน้นเซฟน้ำมันให้มากที่สุด
            "standard": 0.6,  # บาลานซ์
            "premium": 0.3,   # ไม่ค่อยสนระยะทาง เน้นที่เที่ยวที่ชอบ
            "luxury": 0.1     # ไม่สนระยะทางเลย จัดมาเต็มที่
        }
        w_cost = weight_config.get(user_input.budget_level, 0.6)
        
        return w_time, w_cost
    
    def get_dynamic_instructions(self, user_input: TripInput):
        # 🌟 1. แปลงค่า Pace เป็นคำสั่ง
        pace_instruction = ""
        if user_input.trip_pace == "relaxed":
            pace_instruction = (
                "- PACE (Relaxed): Schedule a slow-paced trip. "
                "Leave plenty of free time between activities. "
                "If there is a time gap > 45 mins, explicitly add '☕ พักผ่อนตามอัธยาศัย'. "
                "Do NOT pack too many places into one day."
            )
        elif user_input.trip_pace == "packed":
            pace_instruction = (
                "- PACE (Packed): Schedule a fast-paced trip. "
                "Maximize the number of places visited. "
                "Minimize idle time and schedule activities back-to-back."
            )

        # 🌟 2. แปลงค่า Budget เป็นคำสั่งจัดการระยะทางและราคา
        budget_instruction = ""
        if user_input.budget_level == "economy":
            budget_instruction = (
                "- BUDGET (Economy): STRICTLY group places that are in the same area/zone together "
                "to minimize driving distance and save fuel costs. Prioritize free or cheap places."
            )
        elif user_input.budget_level == "standard":
            budget_instruction = (
                "- BUDGET (Standard): Balance the driving distance and the quality of the places. "
                "A moderate amount of driving is acceptable."
            )
        elif user_input.budget_level == "premium":
            budget_instruction = (
                "- BUDGET (Premium): Focus on high-quality experiences and highly-rated places. "
                "It is okay to drive further for a better place."
            )
        elif user_input.budget_level == "luxury":
            budget_instruction = (
                "- BUDGET (Luxury): IGNORE travel distance and fuel costs entirely. "
                "Focus ONLY on providing the most premium, high-end, and exclusive experiences, "
                "even if they are far apart."
            )
            
        return pace_instruction, budget_instruction

    
    def create_trip_summary(self, itinerary, total_dist, total_cost) -> TripSummary:
        day_summaries = []
        total_places = 0
        for day in itinerary:
            timeline_text = []
            for i, slot in enumerate(day.schedule):
                total_places += 1

                if i > 0:
                    timeline_text.append(f"🚗 เดินทางด้วยรถยนต์ {slot.travel_time_min} นาที ({slot.distance_km} กม.)")
                status_text = ""
                if slot.status == "Waiting":
                    status_text = f" (⚠️ รอ {slot.wait_time_min} นาที)"
                elif slot.status == "Closed":
                    status_text = " (❌ ร้านปิด!)"
                text = f"{slot.arrival_time} - {slot.place.name}{status_text}"
                timeline_text.append(text)
                
            day_summaries.append(DaySummary(
                day=day.day, date=day.date,
                timeline=timeline_text, 
                daily_cost=round(day.day_cost_estimate, 2)
            ))

        return TripSummary(
            total_days=len(itinerary), 
            total_places=total_places,
            total_cost=round(total_cost, 2), 
            total_distance=round(total_dist, 2),
            days=day_summaries
        )