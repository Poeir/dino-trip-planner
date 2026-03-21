/**
 * PlaceDetailModal Component
 * Displays detailed information about a place in a modal
 */

import { useState } from 'react';
import { Modal, Badge, Button } from './index';
import ReviewCard from './ReviewCard';
import {
  formatPlaceType,
  formatPriceLevel,
  getOpenStatus,
  renderStars,
  getPlaceFeatures,
  getPhotoUrl,
} from '../utils/placeUtils';

export default function PlaceDetailModal({ isOpen, onClose, place }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!isOpen || !place) return null;

  const { core, address, contact, openingHours, media, reviews, maps } = place;
  const openStatus = getOpenStatus(openingHours?.openNow);
  const photos = media?.photos || [];
  const currentPhoto = photos[currentPhotoIndex];
  const features = getPlaceFeatures(place);

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={core.name} maxWidth="2xl">
      {/* Photo Gallery */}
      {photos.length > 0 && (
        <div className="mb-6">
          <div className="relative bg-gray-200 rounded-lg overflow-hidden h-96">
            <img
              src={getPhotoUrl(currentPhoto.name, 800)}
              alt={`${core.name} - Photo ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x300?text=Photo+Not+Available';
              }}
            />

            {/* Photo Counter */}
            {photos.length > 1 && (
              <>
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">
                  {currentPhotoIndex + 1} / {photos.length}
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                >
                  ←
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                >
                  →
                </button>
              </>
            )}
          </div>

          {/* Photo Thumbnails */}
          {photos.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentPhotoIndex
                      ? 'border-emerald-500'
                      : 'border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  <img
                    src={getPhotoUrl(photo.name, 200)}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Header Info */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="emerald" size="md">
                {formatPlaceType(core.primaryType)}
              </Badge>
              <Badge variant={openStatus.variant} size="md">
                {openStatus.icon} {openStatus.text}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{core.businessStatus}</p>
          </div>
          {core.priceLevel && (
            <div className="text-2xl">{formatPriceLevel(core.priceLevel)}</div>
          )}
        </div>
      </div>

      {/* Rating and Reviews Count */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl text-yellow-500">{renderStars(Math.round(core.rating))}</span>
          <span className="font-semibold text-lg">{core.rating.toFixed(1)}</span>
          <span className="text-gray-600">
            ({core.userRatingCount} {core.userRatingCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>

      {/* Address and Contact */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">Location & Contact</h4>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Address:</span> {address.formatted}
          </p>
          {contact?.website && (
            <p>
              <span className="font-medium">Website:</span>{' '}
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                {contact.website}
              </a>
            </p>
          )}
          {maps?.googleMapsLinks?.directionsUri && (
            <Button
              variant="outline"
              size="sm"
              as="a"
              href={maps.googleMapsLinks.directionsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full"
            >
              🗺️ Get Directions
            </Button>
          )}
        </div>
      </div>

      {/* Opening Hours */}
      {openingHours?.weekdayDescriptions?.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Hours</h4>
          <ul className="space-y-1 text-sm">
            {openingHours.weekdayDescriptions.map((desc, index) => (
              <li key={index} className="text-gray-700">
                {desc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Features & Amenities */}
      {features.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <Badge key={feature.label} variant="info" size="sm">
                {feature.icon} {feature.label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {reviews?.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-4">
            Recent Reviews ({reviews.length})
          </h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {reviews.slice(0, 10).map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
