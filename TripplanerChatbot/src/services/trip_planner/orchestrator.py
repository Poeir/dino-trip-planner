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

        rag_results = self.retriever.search(query=query_str, limit=remaining_slots * 5)

        existing_ids = {p.id for p in must_go_list}

        for res in rag_results:
            place_id = res['id']
            if place_id not in existing_ids:
                place_data = await find_place_by_id(place_id)

                if place_data:
                    if "_id" in place_data: del place_data["_id"]
                    interest_list.append(Location(**place_data))
                    existing_ids.add(place_id)

        all_candidates = must_go_list + interest_list
        return hotel_obj, all_candidates

    def map_user_input_to_weights(self, user_input: TripInput):
        w_time = 0.5
        w_cost = 0.5
        if user_input.trip_pace == "packed": w_time = 0.8
        elif user_input.trip_pace == "relaxed": w_time = 0.3
        
        if user_input.budget_level == "save": w_cost = 0.9
        elif user_input.budget_level == "splurge": w_cost = 0.1
        return w_time, w_cost
    
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