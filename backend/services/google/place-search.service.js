const axios = require("axios");

const SEARCH_ENDPOINT = "https://places.googleapis.com/v1/places:searchNearby";

// พิกัดตัวเมืองขอนแก่น
const KHON_KAEN_LAT = 16.4322;
const KHON_KAEN_LNG = 102.8236;

const searchNearbyPlaces = async (
  lat = KHON_KAEN_LAT, 
  lng = KHON_KAEN_LNG, 
  radius = 15000
) => {
  console.log(`==== Searching Nearby Tourist Spots at [${lat}, ${lng}] within ${radius}m ====`);

  try {
    const res = await axios.post(
      SEARCH_ENDPOINT,
      {
        // แก้ไขรายชื่อ Type ให้ตรงกับ Places API V1 Table A/B
        includedTypes: [
          'restaurant',
          'tourist_attraction',
          'museum',
        ],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng,
            },
            radius: radius,
          },
        },
      },
      {
        headers: {
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.types,places.rating,places.userRatingCount,places.id"
        }
      }
    );

    return res.data.places || [];
  } catch (error) {
    // ปรับการแสดงผล Error ให้ดูง่ายขึ้นเวลา Debug
    console.error("Error Detail:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    return [];
  }
};

module.exports = { searchNearbyPlaces };