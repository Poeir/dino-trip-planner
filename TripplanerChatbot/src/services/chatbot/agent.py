from openai import AsyncOpenAI
from src.core.config import API_KEY, BASE_URL, MODEL_NAME
from src.services.rag.retriever import PlaceRetriever
from typing import List, Dict

class RAGChatbotService:
    def __init__(self):
        # 1. โหลดตัวค้นหา (Retriever) ที่เราทำเตรียมไว้
        self.retriever = PlaceRetriever()
        self.client = AsyncOpenAI(api_key=API_KEY, base_url=BASE_URL)
        self.model_name = MODEL_NAME
        
    async def chat(self, user_message: str, history: List[Dict[str, str]] = None) -> str:
        if history is None:
            history = []

        print(f"💬 [Chatbot] ผู้ใช้ถามว่า: {user_message}")
        
        search_query = user_message
        if history:
            # ถ้ามีประวัติ ให้หยิบเอาข้อความล่าสุด (ที่บอทเพิ่งตอบไป) มาต่อหน้าคำถามใหม่
            # เพื่อให้ ChromaDB รู้ว่ากำลังคุยเรื่องสถานที่ไหนอยู่
            last_msg = history[-1]['content']
            
            # ตัดให้สั้นหน่อย เอาแค่ 100 ตัวอักษรแรกของคำตอบเก่า เพื่อไม่ให้ Query ยาวเกินไป
            search_query = f"{last_msg[:100]}... {user_message}"


        # 2. ให้ Retriever ไปค้นหาข้อมูลสถานที่ที่เกี่ยวข้องกับคำถาม
        # ดึงมาสัก 3-5 สถานที่ที่ความหมายตรงที่สุด
        print(f"[RAG] Searching with keyword: {search_query}")
        rag_results = self.retriever.search(query=search_query, limit=3)
        
        # 3. เอาข้อความที่ค้นเจอ มาร้อยเรียงเป็น Context (บริบท)
        context_texts = []
        for res in rag_results:
            context_texts.append(res['document'])
            
        context_str = "\n\n---\n\n".join(context_texts)
        if not context_str:
            context_str = "ไม่มีข้อมูลสถานที่ที่ตรงกับคำถามในฐานข้อมูล"
            
        # 4. เขียน Prompt ควบคุมความประพฤติบอท (System Prompt)
        # 🚨 หัวใจสำคัญของการทำ RAG อยู่ที่นี่!
        system_prompt = f"""
        คุณคือ 'Dino' ผู้ช่วยส่วนตัวสำหรับการท่องเที่ยวในจังหวัดขอนแก่น เป็นมิตรและสุภาพ
        
        [กฎเหล็ก]
        1. กรุณาตอบคำถามของผู้ใช้โดยอ้างอิงจาก [ข้อมูลบริบท] ด้านล่างนี้เท่านั้น
        2. หากมีข้อมูลในบริบท ให้สรุปและตอบอย่างเป็นธรรมชาติ
        3. หากคำถามของผู้ใช้ ไม่เกี่ยวข้องกับ [ข้อมูลบริบท] เลย หรือคุณไม่มีข้อมูล ให้ตอบอย่างสุภาพว่า "(Dino) ไม่มีข้อมูลในส่วนนี้ครับ ลองถามเกี่ยวกับสถานที่ท่องเที่ยว ร้านอาหาร หรือคาเฟ่ในขอนแก่นดูนะครับ"
        4. ห้ามแต่งเติม หรือเดาข้อมูลสถานที่ขึ้นมาเองเด็ดขาด
        
        [ข้อมูลบริบท]
        {context_str}
        """
        
        # 5. ส่งคำถามและบริบทไปให้ LLM ประมวลผล
        messages = [{"role": "system", "content": system_prompt}]
        
        # ใส่ประวัติการคุยเดิมเข้าไป (จำกัดแค่ 4 ข้อความล่าสุด (ไป 2 กลับ 2) เพื่อประหยัด Token และไม่ให้บอทสับสน)
        for msg in history[-4:]:
            messages.append(msg)
            
        # ใส่คำถามใหม่ล่าสุดปิดท้าย
        messages.append({"role": "user", "content": user_message})
        
        response = await self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=0.3
        )
        
        return response.choices[0].message.content