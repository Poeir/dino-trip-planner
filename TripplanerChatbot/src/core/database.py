import motor.motor_asyncio
import json
from src.core.config import MONGO_DETAILS
from src.services.trip_planner.models import Location # อัปเดต Path

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
db = client.trip_planner
collection = db.get_collection("locations")

async def seed_data_if_empty(file_path: str):
    if await collection.count_documents({}) > 0:
        return
    print(f"⏳ Seeding MongoDB from {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        locations = []
        for item in data:
            try:
                doc = {
                    "id": item.get("id"),
                    "name": item.get("displayName", {}).get("text", "Unknown"),
                    "latitude": item.get("location", {}).get("latitude", 0.0),
                    "longitude": item.get("location", {}).get("longitude", 0.0),
                    "types": item.get("types", []),
                    "rating": item.get("rating", 0.0),
                    "user_ratings_total": item.get("userRatingCount", 0),
                    "price_level": 2, 
                    "opening_hours": item.get("regularOpeningHours"),
                    "formatted_address": item.get("formattedAddress")
                }
                locations.append(doc)
            except Exception as e:
                continue
        if locations:
            await collection.insert_many(locations)
            print(f"✅ Inserted {len(locations)} locations from JSON.")
    except Exception as e:
        print(f"❌ Error seeding data: {e}")

async def find_place_by_name(name_query: str):
    return await collection.find_one({"name": {"$regex": name_query, "$options": "i"}})

async def find_places_by_types(interests: list, limit=50):
    cursor = collection.find({"types": {"$in": interests}}).sort("rating", -1).limit(limit)
    return await cursor.to_list(length=limit)

async def find_place_by_id(place_id: str):
    """ค้นหาสถานที่ด้วย ID จาก MongoDB"""
    return await collection.find_one({"id": place_id})