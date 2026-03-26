#!/usr/bin/env python3
"""
Seed script to insert ALL places (Cafes, Restaurants, Tourist Attractions) into MongoDB
Combines data from 3 JSON files:
  - data/output_places_multi_cafe.json
  - data/output_places_multi_restaurants.json
  - data/output_places_multi_tourist_attraction.json

Usage: python seed_all_places.py [--limit N] [--type TYPE]
  --limit N: limit records per category (default: all)
  --type TYPE: seed only specific type (cafe, restaurant, attraction) default: all
  
Example:
  python seed_all_places.py                          # Seed all
  python seed_all_places.py --limit 100              # 100 per category
  python seed_all_places.py --type cafe --limit 200  # 200 cafes only
"""
import asyncio
import json
import sys
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime, timedelta

# Add parent directory to path for imports (src is at parent level)
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.core.config import MONGO_DETAILS
import motor.motor_asyncio


class PlaceSeeder:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.data_dir = self.base_dir / "data"
        self.client = None
        self.db = None
        self.collection = None
        self.stats = {
            "cafe": 0,
            "restaurant": 0,
            "attraction": 0,
            "total": 0,
            "skipped": 0,
            "errors": 0
        }
        
    async def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
            self.db = self.client.DinoDB
            self.collection = self.db.get_collection("places")
            
            # Test connection
            await self.db.command("ping")
            print("✅ MongoDB connected successfully")
            
            # Create Unique Index matching Mongoose
            await self.collection.create_index("google_place_id", unique=True)
            
            return True
        except Exception as e:
            print(f"❌ MongoDB connection failed: {e}")
            return False
    
    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
    
    def load_json_file(self, file_path: Path) -> List[Dict]:
        """Load JSON file and return list of places"""
        try:
            if not file_path.exists():
                print(f"⚠️  File not found: {file_path}")
                return []
            
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if isinstance(data, list):
                return data
            elif isinstance(data, dict) and 'places' in data:
                return data['places']
            else:
                return []
        except Exception as e:
            print(f"❌ Error loading {file_path}: {e}")
            return []

    
    def transform_place_document(self, place: Dict, category: str) -> Dict[str, Any]:
        """Transform place from JSON to MongoDB document format matching PlaceSchema"""
        try:
            google_place_id = place.get("google_place_id", place.get("id", ""))
            if not google_place_id:
                return None
            
            # ===== Core =====
            core_data = place.get("core", {})
            
            raw_name = core_data.get("name") or place.get("displayName", "Unknown")
            name = raw_name.get("text", "Unknown") if isinstance(raw_name, dict) else str(raw_name)
            
            primary_type = core_data.get("primaryType", place.get("primaryType", ""))
            types = core_data.get("types", place.get("types", []))
            
            location = core_data.get("location", {})
            if not location or not location.get("lat"):
                location = {
                    "lat": float(place.get("location", {}).get("latitude", 0.0)),
                    "lng": float(place.get("location", {}).get("longitude", 0.0))
                }
            
            rating = core_data.get("rating", place.get("rating"))
            try: rating = float(rating) if rating else None
            except (ValueError, TypeError): rating = None
            
            user_rating_count = core_data.get("userRatingCount", place.get("userRatingCount", 0))
            try: user_rating_count = int(user_rating_count) if user_rating_count else 0
            except (ValueError, TypeError): user_rating_count = 0
            
            # ย้าย price_level มาไว้ที่นี่
            price_level = core_data.get("priceLevel", place.get("priceLevel"))
            
            # ===== Contact & Address =====
            contact_data = place.get("contact", {})
            phone = contact_data.get("phone", place.get("nationalPhoneNumber", ""))
            website = contact_data.get("website", place.get("websiteUri", ""))
            
            address_data = place.get("address", {})
            formatted_address = address_data.get("formatted", place.get("formattedAddress", ""))
            
            # ===== Opening Hours =====
            opening_hours = place.get("openingHours", place.get("regularOpeningHours", {}))
            
            # ===== Media (Photos) =====
            media_data = place.get("media", {})
            raw_photos = media_data.get("photos", place.get("photos", []))
            photos = []
            for p in raw_photos:
                photos.append({
                    "name": p.get("name", ""),
                    "width": int(p.get("widthPx", p.get("width", 0))),
                    "height": int(p.get("heightPx", p.get("height", 0)))
                })
                
            # ===== Reviews =====
            raw_reviews = place.get("reviews", [])
            reviews = []
            for r in raw_reviews:
                text_obj = r.get("originalText", r.get("text", {}))
                text_content = text_obj.get("text", "") if isinstance(text_obj, dict) else str(text_obj)
                
                pub_time = r.get("publishTime")
                parsed_time = None
                if pub_time:
                    try:
                        parsed_time = datetime.fromisoformat(pub_time.replace('Z', '+00:00'))
                    except ValueError:
                        parsed_time = None

                reviews.append({
                    "authorName": r.get("authorAttribution", {}).get("displayName", ""),
                    "rating": float(r.get("rating", 0)),
                    "text": text_content,
                    "publishTime": parsed_time
                })
            
            # ===== Features =====
            features_data = place.get("features", {})
            features = {
                "takeout": features_data.get("takeout", False),
                "delivery": features_data.get("delivery", False),
                "dineIn": features_data.get("dineIn", True if category in ["cafe", "restaurant"] else False),
                "curbsidePickup": features_data.get("curbsidePickup", False),
                "reservable": features_data.get("reservable", False),

                "servesBreakfast": features_data.get("servesBreakfast", category == "cafe"),
                "servesLunch": features_data.get("servesLunch", category in ["cafe", "restaurant"]),
                "servesDinner": features_data.get("servesDinner", category in ["cafe", "restaurant"]),
                "servesBrunch": features_data.get("servesBrunch", category == "cafe"),
                "servesBeer": features_data.get("servesBeer", False),
                "servesWine": features_data.get("servesWine", False),
                "servesCocktails": features_data.get("servesCocktails", False),
                "servesDessert": features_data.get("servesDessert", category == "cafe"),
                "servesCoffee": features_data.get("servesCoffee", category == "cafe"),
                "servesVegetarianFood": features_data.get("servesVegetarianFood", False),

                "outdoorSeating": features_data.get("outdoorSeating", False),
                "liveMusic": features_data.get("liveMusic", False),
                "menuForChildren": features_data.get("menuForChildren", False),
                "goodForChildren": features_data.get("goodForChildren", False),
                "goodForGroups": features_data.get("goodForGroups", True if category in ["cafe", "restaurant"] else False),
                "goodForWatchingSports": features_data.get("goodForWatchingSports", False),

                "allowsDogs": features_data.get("allowsDogs", False),
                "restroom": features_data.get("restroom", True)
            }
            
            # ===== Extra Info =====
            # ดึงข้อมูลมาตรงๆ ตามที่มีในไฟล์ JSON
            extra = place.get("extra", {})
            
            # ===== Build Final Document =====
            current_time = datetime.utcnow()
            
            doc = {
                "google_place_id": google_place_id,
                
                "core": {
                    "name": name,
                    "primaryType": primary_type,
                    "types": types,
                    "location": location,
                    "rating": rating,
                    "userRatingCount": user_rating_count,
                    "priceLevel": price_level, # ใช้ตัวแปรที่เราย้ายขึ้นไปข้างบน
                    "businessStatus": core_data.get("businessStatus", place.get("businessStatus", "OPERATIONAL"))
                },
                
                "contact": {
                    "phone": phone,
                    "website": website
                },
                
                "address": {
                    "formatted": formatted_address
                },
                
                "openingHours": {
                    "openNow": opening_hours.get("openNow", False),
                    "weekdayDescriptions": opening_hours.get("weekdayDescriptions", []),
                    "periods": opening_hours.get("periods", []),
                    "nextOpenTime": None
                },
                
                "media": {
                    "photos": photos
                },
                
                "reviews": reviews,
                "features": features,
                "extra": extra, # ใส่ extra ที่ดึงมาตรงๆ ลงไปเลย
                
                "maps": place.get("maps", {
                    "googleMapsUri": place.get("googleMapsUri"),
                    "googleMapsLinks": place.get("googleMapsLinks")
                }),
                
                "subDestinations": place.get("subDestinations", []),
                "containingPlaces": place.get("containingPlaces", []),
                
                "ev": place.get("ev", {}),
                
                "metadata": {
                    "lastFetchedAt": current_time,
                    "expiresAt": current_time + timedelta(days=7),
                    "fetchVersion": 1,
                    "source": "google_places"
                },
                
                # Mongoose timestamps
                "createdAt": current_time,
                "updatedAt": current_time
            }
            
            return doc

        except Exception as e:
            print(f"❌ Error transforming place {place.get('google_place_id', 'unknown')}: {e}")
            return None
    
    async def seed_category(self, file_path: Path, category: str, limit: int = None) -> int:
        """Seed places from a specific JSON file"""
        print(f"\n📥 Seeding {category.upper()} places...")
        
        places = self.load_json_file(file_path)
        if not places:
            print(f"⚠️  No places found in {file_path.name}")
            return 0
        
        if limit:
            places = places[:limit]
        
        inserted_count = 0
        
        for i, place in enumerate(places, 1):
            try:
                google_place_id = place.get("google_place_id", place.get("id", ""))
                
                if not google_place_id:
                    self.stats["skipped"] += 1
                    continue
                
                # Check if already exists
                existing = await self.collection.find_one({"google_place_id": google_place_id})
                if existing:
                    self.stats["skipped"] += 1
                    continue
                
                # Transform and insert
                doc = self.transform_place_document(place, category)
                if doc:
                    await self.collection.insert_one(doc)
                    inserted_count += 1
                    self.stats[category] += 1
                    self.stats["total"] += 1
                    
                    if i % 50 == 0:
                        print(f"  ✓ Processed {i}/{len(places)} {category} places")
                else:
                    self.stats["errors"] += 1
                    
            except Exception as e:
                print(f"  ❌ Error inserting place: {e}")
                self.stats["errors"] += 1
        
        print(f"✅ Inserted {inserted_count} {category} places (skipped {self.stats['skipped']} existing)")
        return inserted_count
    
    async def run(self, categories: List[str] = None, limit: int = None):
        """Main seed function"""
        if not await self.connect():
            return False
        
        try:
            if categories is None:
                categories = ["cafe", "restaurant", "attraction"]
            
            print(f"🚀 Starting to seed places into MongoDB (DinoDB.places)")
            print(f"📊 Database: DinoDB, Collection: places")
            if limit:
                print(f"📌 Limit: {limit} records per category")
            print("=" * 60)
            
            # Seed each category
            if "cafe" in categories:
                await self.seed_category(self.data_dir / "output_places_multi_cafe.json", "cafe", limit)
            
            if "restaurant" in categories:
                await self.seed_category(self.data_dir / "output_places_multi_restaurants.json", "restaurant", limit)
            
            if "attraction" in categories:
                await self.seed_category(self.data_dir / "output_places_multi_tourist_attraction.json", "attraction", limit)
            
            # Print summary
            print("\n" + "=" * 60)
            print("📊 SEEDING SUMMARY:")
            print(f"  ☕ Cafes:        {self.stats['cafe']}")
            print(f"  🍽️  Restaurants: {self.stats['restaurant']}")
            print(f"  🏛️  Attractions: {self.stats['attraction']}")
            print(f"  ✅ Total Inserted: {self.stats['total']}")
            print(f"  ⏭️  Skipped (existing): {self.stats['skipped']}")
            print(f"  ❌ Errors:     {self.stats['errors']}")
            print("=" * 60)
            
            return True
            
        finally:
            await self.disconnect()

async def main():
    parser_args = {
        "limit": None,
        "categories": None
    }
    
    i = 1
    while i < len(sys.argv):
        if sys.argv[i] == "--limit" and i + 1 < len(sys.argv):
            parser_args["limit"] = int(sys.argv[i + 1])
            i += 2
        elif sys.argv[i] == "--type" and i + 1 < len(sys.argv):
            parser_args["categories"] = [sys.argv[i + 1]]
            i += 2
        else:
            i += 1
            
    seeder = PlaceSeeder()
    success = await seeder.run(
        categories=parser_args["categories"],
        limit=parser_args["limit"]
    )
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    asyncio.run(main())