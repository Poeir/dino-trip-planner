/**
 * Type definitions and interfaces for Places
 * @typedef {Object} Photo
 * @property {string} name
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} Review
 * @property {string} authorName
 * @property {number} rating
 * @property {string} text
 * @property {string} publishTime
 */

/**
 * @typedef {Object} CorePlace
 * @property {string} name
 * @property {string} primaryType
 * @property {string[]} types
 * @property {number} rating
 * @property {number} userRatingCount
 * @property {string | null} priceLevel
 * @property {string} businessStatus
 * @property {Object} location
 * @property {number} location.lat
 * @property {number} location.lng
 */

/**
 * @typedef {Object} Place
 * @property {string} _id
 * @property {string} google_place_id
 * @property {CorePlace} core
 * @property {Object} address
 * @property {string} address.formatted
 * @property {Object} [contact]
 * @property {string} [contact.website]
 * @property {Object} openingHours
 * @property {boolean} [openingHours.openNow]
 * @property {string[]} openingHours.weekdayDescriptions
 * @property {string} [openingHours.nextOpenTime]
 * @property {Object} media
 * @property {Photo[]} media.photos
 * @property {Review[]} reviews
 * @property {Object} features
 * @property {Object} extra
 * @property {Object} [extra.accessibilityOptions]
 * @property {Object} maps
 * @property {Object} maps.googleMapsLinks
 * @property {string} maps.googleMapsLinks.directionsUri
 * @property {string} maps.googleMapsLinks.placeUri
 */

export {};
