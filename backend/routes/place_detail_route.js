// routes/place.route.js
const express = require("express");
const router = express.Router();

const Place = require("../models/Place");
const { getPlaceDetail } = require("../services/google-place-details-service");
const { mapGooglePlaceToDB } = require("../utils/place-mapper");

router.get("/:placeId", async (req, res) => {
  const { placeId } = req.params;

  // 1. เช็ค cache
  const cached = await Place.findOne({ google_place_id: placeId });

  if (cached && cached.metadata.expiresAt > new Date()) {
    return res.json({ source: "cache", data: cached });
  }

  // 2. fields ที่ต้องการ
  const fields = [
    "id",
    "displayName",
    "primaryType",
    "rating",
    "userRatingCount",
    "location",
    "internationalPhoneNumber",
    "websiteUri",
    "formattedAddress",
    "regularOpeningHours"
  ];

  // 3. เรียก Google
  const googleData = await getPlaceDetail(placeId, fields);

  // 4. map + upsert
const mapped = mapGooglePlaceToDB(googleData);

const place = await Place.findOneAndUpdate(
  { google_place_id: placeId },
  {
    $set: {
      google_place_id: mapped.google_place_id,
      core: mapped.core,
      contact: mapped.contact,
      address: mapped.address,
      openingHours: mapped.openingHours,

      // 👇 set metadata ทีละ field
      "metadata.lastFetchedAt": mapped.metadata.lastFetchedAt,
      "metadata.expiresAt": mapped.metadata.expiresAt,
      "metadata.source": mapped.metadata.source
    },
    $inc: { "metadata.fetchVersion": 1 }
  },
  { upsert: true, new: true }
);


  res.json({ source: "google_api", data: place });
});

module.exports = router;
