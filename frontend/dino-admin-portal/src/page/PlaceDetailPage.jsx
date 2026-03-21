/**
 * PlaceDetailPage Component
 * Full page view for a single place (alternative to modal)
 * Can be used by adding a route like /places/:id
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Badge, Button } from '../components/index';
import ReviewCard from '../components/ReviewCard';
import { LoadingSpinner } from '../components/index';
import { fetchPlaceById } from '../api/placesAPI';
import {
  formatPlaceType,
  formatPriceLevel,
  getOpenStatus,
  renderStars,
  getPlaceFeatures,
  getPhotoUrl,
} from '../utils/placeUtils';

export default function PlaceDetailPage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetchPlaceData();
  }, [id]);

  const fetchPlaceData = async () => {
    try {
      setLoading(true);
      const data = await fetchPlaceById(id);
      setPlace(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch place:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
        <p className="text-red-700">{error}</p>
        <Link to="/places" className="text-emerald-600 hover:underline mt-4 inline-block">
          ← Back to Places
        </Link>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Place not found</p>
        <Link to="/places" className="text-emerald-600 hover:underline">
          ← Back to Places
        </Link>
      </div>
    );
  }

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
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/places"
        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
      >
        ← Back to Places
      </Link>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <Card>
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
        </Card>
      )}

      {/* Header Info */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold text-gray-800">{core.name}</h1>
        </div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant="emerald" size="md">
            {formatPlaceType(core.primaryType)}
          </Badge>
          <Badge variant={openStatus.variant} size="md">
            {openStatus.icon} {openStatus.text}
          </Badge>
          {core.priceLevel && (
            <span className="text-2xl">{formatPriceLevel(core.priceLevel)}</span>
          )}
        </div>
        <p className="text-sm text-gray-600">{core.businessStatus}</p>
      </div>

      {/* Rating and Reviews Count */}
      <Card>
        <div className="flex items-center gap-3">
          <span className="text-3xl text-yellow-500">{renderStars(Math.round(core.rating))}</span>
          <div>
            <div className="font-semibold text-lg">{core.rating.toFixed(1)}</div>
            <div className="text-gray-600">
              {core.userRatingCount} {core.userRatingCount === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        </div>
      </Card>

      {/* Address and Contact */}
      <Card title="Location & Contact">
        <div className="space-y-3">
          <div>
            <p className="font-medium text-gray-700">Address</p>
            <p className="text-gray-600">{address.formatted}</p>
          </div>

          {contact?.website && (
            <div>
              <p className="font-medium text-gray-700">Website</p>
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline break-all"
              >
                {contact.website}
              </a>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {maps?.googleMapsLinks?.directionsUri && (
              <Button
                variant="outline"
                as="a"
                href={maps.googleMapsLinks.directionsUri}
                target="_blank"
                rel="noopener noreferrer"
              >
                🗺️ Get Directions
              </Button>
            )}
            {maps?.googleMapsLinks?.placeUri && (
              <Button
                variant="outline"
                as="a"
                href={maps.googleMapsLinks.placeUri}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Maps
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Opening Hours */}
      {openingHours?.weekdayDescriptions?.length > 0 && (
        <Card title="Opening Hours">
          <ul className="space-y-2">
            {openingHours.weekdayDescriptions.map((desc, index) => (
              <li key={index} className="text-gray-700">
                {desc}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Features & Amenities */}
      {features.length > 0 && (
        <Card title="Amenities">
          <div className="flex flex-wrap gap-3">
            {features.map((feature) => (
              <Badge key={feature.label} variant="info" size="md">
                {feature.icon} {feature.label}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Reviews */}
      {reviews?.length > 0 && (
        <Card title={`Reviews (${reviews.length})`}>
          <div className="space-y-4">
            {reviews.slice(0, 20).map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
