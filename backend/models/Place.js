const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  google_place_id: {
    type: String,
    unique: true,
    index: true
  },

  /* ===== Core (เดิม) ===== */
  core: {
    name: { type: String, index: true },
    primaryType: String,
    types: [String],
    location: { lat: Number, lng: Number },
    rating: Number,
    userRatingCount: Number,
    priceLevel: Number,
    businessStatus: String
  },

  /* ===== Contact & Address (เดิม) ===== */
  contact: {
    phone: String,
    website: String
  },
  address: {
    formatted: String
  },

  /* ===== Opening Hours (เดิม) ===== */
  openingHours: {
    openNow: Boolean,
    weekdayDescriptions: [String],
    periods: [{ open: Object, close: Object }],
    nextOpenTime: Date
  },

  /* ===== Media (เดิม) ===== */
  media: {
    photos: [{ name: String, width: Number, height: Number }]
  },

  /* ===== Reviews (เดิม) ===== */
  reviews: [{
    authorName: String,
    rating: Number,
    text: String,
    publishTime: Date
  }],

  /* ===== 🔥 Features (ใหม่) ===== */
  features: {
    takeout: Boolean,
    delivery: Boolean,
    dineIn: Boolean,
    curbsidePickup: Boolean,
    reservable: Boolean,

    servesBreakfast: Boolean,
    servesLunch: Boolean,
    servesDinner: Boolean,
    servesBrunch: Boolean,
    servesBeer: Boolean,
    servesWine: Boolean,
    servesCocktails: Boolean,
    servesDessert: Boolean,
    servesCoffee: Boolean,
    servesVegetarianFood: Boolean,

    outdoorSeating: Boolean,
    liveMusic: Boolean,
    menuForChildren: Boolean,
    goodForChildren: Boolean,
    goodForGroups: Boolean,
    goodForWatchingSports: Boolean,

    allowsDogs: Boolean,
    restroom: Boolean
  },

  /* ===== 🔥 Extra Info (ใหม่) ===== */
  extra: {
    editorialSummary: String,
    generativeSummary: String,
    neighborhoodSummary: String,
    reviewSummary: String,

    paymentOptions: Object,
    parkingOptions: Object,
    accessibilityOptions: Object,

    extra: {
      priceRange: {
        start: {
          currencyCode: String,
          units: Number
        },
        end: {
          currencyCode: String,
          units: Number
        }
      },
      // field อื่นคงเดิม
    }
,
    pureServiceAreaBusiness: Boolean
  },

  /* ===== Maps / Relations (ใหม่) ===== */
  maps: {
    googleMapsUri: String,
    googleMapsLinks: Object
  },

  subDestinations: [String],
  containingPlaces: [String],

  ev: {
    evChargeOptions: Object,
    evChargeAmenitySummary: String,
    fuelOptions: Object
  },

  /* ===== Metadata (เดิม) ===== */
  metadata: {
    lastFetchedAt: Date,
    expiresAt: Date,
    fetchVersion: { type: Number, default: 1 },
    source: { type: String, default: 'google_places' }
  }

}, { timestamps: true });
module.exports = mongoose.model('Place', PlaceSchema);
