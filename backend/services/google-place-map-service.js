const axios = require('axios');
const GOOGLE_ENDPOINT = "https://www.google.com/maps/embed/v1/place";
// https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${core.location.lat},${core.location.lng}

const getMapUrl = async (lat,long) => {
  console.log("API KEY =", process.env.GOOGLE_API_KEY);
  const res =`${GOOGLE_ENDPOINT}?key=${process.env.GOOGLE_API_KEY}&q=${lat},${long}`;
  return res;
};

module.exports = { getMapUrl: getMapUrl };
