const express = require('express');
const router = express.Router();
const { getMapUrl } = require('../../services/google/place-map.service');

router.get('/map', async (req, res) => {
    const { lat, long } = req.query;
    if (!lat || !long) {
        return res.status(400).json({ error: "lat and long query parameters are required" });
    }
    const mapUrl = await getMapUrl(lat, long);
    res.json({ mapUrl });
});

module.exports = router;
