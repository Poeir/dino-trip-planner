import json
import chromadb
from chromadb.utils import embedding_functions
import os

# 1. กำหนด Path
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
json_path = os.path.join(base_dir, 'khon_kaen_places.json')
db_path = os.path.join(base_dir, 'chroma_db')

print("⏳ กำลังโหลดข้อมูล JSON...")
with open(json_path, 'r', encoding='utf-8') as f:
    places = json.load(f)

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

print("⏳ กำลังแปลงข้อมูลที่อัปเกรดแล้วเป็น Vector...")
for place in places:
    # --- 1. ดึงข้อมูลพื้นฐาน ---
    place_id = place.get('id')
    if not place_id:
        continue
        
    name = place.get('displayName', {}).get('text', 'Unknown')
    types_list = place.get('types', [])
    types_str = ", ".join(types_list)
    address = place.get('formattedAddress', 'ไม่ระบุ')
    
    # --- 2. ดึงคะแนนและรีวิว (สำคัญมากสำหรับหาความรู้สึก/Vibe) ---
    rating = place.get('rating', 'ไม่มีคะแนน')
    user_ratings_total = place.get('userRatingCount', 0)
    summary = place.get('editorialSummary', {}).get('text', '')
    
    # --- 3. ดึงเรื่องที่จอดรถ (สำคัญสำหรับคนขับรถ) ---
    parking = []
    parking_opts = place.get('parkingOptions', {})
    if parking_opts.get('freeParkingLot'): parking.append("มีที่จอดรถฟรี")
    if parking_opts.get('paidParkingLot'): parking.append("มีที่จอดรถเสียเงิน")
    if parking_opts.get('freeStreetParking'): parking.append("จอดรถริมถนนได้ฟรี")
    
    # --- 4. ดึงเรื่องสิ่งอำนวยความสะดวก (Accessibility) ---
    accessibility = []
    acc_opts = place.get('accessibilityOptions', {})
    if acc_opts.get('wheelchairAccessibleEntrance'): accessibility.append("ทางเข้าสำหรับวีลแชร์")
    if acc_opts.get('wheelchairAccessibleParking'): accessibility.append("ที่จอดรถสำหรับวีลแชร์")
    if acc_opts.get('wheelchairAccessibleRestroom'): accessibility.append("ห้องน้ำสำหรับวีลแชร์")
    
    # --- 5. ดึงรูปแบบการจ่ายเงิน (ถ้ามี) ---
    payments = []
    pay_opts = place.get('paymentOptions', {})
    if pay_opts.get('acceptsCreditCards'): payments.append("รับบัตรเครดิต")
    if pay_opts.get('acceptsDebitCards'): payments.append("รับบัตรเดบิต")
    
    # ==========================================
    # 🌟 ประกอบร่างข้อความ (Prompt Engineering สำหรับ Data)
    # ==========================================
    searchable_text = f"ชื่อสถานที่: {name}\n"
    searchable_text += f"หมวดหมู่: {types_str}\n"
    
    if summary: 
        searchable_text += f"รายละเอียด: {summary}\n"
        
    searchable_text += f"ความนิยม: {rating} ดาว (จาก {user_ratings_total} รีวิว)\n"
    
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
    metadatas.append({
        "name": name, 
        "types": types_str,
        "rating": float(rating) if isinstance(rating, (int, float)) else 0.0
    })
    ids.append(place_id)

# เพิ่มข้อมูลลง Database
collection.add(documents=documents, metadatas=metadatas, ids=ids)

print(f"✅ อัปเกรด Vector Database สำเร็จ! นำเข้าข้อมูล {len(documents)} สถานที่แบบจัดเต็มแล้ว")