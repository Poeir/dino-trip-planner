const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  // เช่น "เทศกาลไหมและพาแลงขอนแก่น 2568"

  slug: { type: String, unique: true },

  category: {
    type: String,
    enum: ['concert', 'festival', 'exhibition', 'sport', 'market', 'workshop', 'religious', 'food', 'other'],
    index: true
  },

  description: String,
  coverImage: String,
  images: [String],

  // สถานที่จัดงาน (อาจมีหลายสถานที่ถ้างานใหญ่)
  venues: [{
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    google_place_id: String,
    venueName: String,   // ชื่อเรียกเฉพาะ เช่น "เวทีกลาง", "โซน A"
    address: String,     // fallback กรณีไม่มีใน Place
    location: { lat: Number, lng: Number }
  }],

  // ช่วงเวลาจัดงาน — รองรับทั้ง one-time และ recurring
  schedule: {
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    // กรณีงานหลายวันแต่ไม่ได้จัดทุกวัน
    sessions: [{
      date: Date,
      startTime: String,  // "18:00"
      endTime: String,    // "23:00"
      note: String        // เช่น "รอบเปิดตัว"
    }],
    timezone: { type: String, default: 'Asia/Bangkok' }
  },

  // ข้อมูลบัตร/ค่าเข้า
  admission: {
    isFree: { type: Boolean, default: false },
    tickets: [{
      type: String,         // "บัตรทั่วไป", "VIP", "เด็ก"
      price: Number,
      currency: { type: String, default: 'THB' },
      available: Boolean
    }],
    ticketUrl: String,
    note: String
  },

  organizer: {
    name: String,
    contactPhone: String,
    contactEmail: String,
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      line: String
    }
  },

  tags: [String],
  // เช่น ["annual", "family", "free-entry", "night-event"]

  suitableFor: {
    solo: Boolean,
    couple: Boolean,
    family: Boolean,
    group: Boolean
  },

  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
    index: true
  },

  metadata: {
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    source: String,   // 'admin', 'scraper', 'user_submit'
    sourceUrl: String
  }
}, { timestamps: true });

// Index สำหรับ query หา Event ในช่วงเวลา
EventSchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 });
EventSchema.index({ status: 1, 'schedule.startDate': 1 });

module.exports = mongoose.model('Event', EventSchema);