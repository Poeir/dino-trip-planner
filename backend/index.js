require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db'); // Import เข้ามา

// Route Imports
const searchPlaceRoutes = require("./routes/google_search_route");
const databaseTestRoutes = require("./routes/test_database_connection");
const placeRoute = require("./routes/place_detail_route");
const getAllPlacesRoute = require("./routes/place-routes/get-all-places");

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json()); 

// Routes
app.get('/', (req, res) => res.send("Dino Trip Planner API"));
app.use("/api/google", searchPlaceRoutes);
app.use("/api/places", placeRoute);
app.use("/api/places", getAllPlacesRoute);
app.use("/api/database", databaseTestRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
const start = async () => {
    await connectDB(); // เรียกใช้ฟังก์ชันต่อ DB
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

start();