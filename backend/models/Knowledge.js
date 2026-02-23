const KnowledgeBaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },  // เนื้อหาที่จะ embed

  category: {
    type: String,
    enum: [
      'transport',      // การเดินทางในขอนแก่น
      'weather',        // สภาพอากาศ ช่วงเวลาที่ดี
      'local-customs',  // วัฒนธรรม ประเพณี
      'food-culture',   // อาหารพื้นเมือง ของฝาก
      'emergency',      // โรงพยาบาล ตำรวจ
      'faq',            // คำถามที่พบบ่อย
      'general'
    ],
    index: true
  },

  // สำหรับ admin จัดการ
  isActive: { type: Boolean, default: true },
  isPinned: { type: Boolean, default: false },  // ถ้า true จะถูกใส่ใน system prompt เสมอ
  tags: [String],

  metadata: {
    createdBy: String,
    lastUpdatedAt: Date,
    sourceUrl: String   // อ้างอิงแหล่งที่มา เช่น เว็บเทศบาลขอนแก่น
  }
}, { timestamps: true });