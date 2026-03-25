const API_BASE_URL = 'http://localhost:3000/api';

export const fetchAllEvents = async (filters = {}) => {
  try {
    const { status, category, limit = 50, page = 1 } = filters;
    let url = `${API_BASE_URL}/events?limit=${limit}&page=${page}`;
    
    if (status) url += `&status=${status}`;
    if (category) url += `&category=${category}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch events: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchEventById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch event: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const fetchEventsByStatus = async (status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/by-status/${status}`);
    if (!response.ok) throw new Error(`Failed to fetch events by status: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events by status:', error);
    throw error;
  }
};

export const fetchEventsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/by-category/${category}`);
    if (!response.ok) throw new Error(`Failed to fetch events by category: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events by category:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error(`Failed to create event: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error(`Failed to update event: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Failed to delete event: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
