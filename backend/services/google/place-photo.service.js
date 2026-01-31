const axios = require("axios");

const GOOGLE_PLACES_BASE =
  "https://places.googleapis.com/v1";

async function getPlacePhotoStream(photoName, maxWidth = 800) {
  if (!photoName) {
    throw new Error("photoName is required");
  }

  const safeWidth = Math.min(Number(maxWidth) || 800, 1600);

  const url =
    `${GOOGLE_PLACES_BASE}/${photoName}/media` +
    `?maxWidthPx=${safeWidth}` +
    `&key=${process.env.GOOGLE_API_KEY}`;

  const response = await axios.get(url, {
    responseType: "stream",   // ⭐ สำคัญที่สุด
    validateStatus: () => true
  });

  if (response.status !== 200) {
    let errorText = "";
    try {
      for await (const chunk of response.data) {
        errorText += chunk.toString();
      }
    } catch (_) {}

    throw new Error(`Google Photo API error: ${errorText}`);
  }

  return {
    stream: response.data,                 // ← stream อยู่ตรงนี้
    contentType: response.headers["content-type"],
    cacheControl: response.headers["cache-control"]
  };
}

module.exports = {  getPlacePhotoStream};
