const axios = require('axios');
const GOOGLE_ENDPOINT = "https://places.googleapis.com/v1/places/";

const getPlaceDetails = async (placeId) => {
  console.log("API KEY =", process.env.GOOGLE_API_KEY);

  const res = await axios.get(`${GOOGLE_ENDPOINT}${placeId}`, {
    headers: {
      "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
      "X-Goog-FieldMask": "*"
    }
  });

  return res.data;
};

module.exports = { getPlaceDetail: getPlaceDetails };
