from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from src.api.routes_chatbot import router as chatbot_router
from src.api.routes_tripplanner import router as tripplanner_router
from src.core.database import seed_data_if_empty
from src.core.config import JSON_FILE_PATH

app = FastAPI(title="Khon Kaen AI Trip Planner (Modular Architecture)")

# 🔧 Add CORS Middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (can be restricted to specific domains in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods including OPTIONS
    allow_headers=["*"],  # Allow all headers
)

# นำเข้า Routes จากโฟลเดอร์ api
app.include_router(chatbot_router)
app.include_router(tripplanner_router)

@app.on_event("startup")
async def startup_event():
    """โหลดข้อมูล khon_kaen_places.json เข้า MongoDB เมื่อ app เริ่มทำงาน"""
    file_path = JSON_FILE_PATH
    if not os.path.isabs(file_path):
        # ถ้า path เป็น relative ให้แปลงเป็น absolute path
        file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), file_path)
    await seed_data_if_empty(file_path)

@app.get("/")
def read_root():
    return {"message": "Welcome to Khon Kaen Trip API! ไปที่ /docs เพื่อดูวิธีใช้งาน"}