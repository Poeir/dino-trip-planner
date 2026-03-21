/**
 * Skeleton Loading Component
 * Used for placeholder while data is loading
 */

export function PlaceCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-300"></div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Badge */}
        <div className="h-6 w-20 bg-gray-300 rounded-full"></div>

        {/* Title */}
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>

        {/* Rating */}
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>

        {/* Address */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>

        {/* Action Button */}
        <div className="h-10 bg-gray-300 rounded w-full mt-4"></div>
      </div>
    </div>
  );
}

/**
 * Loading Grid - multiple skeletons
 */
export function PlaceCardSkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <PlaceCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Loading state component
 */
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin">
        <div className="h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full"></div>
      </div>
      <span className="ml-4 text-gray-600">Loading places...</span>
    </div>
  );
}
