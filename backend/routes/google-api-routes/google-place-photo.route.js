const express = require("express");
const router = express.Router();

const { getPlacePhotoStream } = require("../../services/google/place-photo.service");

router.get("/photo", async (req, res) => {
  try {
    const { name, maxWidth } = req.query;

    if (!name) {
      return res.status(400).json({
        error: "photo name is required"
      });
    }

    const {
      stream,
      contentType,
      cacheControl
    } = await getPlacePhotoStream(name, maxWidth);

    // ส่ง header ให้ browser cache ได้
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    res.setHeader(
      "Cache-Control",
      cacheControl || "public, max-age=86400"
    );

    stream.pipe(res);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: "Failed to fetch place photo"
    });
  }
});

module.exports = router;
