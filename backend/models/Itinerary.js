const ItinerarySchema = new mongoose.Schema({
  title: String,
  theme: String,
  duration: { days: Number },
  stops: [{
    order: Number,
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    google_place_id: String,
    arrivalTime: String,
    durationMinutes: Number,
    activityIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    note: String,
    transportToNext: { mode: String, minutes: Number }
  }],
  generatedBy: { type: String, enum: ['llm', 'user'], default: 'llm' },
  isPublic: { type: Boolean, default: false },
  userId: ObjectId
}, { timestamps: true });