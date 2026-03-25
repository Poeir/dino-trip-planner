import motor.motor_asyncio
import json
from datetime import datetime, timedelta
from bson import ObjectId
from src.core.config import MONGO_DETAILS
from src.services.trip_planner.models import Location # อัปเดต Path

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
db = client.DinoDB
collection = db.get_collection("places")

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
                now = datetime.utcnow()
                doc = {
                    # ID & Basic
                    "google_place_id": item.get("google_place_id", item.get("id", "")),
                    
                    # Core Information
                    "core": {
                        "name": item.get("core", {}).get("name", item.get("displayName", {}).get("text", "Unknown")),
                        "primaryType": item.get("core", {}).get("primaryType", item.get("primaryType", "")),
                        "types": item.get("core", {}).get("types", item.get("types", [])),
                        "location": {
                            "lat": item.get("core", {}).get("location", {}).get("lat", item.get("location", {}).get("latitude", 0.0)),
                            "lng": item.get("core", {}).get("location", {}).get("lng", item.get("location", {}).get("longitude", 0.0))
                        },
                        "rating": item.get("core", {}).get("rating", item.get("rating", 0.0)),
                        "userRatingCount": item.get("core", {}).get("userRatingCount", item.get("userRatingCount", 0)),
                        "priceLevel": item.get("core", {}).get("priceLevel", None),
                        "businessStatus": item.get("core", {}).get("businessStatus", item.get("businessStatus", "OPERATIONAL"))
                    },
                    
                    # Contact & Address
                    "contact": {
                        "phone": item.get("contact", {}).get("phone", ""),
                        "website": item.get("contact", {}).get("website", item.get("websiteUri", ""))
                    },
                    "address": {
                        "formatted": item.get("address", {}).get("formatted", item.get("formattedAddress", ""))
                    },
                    
                    # Opening Hours
                    "openingHours": {
                        "openNow": item.get("openingHours", {}).get("openNow", item.get("regularOpeningHours", {}).get("openNow", False)),
                        "weekdayDescriptions": item.get("openingHours", {}).get("weekdayDescriptions", item.get("regularOpeningHours", {}).get("weekdayDescriptions", [])),
                        "periods": item.get("openingHours", {}).get("periods", item.get("regularOpeningHours", {}).get("periods", [])),
                        "nextOpenTime": None
                    },
                    
                    # Media
                    "media": {
                        "photos": item.get("media", {}).get("photos", item.get("photos", []))
                    },
                    
                    # Reviews
                    "reviews": item.get("reviews", []),
                    
                    # Features
                    "features": item.get("features", {}),
                    
                    # Extra Information
                    "extra": item.get("extra", {}),
                    
                    # Maps
                    "maps": item.get("maps", {}),
                    
                    # Subdestinations & Containing Places
                    "subDestinations": item.get("subDestinations", []),
                    "containingPlaces": item.get("containingPlaces", []),
                    
                    # EV & Fuel
                    "ev": item.get("ev", {}),
                    
                    # Metadata
                    "metadata": {
                        "lastFetchedAt": now,
                        "expiresAt": now + timedelta(days=1),
                        "fetchVersion": 1,
                        "source": "google_places"
                    }
                }
                locations.append(doc)
            except Exception as e:
                print(f"⚠️ Skipping item: {e}")
                continue
        if locations:
            await collection.insert_many(locations)
            print(f"✅ Inserted {len(locations)} places from JSON.")
    except Exception as e:
        print(f"❌ Error seeding data: {e}")

