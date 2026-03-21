/**
 * ReviewCard Component
 * Displays individual reviews with author, rating, text, and date
 */

import { formatDate, renderStars } from '../utils/placeUtils';

export default function ReviewCard({ review }) {
  if (!review) return null;

  const { authorName, rating, text, publishTime } = review;

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      {/* Author and Rating */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-800">{authorName}</h4>
          <p className="text-xs text-gray-500">{formatDate(publishTime)}</p>
        </div>
        <div className="text-yellow-500 text-sm">{renderStars(rating)}</div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
