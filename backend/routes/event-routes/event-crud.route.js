const express = require("express");
const router = express.Router();
const Event = require("../../models/Event");
const mongoose = require("mongoose");

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: ดึงรายการงานทั้งหมด (Get all events)
 *     description: ดึงข้อมูลงานทั้งหมด พร้อมตัวเลือกการกรอง
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, ongoing, completed, cancelled]
 *         description: กรองตามสถานะงาน
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [concert, festival, exhibition, sport, market, workshop, religious, food, other]
 *         description: กรองตามหมวดหมู่งาน
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: จำนวนผลลัพธ์สูงสุด
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: หน้าที่ต้องการ
 *     responses:
 *       200:
 *         description: สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 total:
 *                   type: integer
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.get("/", async (req, res) => {
  try {
    const { status, category, limit = 10, page = 1 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    const events = await Event.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ "schedule.startDate": -1 });

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: events,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: ดึงรายละเอียดงาน (Get event by ID)
 *     description: ดึงข้อมูลงานหนึ่งตามรหัส
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสของงาน (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: ไม่พบงาน
 *       400:
 *         description: รหัสไม่ถูกต้อง
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid event ID" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    res.json({ success: true, data: event });
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: สร้างงานใหม่ (Create new event)
 *     description: สร้างงานใหม่พร้อมข้อมูลทั้งหมด
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       201:
 *         description: สร้างสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: ข้อมูลไม่ครบหรือไม่ถูกต้อง
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.post("/", async (req, res) => {
  try {
    const { name, category, schedule, venues } = req.body;

    // Validation
    if (!name || !schedule || !schedule.startDate || !schedule.endDate) {
      return res.status(400).json({
        success: false,
        error: "Required fields: name, schedule.startDate, schedule.endDate",
      });
    }

    // Generate slug from name if not provided
    const data = req.body;
    if (!data.slug) {
      data.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const event = new Event(data);
    const savedEvent = await event.save();

    res.status(201).json({ success: true, data: savedEvent });
  } catch (err) {
    console.error("Error creating event:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Event with this slug already exists",
      });
    }

    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: อัปเดตข้อมูลงาน (Update event)
 *     description: อัปเดตข้อมูลงาน (สามารถอัปเดตบางฟิลด์ด้วย)
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสของงาน
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       200:
 *         description: อัปเดตสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: รหัสไม่ถูกต้อง
 *       404:
 *         description: ไม่พบงาน
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid event ID" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    res.json({ success: true, data: updatedEvent });
  } catch (err) {
    console.error("Error updating event:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Event with this slug already exists",
      });
    }

    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: ลบงาน (Delete event)
 *     description: ลบงานจากฐานข้อมูล
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสของงาน
 *     responses:
 *       200:
 *         description: ลบสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: รหัสไม่ถูกต้อง
 *       404:
 *         description: ไม่พบงาน
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid event ID" });
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/events/by-status/{status}:
 *   get:
 *     summary: ดึงงานตามสถานะ (Get events by status)
 *     description: ดึงรายการงานทั้งหมดตามสถานะหนึ่งๆ
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [upcoming, ongoing, completed, cancelled]
 *         description: สถานะงาน
 *     responses:
 *       200:
 *         description: สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       400:
 *         description: สถานะไม่ถูกต้อง
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.get("/by-status/:status", async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ["upcoming", "ongoing", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const events = await Event.find({ status }).sort({
      "schedule.startDate": 1,
    });

    res.json({ success: true, data: events });
  } catch (err) {
    console.error("Error fetching events by status:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/events/by-category/{category}:
 *   get:
 *     summary: ดึงงานตามหมวดหมู่ (Get events by category)
 *     description: ดึงรายการงานตามหมวดหมู่หนึ่งๆ
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [concert, festival, exhibition, sport, market, workshop, religious, food, other]
 *         description: หมวดหมู่งาน
 *     responses:
 *       200:
 *         description: สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       400:
 *         description: หมวดหมู่ไม่ถูกต้อง
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.get("/by-category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = [
      "concert",
      "festival",
      "exhibition",
      "sport",
      "market",
      "workshop",
      "religious",
      "food",
      "other",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: `Category must be one of: ${validCategories.join(", ")}`,
      });
    }

    const events = await Event.find({ category }).sort({
      "schedule.startDate": 1,
    });

    res.json({ success: true, data: events });
  } catch (err) {
    console.error("Error fetching events by category:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
