import { useNavigate } from "react-router-dom";

function EventCard({ event }) {
  const navigate = useNavigate();
  const { name, coverImage, schedule, category, description, metadata } = event;

  const startDate = new Date(schedule.startDate);
  const formattedDate = startDate.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const imageUrl = coverImage || "/placeholder.jpg";

  return (
    <div
      onClick={() => navigate(`/event/${event._id}`)}
      style={{ cursor: "pointer", minWidth: "100%" }}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
    >
      <div className="flex gap-4 p-4 h-32">
        {/* Image */}
        <div className="flex-shrink-0 w-40 h-full rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-gray-800 truncate text-sm">
                {name}
              </h3>
              {metadata?.isFeatured && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
                  ⭐ Featured
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {description || "ไม่มีรายละเอียด"}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {category}
              </span>
              <span className="text-xs text-gray-600">📅 {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
