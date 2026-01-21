const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Database Health Check Route
router.get('/health', async (req, res) => {
  try {
    // 1. เช็คสถานะ Connection (1 = Connected)
    const state = mongoose.connection.readyState;
    
    if (state !== 1) {
       // ถ้าไม่ได้เชื่อมต่อ ให้ดีด Error ออกไป catch เลย
       throw new Error(`Database is not connected (State: ${state})`);
    }

    // 2. (Optional แต่นิยมทำ) สั่ง Ping จริงๆ เพื่อดูว่า DB ตอบสนองไหม
    // ต้องรอให้ connect เสร็จก่อนถึงจะใช้คำสั่งนี้ได้
    await mongoose.connection.db.admin().ping();

    // ถ้าผ่านหมด ส่ง 200 OK
    res.status(200).json({ 
      status: 'OK', 
      message: 'Database is healthy and responsive',
      timestamp: new Date()
    });

  } catch (error) {
    // ถ้าพัง ส่ง 500 Internal Server Error
    console.error("Health Check Failed:", error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

module.exports = router;