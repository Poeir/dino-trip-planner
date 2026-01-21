// Model Place for MongoDB using Mongoose
const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({google_place_id: { type: String, unique: true },

  core: {
    name: String,
    primaryType: String,
    rating: Number,
    userRatingCount: Number,
    location: {
      lat: Number,
      lng: Number
    }
  },

  contact: {
    phone: String,
    website: String
  },

  address: {
    formatted: String
  },

  openingHours: Object,

  metadata: {
    lastFetchedAt: Date,
    expiresAt: Date,
    fetchVersion: { type: Number, default: 1 },
    source: String
  }
});

module.exports = mongoose.model('Place', PlaceSchema);