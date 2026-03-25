#!/usr/bin/env python3
"""
Query and inspect Chroma Vector Database
Usage: python query_vector_db.py [command] [args]

Commands:
  count              - แสดงจำนวนข้อมูลทั้งหมด
  search <query>     - ค้นหาข้อมูล เช่น: search วัด
  list [limit]       - แสดงรายการข้อมูล (default limit: 10)
  get <id>           - ดึงข้อมูลด้วย ID
  all [limit]        - แสดงข้อมูลทั้งหมด (ใช้ด้วยความระมัดระวัง)
"""

import chromadb
from chromadb.utils import embedding_functions
import os
import sys
from pathlib import Path

# 1. กำหนด Path
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_path = os.path.join(base_dir, 'chroma_db')

# Initialize Chroma
print("🔗 เชื่อมต่อ Vector Database...")
chroma_client = chromadb.PersistentClient(path=db_path)

try:
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="paraphrase-multilingual-MiniLM-L12-v2"
    )
    collection = chroma_client.get_collection(
        name="places_collection",
        embedding_function=sentence_transformer_ef
    )
    print("✅ เชื่อมต่อสำเร็จ\n")
except Exception as e:
    print(f"❌ ข้อผิดพลาด: {e}")
    print("💡 รันสคริปต์นี้ก่อน: python scripts/setup_vector_db.py")
    sys.exit(1)

# Default command
command = sys.argv[1] if len(sys.argv) > 1 else "count"

# ========================
# Count
# ========================
if command == "count":
    count = collection.count()
    print(f"📊 จำนวนข้อมูลทั้งหมดในวеktor DB: {count}")

# ========================
# Search
# ========================
elif command == "search":
    if len(sys.argv) < 3:
        print("❌ ใช้: python query_vector_db.py search <query>")
        print("   เช่น: python query_vector_db.py search วัด")
        sys.exit(1)
    
    query = " ".join(sys.argv[2:])
    limit = 5
    
    print(f"🔍 กำลังค้นหา: '{query}'...\n")
    results = collection.query(query_texts=[query], n_results=limit)
    
    if not results['documents'] or len(results['documents'][0]) == 0:
        print("❌ ไม่พบข้อมูล")
    else:
        for i, doc in enumerate(results['documents'][0], 1):
            metadata = results['metadatas'][0][i-1]
            distance = results['distances'][0][i-1]
            
            print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print(f"📍 {i}. {metadata.get('name', 'Unknown')}")
            print(f"   ID: {metadata.get('id', 'N/A')}")
            print(f"   ⭐ Rating: {metadata.get('rating', 0)}")
            print(f"   📍 ://{metadata.get('address', 'N/A')}")
            print(f"   🎯 ความเกี่ยวข้อง: {1 - distance:.2f} (0-1)")
            print(f"\n   📄 บรรยาย:")
            print(f"   {doc[:200]}...")
            print()

# ========================
# List (first N)
# ========================
elif command == "list":
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    
    print(f"📋 แสดงข้อมูล {limit} รายการแรก:\n")
    all_data = collection.get(limit=limit)
    
    if not all_data['documents'] or len(all_data['documents']) == 0:
        print("❌ ไม่มีข้อมูลในฐานข้อมูล")
    else:
        for i, doc in enumerate(all_data['documents'], 1):
            metadata = all_data['metadatas'][i-1]
            print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print(f"{i}. {metadata.get('name', 'Unknown')}")
            print(f"   ID: {all_data['ids'][i-1]}")
            print(f"   ⭐ Rating: {metadata.get('rating', 0)}")
            print(f"   Types: {metadata.get('types', 'N/A')}")
            print()
        print(f"\n📊 รวมทั้งหมด: {len(all_data['documents'])} รายการ")

# ========================
# Get by ID
# ========================
elif command == "get":
    if len(sys.argv) < 3:
        print("❌ ใช้: python query_vector_db.py get <place_id>")
        sys.exit(1)
    
    place_id = sys.argv[2]
    try:
        result = collection.get(ids=[place_id])
        
        if not result['documents'] or len(result['documents']) == 0:
            print(f"❌ ไม่พบ ID: {place_id}")
        else:
            doc = result['documents'][0]
            metadata = result['metadatas'][0]
            
            print(f"📍 {metadata.get('name', 'Unknown')}")
            print(f"─" * 40)
            print(f"ID: {place_id}")
            print(f"⭐ Rating: {metadata.get('rating', 0)}")
            print(f"📍 Address: {metadata.get('address', 'N/A')}")
            print(f"🏷️  Types: {metadata.get('types', 'N/A')}")
            print(f"\n📄 บรรยาย:")
            print(doc)
    except Exception as e:
        print(f"❌ ข้อผิดพลาด: {e}")

# ========================
# All (show all, use with caution)
# ========================
elif command == "all":
    limit_val = int(sys.argv[2]) if len(sys.argv) > 2 else None
    
    print(f"⚠️  แสดงข้อมูลทั้งหมด{'(จำกัด: ' + str(limit_val) + ')' if limit_val else ''}:\n")
    
    if limit_val:
        all_data = collection.get(limit=limit_val)
    else:
        all_data = collection.get()
    
    if not all_data['documents'] or len(all_data['documents']) == 0:
        print("❌ ไม่มีข้อมูลในฐานข้อมูล")
    else:
        total = len(all_data['documents'])
        for i, doc in enumerate(all_data['documents'], 1):
            metadata = all_data['metadatas'][i-1]
            print(f"[{i}/{total}] {metadata.get('name', 'Unknown')}")
            print(f"    ⭐ {metadata.get('rating', 0)} | {metadata.get('types', 'N/A')}")
            print()
        print(f"\n📊 รวมทั้งหมด: {total} รายการ")

# ========================
# Help
# ========================
elif command in ["help", "-h", "--help"]:
    print(__doc__)

else:
    print(f"❌ คำสั่งไม่รู้จัก: {command}")
    print("\nใช้: python query_vector_db.py [command]")
    print("    python query_vector_db.py help")
