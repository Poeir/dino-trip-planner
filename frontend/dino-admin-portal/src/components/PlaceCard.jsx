/**
 * PlaceCard Component
 * Card component for displaying a place in the grid
 */

import { useState } from 'react';
import { Badge, Button } from './index';
import PlaceDetailModal from './PlaceDetailModal';
import {
  formatPlaceType,
  getOpenStatus,
  truncateText,
  renderStars,
  getPhotoUrl,
} from '../utils/placeUtils';

export default function PlaceCard({ place }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  if (!place) return null;

  const { core, address, openingHours, media } = place;
  const photoUrl = media?.photos?.[0]?.name
    ? getPhotoUrl(media.photos[0].name, 400)
    : 'https://via.placeholder.com/400x300?text=No+Photo';

  const openStatus = getOpenStatus(openingHours?.openNow);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-200 h-48">
          <img
            src={photoUrl}
            alt={core.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Photo';
            }}
          />
          {/* Badge Overlay */}
          <div className="absolute top-2 left-2">
            <Badge variant="emerald" size="sm">
              {formatPlaceType(core.primaryType)}
            </Badge>
          </div>

          {/* Open/Closed Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant={openStatus.variant} size="sm">
              {openStatus.icon} {openStatus.text}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
            {core.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-yellow-500">{renderStars(Math.round(core.rating))}</span>
            <span className="text-sm text-gray-600">
              {core.rating.toFixed(1)} ({core.userRatingCount} reviews)
            </span>
          </div>

          {/* Address */}
          <p className="text-sm text-gray-600 mb-4">
            📍 {truncateText(address.formatted, 60)}
          </p>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => setIsDetailOpen(true)}
            >
              View Details
            </Button>
            {place.maps?.googleMapsLinks?.directionsUri && (
              <Button
                variant="outline"
                size="sm"
                as="a"
                href={place.maps.googleMapsLinks.directionsUri}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                🗺️
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <PlaceDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        place={place}
      />
    </>
  );
}