async def seed_specific_places(file_path: str, count: int = 2):
    """
    Seed specific number of places from JSON file to MongoDB
    
    Args:
        file_path (str): Path to JSON file
        count (int): Number of places to insert (default: 2)
    """
    print(f"⏳ Seeding {count} places from {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Limit to requested count
        data_to_seed = data[:count]
        print(f"📊 Found {len(data)} total places, seeding {len(data_to_seed)}...\n")
        
        locations = []
        for idx, item in enumerate(data_to_seed, 1):
            try:
                # Check if place already exists
                existing = await collection.find_one({
                    "google_place_id": item.get("google_place_id", "")
                })
                
                if existing:
                    print(f"⏭️  [{idx}/{len(data_to_seed)}] Skipped: {item.get('core', {}).get('name', 'Unknown')} (already exists)")
                    continue
                
                now = datetime.utcnow()
                doc = {
                    # ID & Basic
                    "google_place_id": item.get("google_place_id", item.get("id", "")),
                    
                    # Core Information
                    "core": {
                        "name": item.get("core", {}).get("name", item.get("displayName", {}).get("text", "Unknown")),
                        "primaryType": item.get("core", {}).get("primaryType", item.get("primaryType", "")),
                        "types": item.get("core", {}).get("types", item.get("types", [])),
                        "location": {
                            "lat": item.get("core", {}).get("location", {}).get("lat", item.get("location", {}).get("latitude", 0.0)),
                            "lng": item.get("core", {}).get("location", {}).get("lng", item.get("location", {}).get("longitude", 0.0))
                        },
                        "rating": item.get("core", {}).get("rating", item.get("rating", 0.0)),
                        "userRatingCount": item.get("core", {}).get("userRatingCount", item.get("userRatingCount", 0)),
                        "priceLevel": item.get("core", {}).get("priceLevel", None),
                        "businessStatus": item.get("core", {}).get("businessStatus", item.get("businessStatus", "OPERATIONAL"))
                    },
                    
                    # Contact & Address
                    "contact": {
                        "phone": item.get("contact", {}).get("phone", ""),
                        "website": item.get("contact", {}).get("website", item.get("websiteUri", ""))
                    },
                    "address": {
                        "formatted": item.get("address", {}).get("formatted", item.get("formattedAddress", ""))
                    },
                    
                    # Opening Hours
                    "openingHours": {
                        "openNow": item.get("openingHours", {}).get("openNow", item.get("regularOpeningHours", {}).get("openNow", False)),
                        "weekdayDescriptions": item.get("openingHours", {}).get("weekdayDescriptions", item.get("regularOpeningHours", {}).get("weekdayDescriptions", [])),
                        "periods": item.get("openingHours", {}).get("periods", item.get("regularOpeningHours", {}).get("periods", [])),
                        "nextOpenTime": None
                    },
                    
                    # Media
                    "media": {
                        "photos": item.get("media", {}).get("photos", item.get("photos", []))
                    },
                    
                    # Reviews
                    "reviews": item.get("reviews", []),
                    
                    # Features
                    "features": item.get("features", {}),
                    
                    # Extra Information
                    "extra": item.get("extra", {}),
                    
                    # Maps
                    "maps": item.get("maps", {}),
                    
                    # Subdestinations & Containing Places
                    "subDestinations": item.get("subDestinations", []),
                    "containingPlaces": item.get("containingPlaces", []),
                    
                    # EV & Fuel
                    "ev": item.get("ev", {}),
                    
                    # Metadata
                    "metadata": {
                        "lastFetchedAt": now,
                        "expiresAt": now + timedelta(days=1),
                        "fetchVersion": 1,
                        "source": "google_places"
                    }
                }
                locations.append(doc)
                print(f"✅ [{idx}/{len(data_to_seed)}] Added: {item.get('core', {}).get('name', 'Unknown')} ⭐ {item.get('core', {}).get('rating', 'N/A')}")
            except Exception as e:
                print(f"⚠️  [{idx}/{len(data_to_seed)}] Error processing item: {e}")
                continue
        
        if locations:
            result = await collection.insert_many(locations)
            print(f"\n✅ Successfully inserted {len(locations)} places!")
            print(f"📊 Total places in database: {await collection.count_documents({})}")
            return result
        else:
            print(f"\n⚠️  No new places to insert")
            return None
            
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        return None


def _convert_objectid_to_str(doc):
    """Convert BSON ObjectId to string for JSON serialization"""
    if doc and isinstance(doc, dict):
        if '_id' in doc:
            doc['_id'] = str(doc['_id'])
    return doc

async def find_place_by_name(name_query: str):
    result = await collection.find_one({"core.name": {"$regex": name_query, "$options": "i"}})
    return _convert_objectid_to_str(result)

async def find_places_by_types(interests: list, limit=50):
    cursor = collection.find({"core.types": {"$in": interests}}).sort("core.rating", -1).limit(limit)
    results = await cursor.to_list(length=limit)
    return [_convert_objectid_to_str(doc) for doc in results]

async def find_place_by_id(place_id: str):
    """ค้นหาสถานที่ด้วย ID จาก MongoDB"""
    result = await collection.find_one({"google_place_id": place_id})
    return _convert_objectid_to_str(result)