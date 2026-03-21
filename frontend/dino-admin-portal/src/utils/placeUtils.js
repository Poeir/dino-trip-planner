/**
 * Utility functions for Places
 */

/**
 * Format a place type string to a readable badge text
 * e.g., 'buddhist_temple' -> 'Buddhist Temple'
 * @param {string} type
 * @returns {string}
 */
export const formatPlaceType = (type) => {
  if (!type) return 'Unknown';
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generate a backend proxy photo URL
 * Uses the backend endpoint to fetch photos from Google Places API
 * @param {string} photoName - Photo name from Google Places API
 * @param {number} maxWidth - Max width in pixels (default 400)
 * @returns {string | null}
 */
export const getPhotoUrl = (photoName, maxWidth = 400) => {
  if (!photoName) return null;
  return `http://localhost:3000/api/google/photo?name=${encodeURIComponent(photoName)}&maxWidth=${maxWidth}`;
};

/**
 * Get the first photo URL from a place
 * @param {Object} place
 * @param {number} maxWidth
 * @returns {string | null}
 */
export const getPlacePhotoUrl = (place, maxWidth = 400) => {
  if (!place?.media?.photos?.[0]?.name) return null;
  return getPhotoUrl(place.media.photos[0].name, maxWidth);
};

/**
 * Truncate text to a maximum length
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Render star rating as HTML entities
 * @param {number} rating - Rating from 1-5
 * @param {number} maxRating - Max rating (default 5)
 * @returns {string} - Star emojis
 */
export const renderStars = (rating, maxRating = 5) => {
  if (!rating || rating < 0) return '☆☆☆☆☆';
  const filledStars = Math.round(rating);
  const emptyStars = maxRating - filledStars;
  return '★'.repeat(filledStars) + '☆'.repeat(emptyStars);
};

/**
 * Get open/closed status with appropriate styling info
 * @param {boolean} openNow
 * @returns {Object} - { text, variant, icon }
 */
export const getOpenStatus = (openNow) => {
  return {
    text: openNow ? 'Open' : 'Closed',
    variant: openNow ? 'success' : 'danger',
    icon: openNow ? '🟢' : '🔴',
  };
};

/**
 * Format price level to a readable string
 * @param {string} priceLevel - e.g., 'PRICE_LEVEL_MODERATE'
 * @returns {string}
 */
export const formatPriceLevel = (priceLevel) => {
  if (!priceLevel) return 'N/A';
  const levels = {
    PRICE_LEVEL_INEXPENSIVE: '💵',
    PRICE_LEVEL_MODERATE: '💵💵',
    PRICE_LEVEL_EXPENSIVE: '💵💵💵',
    PRICE_LEVEL_VERY_EXPENSIVE: '💵💵💵💵',
  };
  return levels[priceLevel] || priceLevel;
};

/**
 * Get accessibility features display
 * @param {Object} accessibilityOptions
 * @param {Object} features
 * @returns {Array} - Array of { label, icon, available }
 */
export const getAccessibilityFeatures = (accessibilityOptions = {}, features = {}) => {
  return [
    {
      label: 'Wheelchair Accessible',
      icon: '♿',
      available:
        accessibilityOptions.wheelchairAccessible !== undefined
          ? accessibilityOptions.wheelchairAccessible
          : false,
    },
    {
      label: 'Restroom',
      icon: '🚻',
      available: features.restroom !== undefined ? features.restroom : false,
    },
    {
      label: 'Good for Children',
      icon: '👶',
      available:
        features.goodForChildren !== undefined ? features.goodForChildren : false,
    },
  ];
};

/**
 * Get all accessibility and feature items that are available
 * @param {Object} place
 * @returns {Array}
 */
export const getPlaceFeatures = (place) => {
  const features = [];

  if (place?.extra?.accessibilityOptions?.wheelchairAccessible) {
    features.push({ label: 'Wheelchair Accessible', icon: '♿' });
  }

  if (place?.features?.restroom) {
    features.push({ label: 'Restroom', icon: '🚻' });
  }

  if (place?.features?.goodForChildren) {
    features.push({ label: 'Good for Children', icon: '👶' });
  }

  if (place?.features?.liveMusic) {
    features.push({ label: 'Live Music', icon: '🎵' });
  }

  if (place?.features?.dineIn) {
    features.push({ label: 'Dine In', icon: '🍽️' });
  }

  if (place?.features?.takeout) {
    features.push({ label: 'Takeout', icon: '📦' });
  }

  if (place?.features?.delivery) {
    features.push({ label: 'Delivery', icon: '🚚' });
  }

  return features;
};
