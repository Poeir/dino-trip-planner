from openai import OpenAI
from src.core.config import API_KEY, BASE_URL

# สร้าง Client ตัวเดียว แล้วให้ไฟล์อื่นดึงไปใช้ (Singleton pattern)
client = OpenAI(api_key=API_KEY, base_url=BASE_URL)