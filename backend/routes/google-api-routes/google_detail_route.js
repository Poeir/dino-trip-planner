const express = require('express');
const router = express.Router();
const { getPlaceDetail } = require('../../services/google-place-details-service');

// Route to handle Google Place Search
router.get('/search/:placeId', async (req, res) => {
    if (!req.params.placeId) {
        return res.status(400).json({ error: "placeId is required" });
    }
    const {placeId} = req.params;
    const result = await getPlaceDetail(placeId);
    res.json(result);
});

module.exports = router;