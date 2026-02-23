from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class Location(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    types: List[str] = []
    rating: Optional[float] = 0.0
    user_ratings_total: Optional[int] = 0
    price_level: Optional[int] = None
    # เปลี่ยนเป็น Any หรือ Dict เพื่อเก็บโครงสร้างซับซ้อนของ Google Maps
    opening_hours: Optional[Dict[str, Any]] = None 
    formatted_address: Optional[str] = None

class TripInput(BaseModel):
    trip_start_date: str
    trip_duration_days: int
    accommodation_name: str
    must_go: List[str]
    interests: List[str]
    transport_mode: str = "car"
    trip_pace: str = "relaxed"
    budget_level: str = "moderate"
    start_time: str = "09:00"
    end_time: str = "20:00"

# ... (Response Models อื่นๆ เหมือนเดิม) ...
class TimeSlot(BaseModel):
    place: Location
    arrival_time: str
    departure_time: str
    travel_time_min: int
    distance_km: float
    # เพิ่ม field ใหม่: สถานะร้านตอนไปถึง
    status: str = "Open" # Open, Closed, Waiting
    wait_time_min: int = 0

class DailyItinerary(BaseModel):
    day: int
    date: str
    schedule: List[TimeSlot]
    day_cost_estimate: float
    day_travel_time_total: int

class SimpleTimeline(BaseModel):
    time: str          # "09:30"
    activity: str      # "ถึง วัดหนองแวง (รอ 10 นาที)"
    type: str          # "travel", "visit", "wait"

class DaySummary(BaseModel):
    day: int
    date: str
    timeline: List[str] # แบบข้อความอ่านง่าย เช่น ["09:00 - ถึง วัดพระธาตุ", ...]
    daily_cost: float

class TripSummary(BaseModel):
    total_days: int
    total_places: int
    total_cost: float
    total_distance: float
    days: List[DaySummary]

# --- แก้ไข TripResponse ให้มี summary ---
class TripResponse(BaseModel):
    itinerary: List[DailyItinerary]
    total_distance_km: float
    total_cost_estimate: float
    note: str
    summary: Optional[TripSummary] = None # <--- เพิ่มบรรทัดนี้


