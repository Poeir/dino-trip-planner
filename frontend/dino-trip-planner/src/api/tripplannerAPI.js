import axios from "axios";

// API client for trip planner service (runs on port 8000)
const tripPlannerClient = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 60000, // 60 seconds timeout for AI processing
});

/**
 * Create a trip itinerary using AI
 * @param {Object} tripData - Trip data containing dates, preferences, must-go places, etc.
 * @returns {Promise<Object>} - Trip itinerary with schedule for each day
 */
export const createTripItinerary = async (tripData) => {
  try {
    const response = await tripPlannerClient.post("/trip/llm", tripData);
    return response.data;
  } catch (error) {
    console.error("Error creating trip itinerary:", error);
    throw error;
  }
};

export default tripPlannerClient;
