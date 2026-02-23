const EmbeddingDocumentSchema = new mongoose.Schema({
  sourceType: { 
    type: String, 
    enum: ['place', 'activity', 'event'] },
  sourceId: { 
    type: mongoose.Schema.Types.ObjectId },
  google_place_id: String,
  chunkText: String,     // contextualDescription หรือ review summary
  embedding: [Number],
}, { timestamps: true });