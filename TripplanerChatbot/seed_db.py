#!/usr/bin/env python3
"""
Seed script to insert places into MongoDB from JSON file
Usage: python seed_db.py [count]
  count: number of places to seed (default: 2)
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from src.core.database import seed_specific_places

async def main():
    # Get count from command line or default to 2
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 2
    
    # Path to JSON file
    json_path = Path(__file__).parent / "data" / "output_places_multi_cafe.json"
    
    if not json_path.exists():
        print(f"❌ Error: JSON file not found at {json_path}")
        sys.exit(1)
    
    print(f"🚀 Starting seed with {count} places...")
    print(f"📁 JSON file: {json_path}\n")
    
    # Run seed function
    result = await seed_specific_places(str(json_path), count=count)
    
    if result:
        print(f"\n✨ Seed completed successfully!")
    else:
        print(f"\n⚠️  Seed completed but no places were inserted")
    
    sys.exit(0)

if __name__ == "__main__":
    asyncio.run(main())
