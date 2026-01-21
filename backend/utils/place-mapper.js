// utils/placeMapper.js
const mapGooglePlaceToDB = (data) => ({
  google_place_id: data.id,

  core: {
    name: data.displayName?.text,
    primaryType: data.primaryType,
    rating: data.rating,
    userRatingCount: data.userRatingCount,
    location: {
      lat: data.location?.latitude,
      lng: data.location?.longitude
    }
  },

  contact: {
    phone: data.internationalPhoneNumber,
    website: data.websiteUri
  },

  address: {
    formatted: data.formattedAddress
  },

  openingHours: data.regularOpeningHours,

  metadata: {
    lastFetchedAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    source: "google_places"
  }
});

module.exports = { mapGooglePlaceToDB };
