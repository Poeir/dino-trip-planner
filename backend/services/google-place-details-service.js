// services/google-place-details-service.js
const axios = require("axios");

const GOOGLE_ENDPOINT = "https://places.googleapis.com/v1/places/";

const GOOGLE_FIELDS = [
  "id",
  "displayName",
  "primaryType",
  "types",
  "location",
  "rating",
  "userRatingCount",
  "priceLevel",
  "businessStatus",

  "internationalPhoneNumber",
  "websiteUri",
  "formattedAddress",

  "regularOpeningHours",
  "photos",
  "reviews",

  /* features */
  "takeout","delivery","dineIn","curbsidePickup","reservable",
  "servesBreakfast","servesLunch","servesDinner","servesBrunch",
  "servesBeer","servesWine","servesCocktails","servesDessert",
  "servesCoffee","servesVegetarianFood",
  "outdoorSeating","liveMusic","menuForChildren",
  "goodForChildren","goodForGroups","goodForWatchingSports",
  "allowsDogs","restroom",

  /* extras */
  "editorialSummary",
  "generativeSummary",
  "neighborhoodSummary",
  "reviewSummary",
  "paymentOptions",
  "parkingOptions",
  "accessibilityOptions",
  "priceRange",
  "pureServiceAreaBusiness",

  /* maps / relations */
  "googleMapsUri",
  "googleMapsLinks",
  "subDestinations",
  "containingPlaces",

  /* EV */
  "evChargeOptions",
  "evChargeAmenitySummary",
  "fuelOptions"
];



const getPlaceDetail = async (placeId) => {
  const res = await axios.get(
    `${GOOGLE_ENDPOINT}${placeId}?languageCode=th`,
    {
      headers: {
        "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
        "X-Goog-FieldMask": GOOGLE_FIELDS.join(",")
      }
    }
  );

  return res.data;
};

module.exports = { getPlaceDetail };
