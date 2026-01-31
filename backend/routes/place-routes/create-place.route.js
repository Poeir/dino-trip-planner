// routes/place.route.js
const express = require("express");
const router = express.Router();

const Place = require("../../models/Place");
const { getPlaceDetail } = require("../../services/google/place-detail.service");
const { mapGooglePlaceToDB } = require("../../utils/mapper/google-place.mapper");

router.post("/:placeId", async (req, res) => {
  const { placeId } = req.params;

  const cached = await Place.findOne({ google_place_id: placeId });

  if (cached && cached.metadata.expiresAt > new Date()) {
    return res.json({ source: "cache", data: cached });
  }

  const fields = [
    "id",
    "displayName",
    "primaryType",
    "types",
    "rating",
    "userRatingCount",
    "priceLevel",
    "businessStatus",
    "location",
    "internationalPhoneNumber",
    "websiteUri",
    "formattedAddress",
    "regularOpeningHours",
    "utcOffsetMinutes",
    "reviews",
    "photos"
  ];

  const googleData = await getPlaceDetail(placeId, fields);

  const oldFetchVersion = cached?.metadata?.fetchVersion || 0;
  const mapped = mapGooglePlaceToDB(googleData, oldFetchVersion);

  const place = await Place.findOneAndUpdate(
    { google_place_id: placeId },
    { $set: mapped },
    { upsert: true, new: true }
  );

  res.json({ source: "google_api", data: place });
});


module.exports = router;
