import Button from './Button';
import Badge from './Badge';

export default function EventCard({ event, onEdit, onDelete }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
      year: '2-digit',
      month: 'short',
      day: '2-digit',
    });
  };

  const statusMap = {
    upcoming: { label: 'กำลังจะมาถึง', variant: 'info' },
    ongoing: { label: 'กำลังเกิดขึ้น', variant: 'warning' },
    completed: { label: 'เสร็จสิ้น', variant: 'success' },
    cancelled: { label: 'ยกเลิก', variant: 'danger' },
  };

  const categoryMap = {
    concert: 'คอนเสิร์ต',
    festival: 'เทศกาล',
    exhibition: 'นิทรรศการ',
    sport: 'กีฬา',
    market: 'ตลาด',
    workshop: 'การอบรม',
    religious: 'ศาสนา',
    food: 'อาหาร',
    other: 'อื่นๆ',
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
      {/* Image */}
      <div className="relative bg-gray-200 h-48 overflow-hidden group">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50">
            <span className="text-4xl">🎉</span>
          </div>
        )}

        {/* Status Badge Overlay */}
        <div className="absolute top-2 right-2">
          <Badge variant={statusMap[event.status]?.variant || 'gray'} size="sm">
            {statusMap[event.status]?.label || event.status}
          </Badge>
        </div>

        {/* Featured Star */}
        {event.metadata?.isFeatured && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 hover:text-emerald-600">
            {event.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{event.slug}</p>
        </div>

        {/* Category and Published */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="info" size="sm">
            {categoryMap[event.category] || event.category}
          </Badge>
          {event.metadata?.isPublished && (
            <Badge variant="success" size="sm">
              ✓ เผยแพร่
            </Badge>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Dates */}
        <div className="bg-gray-50 p-3 rounded-lg space-y-1">
          <div className="text-xs text-gray-600">
            <span className="font-medium">📅 เริ่ม:</span> {formatDate(event.schedule?.startDate)}
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-medium">📅 สิ้นสุด:</span> {formatDate(event.schedule?.endDate)}
          </div>
        </div>

        {/* Admission Info */}
        {event.admission && (
          <div className="bg-blue-50 p-3 rounded-lg">
            {event.admission.isFree ? (
              <p className="text-sm font-medium text-blue-700">🎟️ ว่างเข้าฟรี</p>
            ) : (
              <p className="text-sm font-medium text-blue-700">
                💰 {event.admission.tickets?.[0]?.price || '-'} บาท
              </p>
            )}
          </div>
        )}

        {/* Location */}
        {event.venue && (
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">📍 {event.venue?.venueName}</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">{event.venue?.address}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(event)}
            className="flex-1"
          >
            แก้ไข
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(event._id)}
            className="flex-1"
          >
            ลบ
          </Button>
        </div>
      </div>
    </div>
  );
}
