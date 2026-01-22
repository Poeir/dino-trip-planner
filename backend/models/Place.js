const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  google_place_id: {
    type: String,
    unique: true,
    index: true
  },

  /* ===== Core (ใช้โชว์ทันที) ===== */
  core: {
    name: { type: String, index: true },
    primaryType: String,
    types: [String],

    location: {
      lat: Number,
      lng: Number
    },

    rating: Number,
    userRatingCount: Number,
    priceLevel: Number, // 0–4
    businessStatus: String // OPERATIONAL, CLOSED_TEMPORARILY
  },

  /* ===== Contact & Address ===== */
  contact: {
    phone: String,
    website: String
  },

  address: {
    formatted: String
  },

  /* ===== Opening Hours (structured) ===== */
  openingHours: {
    openNow: Boolean,
    weekdayDescriptions: [String],
    periods: [
      {
        open: {
          day: Number,
          hour: Number,
          minute: Number
        },
        close: {
          day: Number,
          hour: Number,
          minute: Number
        }
      }
    ],
    nextOpenTime: Date
  },

  /* ===== Media ===== */
  media: {
    photos: [
      {
        name: String,       // Google photo name
        width: Number,
        height: Number
      }
    ]
  },

  /* ===== Reviews (optional: เก็บเฉพาะบางอัน) ===== */
  reviews: [
    {
      authorName: String,
      rating: Number,
      text: String,
      publishTime: Date
    }
  ],

  /* ===== Metadata ===== */
  metadata: {
    lastFetchedAt: Date,
    expiresAt: Date,
    fetchVersion: { type: Number, default: 1 },
    source: { type: String, default: 'google_places' }
  }

}, { timestamps: true });

module.exports = mongoose.model('Place', PlaceSchema);
