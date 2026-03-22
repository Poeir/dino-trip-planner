from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from src.services.chatbot.agent import RAGChatbotService

# สร้าง Router สำหรับ Chatbot
router = APIRouter(prefix="/chat", tags=["Chatbot"])

chatbot_service = RAGChatbotService()

# 1. สร้างโครงสร้างสำหรับเก็บข้อความแต่ละบรรทัด
class ChatMessage(BaseModel):
    role: str       # จะเป็น "user" หรือ "assistant" (บอท)
    content: str    # ข้อความแชท

# 2. อัปเดต Request ให้รับ history (เป็น Optional เผื่อเป็นการทักทายครั้งแรก)
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # แปลง Pydantic Model ให้เป็น Dictionary ธรรมดาเพื่อส่งเข้า Agent
    history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.history]
    
    # ส่งทั้งคำถามใหม่ และ ประวัติการแชท ไปให้ Service ประมวลผล
    reply_message = await chatbot_service.chat(request.message, history=history_dicts)
    
    return ChatResponse(reply=reply_message)