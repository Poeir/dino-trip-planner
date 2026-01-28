require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db'); // Import เข้ามา
const cors = require('cors');

// Route Imports
const searchPlaceRoutes = require("./routes/google-api-routes/google_search_route");
const databaseTestRoutes = require("./routes/health/test_database_connection");
const placeRoute = require("./routes/place-routes/add-place-by-id");
const getAllPlacesRoute = require("./routes/place-routes/get-all-places");
const googleDetailRoute = require("./routes/google-api-routes/google_detail_route");
const getPhotoRoute = require("./routes/utils/photo-path-route");
const getOnePlaceRoute = require("./routes/place-routes/get-one-place");
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));
// Middleware
app.use(morgan('dev'));
app.use(express.json()); 

// Routes
app.use("/api/google", searchPlaceRoutes);
app.use("/api/google", googleDetailRoute);
app.use("/api/google", getPhotoRoute);

app.use("/api/places", placeRoute);
app.use("/api/places", getAllPlacesRoute);
app.use("/api/places", getOnePlaceRoute);

// Start Server
const PORT = process.env.PORT || 3000;
const start = async () => {
    await connectDB(); // เรียกใช้ฟังก์ชันต่อ DB
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

start();