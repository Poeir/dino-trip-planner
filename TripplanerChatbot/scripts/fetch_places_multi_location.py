"""
ดึงข้อมูล Places จาก Google Maps API V1 (searchNearby)
ค้นหาหลายพื้นที่พร้อมกัน + deduplication โดย place_id
และ export เป็น JSON เหมือน khon_kaen_places.json

ศูนย์กลาง: Khon Kaen (16.4322, 102.8236)
ค้นหาจาก 9 จุดรอบๆเมือง
"""

import os
import json
import requests
from dotenv import load_dotenv, find_dotenv
from pathlib import Path

# โหลด .env
load_dotenv(find_dotenv())

# ค่าคงที่
SEARCH_ENDPOINT = "https://places.googleapis.com/v1/places:searchNearby"
DETAIL_ENDPOINT = "https://places.googleapis.com/v1/places/"
SEARCH_RADIUS = 10000  # 10km

# ตำแหน่งค้นหาหลายจุด (รอบๆ Khon Kaen)
SEARCH_LOCATIONS = [
    {"name": "ศูนย์กลาง", "lat": 16.4322, "lng": 102.8236},
    {"name": "เหนือ", "lat": 16.48, "lng": 102.8236},
    {"name": "ใต้", "lat": 16.38, "lng": 102.8236},
    {"name": "ตะวันออก", "lat": 16.4322, "lng": 102.88},
    {"name": "ตะวันตก", "lat": 16.4322, "lng": 102.77},
    {"name": "ตะวันออกเฉียงเหนือ", "lat": 16.47, "lng": 102.87},
    {"name": "ตะวันออกเฉียงใต้", "lat": 16.39, "lng": 102.87},
    {"name": "ตะวันตกเฉียงเหนือ", "lat": 16.47, "lng": 102.77},
    {"name": "ตะวันตกเฉียงใต้", "lat": 16.39, "lng": 102.77},
]

# ดึง API Key จาก environment
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("❌ หา GOOGLE_API_KEY ไม่เจอใน .env")

print(f"✓ API Key: {GOOGLE_API_KEY[:20]}...")


