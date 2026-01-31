const express = require("express");
const router = express.Router();
const Place = require("../../models/Place");
router.get("/",async (req, res) => {
    try{
        const places = await Place.find();
        res.json(places);
    }
    catch(err){
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router;