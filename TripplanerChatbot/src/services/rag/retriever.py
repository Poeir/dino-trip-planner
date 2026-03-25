import os
import chromadb
from chromadb.utils import embedding_functions

# 1. ระบุ Path กลับไปหาโฟลเดอร์ chroma_db ที่หน้าโปรเจกต์
# (ถอยหลัง 3 ขั้น: rag -> services -> src -> Root)
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
DB_PATH = os.path.join(ROOT_DIR, 'chroma_db')

class PlaceRetriever:
    def __init__(self):
        print("[*] Connecting to Vector Database...")
        self.client = chromadb.PersistentClient(path=DB_PATH)
        
        # ใช้ Model ตัวเดียวกับตอนสร้าง DB
        self.ef = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="paraphrase-multilingual-MiniLM-L12-v2"
        )
        
        # ดึง Collection (ตารางข้อมูล) ขึ้นมา
        try:
            self.collection = self.client.get_collection(
                name="places_collection",
                embedding_function=self.ef
            )
        except Exception as e:
            raise ValueError(f"❌ หา Collection ไม่เจอ! กรุณารัน scripts/setup_vector_db.py ก่อน ({e})")

    def search(self, query: str, limit: int = 5):
        """รับคำค้นหาภาษาคน คืนค่าสถานที่ที่ตรงความหมายที่สุด"""
        results = self.collection.query(
            query_texts=[query],
            n_results=limit
        )
        
        formatted_results = []
        # เช็คว่ามีข้อมูลตอบกลับมาไหม
        if results['ids'] and len(results['ids'][0]) > 0:
            for i in range(len(results['ids'][0])):
                formatted_results.append({
                    "id": results['ids'][0][i],
                    "name": results['metadatas'][0][i]['name'],
                    "rating": results['metadatas'][0][i]['rating'],
                    "document": results['documents'][0][i],
                    # ค่ายิ่งน้อยแปลว่า "ความหมายยิ่งใกล้เคียงกัน"
                    "distance": round(results['distances'][0][i], 4) 
                })
                
        return formatted_results