def search_nearby_places(lat, lng, location_name=""):
    """ค้นหา Places ใกล้เคียงจากตำแหน่งหนึ่ง"""
    print(f"\n  📍 [{location_name}] ที่ [{lat}, {lng}]...", end=" ", flush=True)
    
    headers = {
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.name,places.id,places.displayName,places.types,places.location,places.rating,places.userRatingCount"
    }
    
    payload = {
        "includedTypes": [
            "tourist_attraction",
            "restaurant",
            "museum",
            "cafe",
            "park",
            "shopping_mall",
            "historical_landmark",
            "buddhist_temple",
            "art_gallery"
        ],
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": lat,
                    "longitude": lng,
                },
                "radius": SEARCH_RADIUS,
            },
        },
    }
    
    try:
        response = requests.post(SEARCH_ENDPOINT, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        
        places = response.json().get("places", [])
        print(f"✓ ({len(places)} places)")
        return places
        
    except requests.exceptions.RequestException as e:
        print(f"❌")
        print(f"    Error: {e}")
        return []


def get_place_detail(place_id):
    """ดึงรายละเอียด Place เพิ่มเติม"""
    headers = {
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "id,displayName,types,location,rating,userRatingCount,formattedAddress,websiteUri,googleMapsUri,regularOpeningHours,businessStatus,primaryType,reviews,photos,restroom,accessibilityOptions,pureServiceAreaBusiness,googleMapsLinks"
    }
    
    try:
        response = requests.get(
            f"{DETAIL_ENDPOINT}{place_id}?languageCode=th",
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.RequestException as e:
        return None


def format_place_data(place_detail):
    """แปลงข้อมูล Google API เป็นรูปแบบ khon_kaen_places.json"""
    if not place_detail:
        return None
    
    location = place_detail.get("location", {})
    formatted_address = place_detail.get("formattedAddress", "")
    display_name = place_detail.get("displayName", {})
    
    formatted_place = {
        "id": place_detail.get("id", ""),
        "types": place_detail.get("types", []),
        "formattedAddress": formatted_address,
        "location": {
            "latitude": location.get("latitude", 0),
            "longitude": location.get("longitude", 0),
        },
        "rating": place_detail.get("rating", 0),
        "googleMapsUri": place_detail.get("googleMapsUri", ""),
        "websiteUri": place_detail.get("websiteUri", ""),
        "regularOpeningHours": place_detail.get("regularOpeningHours", {}),
        "businessStatus": place_detail.get("businessStatus", ""),
        "userRatingCount": place_detail.get("userRatingCount", 0),
        "displayName": display_name,
        "primaryType": place_detail.get("primaryType", ""),
        "reviews": place_detail.get("reviews", [])[:3],
        "restroom": place_detail.get("restroom", False),
        "accessibilityOptions": place_detail.get("accessibilityOptions", {}),
        "pureServiceAreaBusiness": place_detail.get("pureServiceAreaBusiness", False),
        "googleMapsLinks": place_detail.get("googleMapsLinks", {}),
    }
    
    return formatted_place


def save_to_json(places_data, filename="output_places_multi.json"):
    """บันทึกข้อมูลลงไฟล์ JSON"""
    output_dir = Path(__file__).parent.parent / "data"
    output_dir.mkdir(exist_ok=True)
    
    output_file = output_dir / filename
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(places_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ บันทึกเสร็จ: {output_file}")
    return output_file


def main():
    print("=" * 60)
    print("  Fetch Places from Multiple Locations")
    print(f"  Total Locations: {len(SEARCH_LOCATIONS)}")
    print(f"  Per Location: 20 places")
    print(f"  Expected Total (before dedup): {len(SEARCH_LOCATIONS) * 20}")
    print("=" * 60)
    
    # เก็บ places โดยใช้ place_id เพื่อ deduplication
    places_dict = {}
    
    print("\n🔍 กำลังค้นหาจากหลายพื้นที่...")
    
    # ค้นหาจากแต่ละตำแหน่ง
    for loc in SEARCH_LOCATIONS:
        search_results = search_nearby_places(loc["lat"], loc["lng"], loc["name"])
        
        for place in search_results:
            place_id = place.get("id", "")
            
            # ข้ามหากซ้ำ
            if place_id in places_dict:
                continue
            
            places_dict[place_id] = place
    
    print(f"\n✓ รวมทั้งหมด (หลังเช็กซ้ำ): {len(places_dict)} unique places")
    
    # ดึงรายละเอียดสำหรับแต่ละ place
    print(f"\n📋 กำลังดึงรายละเอียด {len(places_dict)} places...")
    formatted_places = []
    
    for idx, (place_id, place) in enumerate(places_dict.items(), 1):
        display_name = place.get("displayName", {}).get("text", place_id)
        
        if idx % 10 == 0:
            print(f"  [{idx}/{len(places_dict)}] {display_name}...", end=" ", flush=True)
        
        detail = get_place_detail(place_id)
        formatted = format_place_data(detail)
        
        if formatted:
            formatted_places.append(formatted)
            if idx % 10 == 0:
                print("✓")
    
    # บันทึกลงไฟล์
    if formatted_places:
        output_file = save_to_json(formatted_places)
        print(f"\n✅ สำเร็จ! บันทึก {len(formatted_places)} places")
        print(f"   ไฟล์: {output_file}")
        print(f"\n📊 สรุป:")
        print(f"   • ค้นหา {len(SEARCH_LOCATIONS)} พื้นที่")
        print(f"   • ได้ {len(places_dict)} unique places (หลังเช็กซ้ำ)")
        print(f"   • บันทึก {len(formatted_places)} places ที่มีรายละเอียด")
    else:
        print("\n❌ ไม่สามารถบันทึกข้อมูล")


if __name__ == "__main__":
    main()
