const express = require('express');
const router = express.Router();
const Place = require('../../models/Place');

router.get('/:placeId', async (req, res) => {
    console.log("Get one place route accessed");
    const { placeId } = req.params;
    try{
        const place = await Place.findOne({google_place_id: placeId});
        if (!place) {
        return res.status(404).json({ error: 'Place not found' });
        }
        res.json({ data: place });
    }
    catch(error) {
        res.status(500).json({ error: 'Internal server error' });
    }
    });

module.exports = router;