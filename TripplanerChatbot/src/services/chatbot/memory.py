# ใช้ Dictionary เก็บประวัติการแชทชั่วคราว (แยกตาม session_id ของผู้ใช้)
chat_history = {}

def get_history(session_id: str):
    if session_id not in chat_history:
        chat_history[session_id] = []
    return chat_history[session_id]

def add_message(session_id: str, role: str, content: str):
    if session_id not in chat_history:
        chat_history[session_id] = []
        
    chat_history[session_id].append({"role": role, "content": content})
    
    # จำกัดความจำแค่ 10 ข้อความล่าสุด เพื่อไม่ให้เปลือง Token
    if len(chat_history[session_id]) > 10:
        chat_history[session_id] = chat_history[session_id][-10:]