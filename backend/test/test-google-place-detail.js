require("dotenv").config();

const {getPlaceDetail} = require("../services/google-place-details-service");

(async () => {
  try {
    const placeId = "ChIJNQQcU4eeGDERQELfyM9pBAQ"; // ตัวอย่าง placeId
    const fields = ["id", "displayName", "formattedAddress"];
    const data = await getPlaceDetail(placeId);
    console.log(data);
  } catch (err) {
    console.log("=====================================");
    console.log("!!!Error fetching place details:!!!");
    console.error(err.response?.data || err.message);
    console.log("=====================================");
  }
})();