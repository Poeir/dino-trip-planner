/**
 * Places API Client
 * Handles all API calls related to places
 */

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Fetch all places
 * @returns {Promise<Array>} - Array of place objects
 */
export const fetchPlaces = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/places`);
    if (!response.ok) {
      throw new Error(`Failed to fetch places: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};

/**
 * Fetch a single place by ID
 * @param {string} id - Place ID
 * @returns {Promise<Object>} - Place object
 */
export const fetchPlaceById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/places/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch place: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching place:', error);
    throw error;
  }
};

/**
 * Search places by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of place objects
 */
export const searchPlaces = async (query) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/places?search=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`Failed to search places: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching places:', error);
    throw error;
  }
};
