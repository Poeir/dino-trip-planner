import os
from dotenv import load_dotenv, find_dotenv

# ค้นหาและโหลดไฟล์ .env
load_dotenv(find_dotenv())

API_KEY = os.environ.get("API_KEY")
BASE_URL = "https://gen.ai.kku.ac.th/api/v1"
MODEL_NAME = "gemini-2.5-flash"  # เปลี่ยนชื่อโมเดลตรงนี้จุดเดียว ใช้ได้ทั้งโปรเจกต์
JSON_FILE_PATH = "khon_kaen_places.json"

MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://localhost:27017/DinoDB")

if not API_KEY:
    raise ValueError("🚨 ระบบหา API_KEY ไม่เจอ! ตรวจสอบไฟล์ .env ครับ")