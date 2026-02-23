from fastapi import FastAPI
from src.api.routes_chatbot import router as chatbot_router
from src.api.routes_tripplanner import router as tripplanner_router

app = FastAPI(title="Khon Kaen AI Trip Planner (Modular Architecture)")

# นำเข้า Routes จากโฟลเดอร์ api
app.include_router(chatbot_router)
app.include_router(tripplanner_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Khon Kaen Trip API! ไปที่ /docs เพื่อดูวิธีใช้งาน"}