"""
ดึงข้อมูล Places จาก Google Maps API V1 (searchNearby)
และ export เป็น JSON เหมือน khon_kaen_places.json

สถานที่ขอนแก่น: 16.4322, 102.8236
"""

import os
import json
import requests
from dotenv import load_dotenv, find_dotenv
from datetime import datetime
from pathlib import Path

# โหลด .env
load_dotenv(find_dotenv())

# ค่าคงที่
SEARCH_ENDPOINT = "https://places.googleapis.com/v1/places:searchNearby"
DETAIL_ENDPOINT = "https://places.googleapis.com/v1/places/"
KHON_KAEN_LAT = 16.4322
KHON_KAEN_LNG = 102.8236
SEARCH_RADIUS = 15000  # 15km
PER_REQUEST_LIMIT = 20  # API จำกัดสูงสุด 20 ต่อ request
TOTAL_RESULTS_TARGET = 100  # ต้องการดึงทั้งหมด 100 places

# ดึง API Key จาก environment
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("❌ หา GOOGLE_API_KEY ไม่เจอใน .env")

print(f"✓ API Key: {GOOGLE_API_KEY[:20]}...")


def search_nearby_places(lat=KHON_KAEN_LAT, lng=KHON_KAEN_LNG, radius=SEARCH_RADIUS, target_count=TOTAL_RESULTS_TARGET):
    """ค้นหา Places ใกล้เคียง (รองรับ pagination)"""
    print(f"\n🔍 กำลังค้นหา Places ที่ [{lat}, {lng}] ในรัศมี {radius}m...")
    print(f"   เป้าหมาย: {target_count} places")
    
    headers = {
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.name,places.id,places.displayName,places.types,places.location,places.rating,places.userRatingCount"
    }
    
    all_places = []
    page_token = None
    round_count = 0
    
    while len(all_places) < target_count:
        round_count += 1
        payload = {
            "includedTypes": [
                "tourist_attraction",
                "restaurant",
                "museum",
                "cafe",
                "park",
                "flea_market",
                "shopping_mall",
                "historical_landmark",
                "buddhist_temple",
                "art_gallery"
            ],
            "maxResultCount": PER_REQUEST_LIMIT,
            "locationRestriction": {
                "circle": {
                    "center": {
                        "latitude": lat,
                        "longitude": lng,
                    },
                    "radius": radius,
                },
            },
        }
        
        # ถ้ามี pageToken ก่อนหน้า ให้เพิ่มลงใน payload
        if page_token:
            payload["pageToken"] = page_token
        
        try:
            print(f"  [รอบที่ {round_count}] ดึง {PER_REQUEST_LIMIT} places โดย page_token: {'[มี]' if page_token else '[ไม่มี]'}...", end=" ")
            response = requests.post(SEARCH_ENDPOINT, json=payload, headers=headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            places = data.get("places", [])
            
            if not places:
                print("ไม่มีข้อมูลกลับมา")
                break
            
            all_places.extend(places)
            print(f"✓ ({len(all_places)} รวม)")
            
            # ตรวจสอบ nextPageToken
            page_token = data.get("nextPageToken")
            if not page_token:
                print(f"  ✓ ไม่มี page token ต่อ - สิ้นสุดการค้นหา")
                break
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error")
            print(f"❌ Error ในการค้นหา: {e}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    print(f"   Response: {e.response.json()}")
                except:
                    print(f"   Response: {e.response.text}")
            break
    
    # ตัด excess places ถ้าได้มากกว่าเป้าหมาย
    all_places = all_places[:target_count]
    print(f"\n✓ ได้ {len(all_places)} places ทั้งหมด")
    return all_places


def get_place_detail(place_id):
    """ดึงรายละเอียด Place เพิ่มเติม"""
    headers = {
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "id,displayName,types,location,rating,userRatingCount,formattedAddress,websiteUri,googleMapsUri,regularOpeningHours,businessStatus,primaryType,reviews,photos"
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
        print(f"⚠️  Error ดึงรายละเอียด {place_id}: {e}")
        return None


def format_place_data(place_detail):
    """แปลงข้อมูล Google API เป็นรูปแบบเดียวกับ khon_kaen_places.json"""
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
        "reviews": place_detail.get("reviews", [])[:3],  # แสดงแค่ 3 reviews
    }
    
    return formatted_place


def save_to_json(places_data, filename="output_places.json"):
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
    print("  Fetch Places from Google Maps API")
    print(f"  Location: Khon Kaen [{KHON_KAEN_LAT}, {KHON_KAEN_LNG}]")
    print(f"  Target Results: {TOTAL_RESULTS_TARGET}")
    print(f"  Per Request: {PER_REQUEST_LIMIT} (API limit)")
    print("=" * 60)
    
    # ค้นหา places
    search_results = search_nearby_places()
    
    if not search_results:
        print("❌ ไม่พบ places กลับมา")
        return
    
    # ดึงรายละเอียดแต่ละ place
    print(f"\n📋 กำลังดึงรายละเอียด {len(search_results)} places...")
    formatted_places = []
    
    for idx, place in enumerate(search_results, 1):
        place_id = place.get("id", "")
        display_name = place.get("displayName", {}).get("text", place_id)
        
        print(f"  [{idx}/{len(search_results)}] {display_name}...", end=" ")
        
        detail = get_place_detail(place_id)
        formatted = format_place_data(detail)
        
        if formatted:
            formatted_places.append(formatted)
            print("✓")
        else:
            print("⚠️")
    
    # บันทึกลงไฟล์
    if formatted_places:
        output_file = save_to_json(formatted_places)
        print(f"\n✅ สำเร็จ! บันทึก {len(formatted_places)} places")
        print(f"   ไฟล์: {output_file}")
    else:
        print("\n❌ ไม่สามารถบันทึกข้อมูล")


if __name__ == "__main__":
    main()
