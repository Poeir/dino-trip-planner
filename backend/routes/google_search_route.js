const express = require('express');
const router = express.Router();
const { searchNearbyPlaces } = require('../services/google-search-service');

// Route to handle Google Place Search
router.get('/search', async (req, res) => {
    const {query} = req.query;
    const result = await searchNearbyPlaces();
    res.json(result);
});

module.exports = router;