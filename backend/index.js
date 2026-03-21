require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db'); // Import เข้ามา
const cors = require('cors');
const axios = require('axios');

// Google API routes
const googleSearchRoutes = require("./routes/google-api-routes/google-place-search.route");
const googleDetailRoutes = require("./routes/google-api-routes/google-place-detail.route");
const googleMapRoutes = require("./routes/google-api-routes/google-place-map.route");
const googlePhotoRoutes = require("./routes/google-api-routes/google-place-photo.route");

// Health check
const databaseTestRoutes = require("./routes/health/health-database.route");

// Place routes
const createPlaceRoute = require("./routes/place-routes/create-place.route");
const getPlacesRoute = require("./routes/place-routes/get-places.route");
const getPlaceByIdRoute = require("./routes/place-routes/get-place-by-id.route");

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port during development
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // Check for production origins in env if needed
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (allowedOrigins.some(ao => origin === ao.trim())) {
      return callback(null, true);
    }
    
    callback(new Error('CORS not allowed'));
  },
  credentials: true,
}));
// Middleware
app.use(morgan('dev'));
app.use(express.json()); 

// Routes

app.use("/api/health", databaseTestRoutes);

app.use("/api/google", googleSearchRoutes);
app.use("/api/google", googleDetailRoutes);
app.use("/api/google", googlePhotoRoutes);
app.use("/api/google", googleMapRoutes);

app.use("/api/places", createPlaceRoute);
app.use("/api/places", getPlacesRoute);
app.use("/api/places", getPlaceByIdRoute);
app.use("/", (req, res) => {
    res.send("Welcome to the Places API Server");
});
// Start Server

const checkEndpoints = async () => {
  try {
    const res = await axios.get(`http://localhost:${PORT}/api/health`);
    console.log("✅ Health check passed:", res.data);
  } catch (err) {
    console.error("❌ Health check failed:", err.message);
  }
};
    
const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, async () => {
      console.log(`🚀 Server running on port ${PORT}`);
      await checkEndpoints();
    });

  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
};

start();