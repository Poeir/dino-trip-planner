const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  // เช่น "ชิมอาหารริมทาง", "ปั่นจักรยาน", "ดูนก", "เล่นน้ำ"

  slug: { type: String, unique: true },
  // URL-friendly เช่น "cycling", "street-food"

  category: {
    type: String,
    enum: ['outdoor', 'food', 'culture', 'shopping', 'wellness', 'entertainment', 'sports', 'education'],
    index: true
  },

  description: String,
  coverImage: String,

  // สถานที่ที่ทำกิจกรรมนี้ได้
  places: [{
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    google_place_id: String,
    // ข้อมูลเพิ่มเติมเฉพาะสถานที่นี้
    note: String,
    // เช่น "จุดปล่อยเรือ", "ทางเข้าหลัก"
    priceInfo: {
      isFree: Boolean,
      minPrice: Number,
      maxPrice: Number,
      currency: { type: String, default: 'THB' },
      priceNote: String
    },
    durationMinutes: { type: Number }, // เวลาเฉลี่ยที่ใช้
    bestTimeToVisit: {
      seasons: [{ type: String, enum: ['hot', 'rain', 'cool'] }],
      timeOfDay: [{ type: String, enum: ['morning', 'afternoon', 'evening', 'night'] }],
      note: String
    }
  }],

  // Tag สำหรับ filter ใน Trip Planner
  tags: [String],
  // เช่น ["family-friendly", "budget", "instagram-worthy", "local-experience"]

  suitableFor: {
    solo: Boolean,
    couple: Boolean,
    family: Boolean,
    group: Boolean,
    elderly: Boolean
  },

  metadata: {
    isActive: { type: Boolean, default: true },
    createdBy: String, // 'admin' | 'user_id'
    lastUpdatedAt: Date
  }
}, { timestamps: true });