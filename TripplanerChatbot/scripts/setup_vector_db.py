import json
import chromadb
from chromadb.utils import embedding_functions
import os
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.core.config import MONGO_DETAILS
import motor.motor_asyncio

# 1. กำหนด Path
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_path = os.path.join(base_dir, 'chroma_db')

print("⏳ กำลังเชื่อมต่อ MongoDB DinoDB...")

async def fetch_places_from_mongodb():
    """ดึงข้อมูล places จาก MongoDB DinoDB"""
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
    db = client.DinoDB
    collection = db.get_collection("places")
    
    places = await collection.find({}).to_list(length=None)
    print(f"✅ ดึงข้อมูล {len(places)} สถานที่จาก MongoDB")
    return places

# ดึงข้อมูลจาก MongoDB
try:
    places = asyncio.run(fetch_places_from_mongodb())
except Exception as e:
    print(f"❌ Error connecting to MongoDB: {e}")
    print("⏳ กำลังสำรอง ใช้ khon_kaen_places.json แทน...")
    json_path = os.path.join(base_dir, 'khon_kaen_places.json')
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            places = json.load(f)
    else:
        print("❌ ไม่พบไฟล์ JSON")
        sys.exit(1)

chroma_client = chromadb.PersistentClient(path=db_path)

print("⏳ กำลังโหลด Embedding Model...")
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="paraphrase-multilingual-MiniLM-L12-v2"
)

# ลบ Collection เก่าทิ้งเพื่ออัปเดตข้อมูลใหม่
try:
    chroma_client.delete_collection(name="places_collection")
except:
    pass

collection = chroma_client.create_collection(
    name="places_collection", 
    embedding_function=sentence_transformer_ef
)

documents = []
metadatas = []
ids = []

print("⏳ กำลังแปลงข้อมูล DinoDB เป็น Vector...")
for place in places:
    # Handle MongoDB _id field
    if "_id" in place:
        del place["_id"]
    
    # --- 1. ดึงข้อมูลพื้นฐาน จาก core (DinoDB schema) ---
    core = place.get('core', {})
    place_id = place.get('google_place_id')
    if not place_id:
        continue
        
    name = core.get('name', 'Unknown')
    types_list = core.get('types', [])
    types_str = ", ".join(types_list)
    address = place.get('address', {}).get('formatted', 'ไม่ระบุ')
    
    # --- 2. ดึงคะแนนและรีวิว (สำคัญมากสำหรับหาความรู้สึก/Vibe) ---
    rating = core.get('rating', 'ไม่มีคะแนน')
    user_ratings_total = core.get('userRatingCount', 0)
    summary = place.get('extra', {}).get('editorialSummary', '')
    
    # --- 3. ดึงเรื่องที่จอดรถ (สำคัญสำหรับคนขับรถ) ---
    parking = []
    parking_opts = place.get('extra', {}).get('parkingOptions', {})
    if parking_opts.get('freeParkingLot'): parking.append("มีที่จอดรถฟรี")
    if parking_opts.get('paidParkingLot'): parking.append("มีที่จอดรถเสียเงิน")
    if parking_opts.get('freeStreetParking'): parking.append("จอดรถริมถนนได้ฟรี")
    
    # --- 4. ดึงเรื่องสิ่งอำนวยความสะดวก (Accessibility) ---
    accessibility = []
    acc_opts = place.get('extra', {}).get('accessibilityOptions', {})
    if acc_opts.get('wheelchairAccessibleEntrance'): accessibility.append("ทางเข้าสำหรับวีลแชร์")
    if acc_opts.get('wheelchairAccessibleParking'): accessibility.append("ที่จอดรถสำหรับวีลแชร์")
    if acc_opts.get('wheelchairAccessibleRestroom'): accessibility.append("ห้องน้ำสำหรับวีลแชร์")
    
    # --- 5. ดึงรูปแบบการจ่ายเงิน (ถ้ามี) ---
    payments = []
    pay_opts = place.get('extra', {}).get('paymentOptions', {})
    if pay_opts.get('acceptsCreditCards'): payments.append("รับบัตรเครดิต")
    if pay_opts.get('acceptsDebitCards'): payments.append("รับบัตรเดบิต")
    
    # --- 6. ดึงเรื่องฟีเจอร์เพิ่มเติม (Services/Features) ---
    features = []
    features_opts = place.get('features', {})
    if features_opts.get('takeout'): features.append("บริการซื้อกลับบ้าน")
    if features_opts.get('delivery'): features.append("บริการส่งอาหาร")
    if features_opts.get('dineIn'): features.append("รับประทานในร้าน")
    if features_opts.get('liveMusic'): features.append("มีเพลงสด")
    if features_opts.get('outdoorSeating'): features.append("นั่งกลางแจ้ง")
    if features_opts.get('goodForGroups'): features.append("เหมาะสำหรับกลุ่ม")
    if features_opts.get('servesBreakfast'): features.append("เสิร์ฟอาหารเช้า")
    if features_opts.get('servesLunch'): features.append("เสิร์ฟอาหารกลางวัน")
    if features_opts.get('servesDinner'): features.append("เสิร์ฟอาหารค่ำ")
    
    # ==========================================
    # 🌟 ประกอบร่างข้อความ (Prompt Engineering สำหรับ Data)
    # ==========================================
    searchable_text = f"ชื่อสถานที่: {name}\n"
    searchable_text += f"หมวดหมู่: {types_str}\n"
    
    if summary: 
        searchable_text += f"รายละเอียด: {summary}\n"
        
    searchable_text += f"ความนิยม: {rating} ดาว (จาก {user_ratings_total} รีวิว)\n"
    
    if features:
        searchable_text += f"บริการ/ฟีเจอร์: {', '.join(features)}\n"
    
    if parking: 
        searchable_text += f"ที่จอดรถ: {', '.join(parking)}\n"
        
    if accessibility: 
        searchable_text += f"วีลแชร์/ผู้สูงอายุ: {', '.join(accessibility)}\n"
        
    if payments: 
        searchable_text += f"การชำระเงิน: {', '.join(payments)}\n"
        
    searchable_text += f"ที่อยู่: {address}"

    # บันทึกข้อมูล
    documents.append(searchable_text)
    
    # metadatas เก็บไว้ใช้ตอนกรองข้อมูล (Filter) โดยไม่ต้องค้นหาผ่าน Vector
    # ประเมินค่า rating ให้เป็นตัวเลข (DinoDB มี rating เป็น float)
    rating_value = 0.0
    if isinstance(rating, (int, float)):
        rating_value = float(rating)
    elif isinstance(rating, str) and rating != 'ไม่มีคะแนน':
        try:
            rating_value = float(rating)
        except:
            rating_value = 0.0
    
    metadatas.append({
        "name": name, 
        "types": types_str,
        "id": place_id,
        "rating": rating_value,
        "address": address
    })
    ids.append(place_id)

# เพิ่มข้อมูลลง Database
collection.add(documents=documents, metadatas=metadatas, ids=ids)

print(f"\n✅ สำเร็จ! Vector Database อัปเดตจาก DinoDB แล้ว")
print(f"📊 นำเข้าข้อมูล: {len(documents)} สถานที่")
print(f"📁 Vector DB Location: {db_path}")
print(f"🔍 Collection: places_collection")