from __future__ import annotations
from typing import List, Optional, Any, Dict, Union
from pydantic import BaseModel
from datetime import datetime

# ===== Nested Models (ตรงกับ DinoDB schema) =====

class Location(BaseModel):
    # Location -> DinoDB core.location
    lat: float
    lng: float

class CoreInfo(BaseModel):
    name: str
    primaryType: Optional[str] = None
    types: List[str] = []
    location: Location
    rating: Optional[float] = 0.0
    userRatingCount: Optional[int] = 0
    priceLevel: Optional[int] = None
    businessStatus: Optional[str] = "OPERATIONAL"

class Contact(BaseModel):
    phone: Optional[str] = ""
    website: Optional[str] = ""

class Address(BaseModel):
    formatted: Optional[str] = ""

class OpeningHours(BaseModel):
    openNow: Optional[bool] = False
    weekdayDescriptions: Optional[List[str]] = []
    periods: Optional[List[Dict[str, Any]]] = None
    nextOpenTime: Optional[Union[str, datetime]] = None

class PhotoMedia(BaseModel):
    name: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None

class Media(BaseModel):
    photos: Optional[List[PhotoMedia]] = []

class Review(BaseModel):
    authorName: Optional[str] = None
    rating: Optional[int] = None
    text: Optional[str] = None
    publishTime: Optional[Union[str, datetime]] = None

# ===== Main Place Model (ตรงกับ DinoDB) =====
class Place(BaseModel):
    google_place_id: str
    core: CoreInfo
    contact: Optional[Contact] = None
    address: Optional[Address] = None
    openingHours: Optional[OpeningHours] = None
    media: Optional[Media] = None
    reviews: Optional[List[Review]] = []
    features: Optional[Dict[str, Any]] = {}
    extra: Optional[Dict[str, Any]] = {}
    maps: Optional[Dict[str, Any]] = {}
    subDestinations: Optional[List[Any]] = []
    containingPlaces: Optional[List[Any]] = []
    ev: Optional[Dict[str, Any]] = {}
    metadata: Optional[Dict[str, Any]] = {}
    
    class Config:
        populate_by_name = True
        extra = 'ignore'  # Ignore extra fields like MongoDB's _id
    
    @property
    def id(self) -> str:
        """Alias for google_place_id"""
        return self.google_place_id
    
    @property
    def name(self) -> str:
        """Get name from core"""
        return self.core.name
    
    @property
    def latitude(self) -> float:
        """Get latitude from core.location"""
        return self.core.location.lat
    
    @property
    def longitude(self) -> float:
        """Get longitude from core.location"""
        return self.core.location.lng
    
    @property
    def types(self) -> List[str]:
        """Get types from core"""
        return self.core.types
    
    @property
    def rating(self) -> Optional[float]:
        """Get rating from core"""
        return self.core.rating
    
    @property
    def user_ratings_total(self) -> Optional[int]:
        """Get userRatingCount from core"""
        return self.core.userRatingCount
    
    @property
    def price_level(self) -> Optional[int]:
        """Get priceLevel from core"""
        return self.core.priceLevel
    
    @property
    def opening_hours(self) -> Optional[OpeningHours]:
        """Get openingHours"""
        return self.openingHours
    
    @property
    def formatted_address(self) -> Optional[str]:
        """Get formatted address"""
        return self.address.formatted if self.address else None

class TripInput(BaseModel):
    trip_start_date: str
    trip_duration_days: int
    accommodation_name: str
    must_go: List[str]
    interests: List[str]
    transport_mode: str = "car"
    trip_pace: str = "relaxed"
    budget_level: str = "standard"
    start_time: str = "09:00"
    end_time: str = "20:00"

# ===== Response Models =====
class TimeSlot(BaseModel):
    place: 'Place'  # ใช้ Place model แทน Location (forward reference)
    arrival_time: str
    departure_time: str
    travel_time_min: int
    distance_km: float
    # เพิ่ม field ใหม่: สถานะร้านตอนไปถึง
    status: str = "Open" # Open, Closed, Waiting
    wait_time_min: int = 0
    
    class Config:
        # Allow arbitrary types since Place is not a simple type
        arbitrary_types_allowed = True

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


