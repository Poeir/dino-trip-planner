import { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Card from '../components/Card';
import Badge from '../components/Badge';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';
import { LoadingSpinner } from '../components/Skeleton';
import {
  fetchAllEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../api/eventsAPI';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('startDate');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Status and Category enums
  const statuses = [
    { value: 'upcoming', label: 'กำลังจะมาถึง' },
    { value: 'ongoing', label: 'กำลังเกิดขึ้น' },
    { value: 'completed', label: 'เสร็จสิ้น' },
    { value: 'cancelled', label: 'ยกเลิก' },
  ];

  const categories = [
    { value: 'concert', label: 'คอนเสิร์ต' },
    { value: 'festival', label: 'เทศกาล' },
    { value: 'exhibition', label: 'นิทรรศการ' },
    { value: 'sport', label: 'กีฬา' },
    { value: 'market', label: 'ตลาด' },
    { value: 'workshop', label: 'การอบรม' },
    { value: 'religious', label: 'ศาสนา' },
    { value: 'food', label: 'อาหาร' },
    { value: 'other', label: 'อื่นๆ' },
  ];

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

  // Load events
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAllEvents({ limit: 100 });
      setEvents(response.data || []);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  const applyFiltersAndSort = useCallback(() => {
    let filtered = events.filter(event => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.slug?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !statusFilter || event.status === statusFilter;
      const matchesCategory = !categoryFilter || event.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'startDate':
          return new Date(b.schedule?.startDate) - new Date(a.schedule?.startDate);
        case 'name':
          return a.name.localeCompare(b.name, 'th');
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [events, searchQuery, statusFilter, categoryFilter, sortBy]);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  // Handle edit click - fetch full event data
  const handleEditClick = async (eventRow) => {
    try {
      setIsSaving(true);
      const response = await fetchEventById(eventRow._id);
      if (response.success) {
        setSelectedEvent(response.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle save (create or update)
  const handleSave = async (eventData) => {
    try {
      setIsSaving(true);
      if (selectedEvent?._id) {
        // Update
        const response = await updateEvent(selectedEvent._id, eventData);
        if (response.success) {
          setEvents(prev =>
            prev.map(e => (e._id === selectedEvent._id ? response.data : e))
          );
        }
      } else {
        // Create
        const response = await createEvent(eventData);
        if (response.success) {
          setEvents(prev => [response.data, ...prev]);
        }
      }
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (eventId) => {
    try {
      const response = await deleteEvent(eventId);
      if (response.success) {
        setEvents(prev => prev.filter(e => e._id !== eventId));
        setDeleteConfirm(null);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + err.message);
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">งาน & เทศกาล</h1>
          <p className="text-gray-600 mt-1">จัดการข้อมูลงาน เทศกาล และกิจกรรมต่างๆ</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedEvent(null);
            setIsModalOpen(true);
          }}
        >
          + สร้างงานใหม่
        </Button>
      </div>

      {/* Filters Card */}
      <Card title="ค้นหาและกรอง">
        <div className="space-y-4">
          <Input
            placeholder="ค้นหาตามชื่อ slug หรืออธิบาย..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon="🔍"
          />
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="สถานะ"
              options={[{ value: '', label: 'ทั้งหมด' }, ...statuses]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Select
              label="หมวดหมู่"
              options={[{ value: '', label: 'ทั้งหมด' }, ...categories]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <Select
              label="เรียงลำดับ"
              options={[
                { value: 'startDate', label: 'วันเริ่มต้น (ใหม่)' },
                { value: 'name', label: 'ชื่องาน (ก-ฮ)' },
                { value: 'status', label: 'สถานะ' },
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Results Info */}
      <div className="text-sm text-gray-600">
        แสดง <strong>{filteredEvents.length}</strong> จาก <strong>{events.length}</strong> งาน
      </div>

      {/* Error State */}
      {error && (
        <Card className="bg-red-50 border border-red-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-red-800">❌ เกิดข้อผิดพลาด</p>
              <p className="text-red-700">{error}</p>
            </div>
            <Button variant="danger" size="sm" onClick={loadEvents}>
              ลองอีกครั้ง
            </Button>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      ) : filteredEvents.length === 0 ? (
        /* Empty State */
        <Card className="bg-gray-50 text-center py-12">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-xl font-medium text-gray-700">ไม่พบข้อมูล</p>
          <p className="text-gray-600 mt-2">
            {searchQuery || statusFilter || categoryFilter
              ? 'ไม่มีงานที่ตรงกับเงื่อนไขการค้นหา'
              : 'ยังไม่มีข้อมูลงาน'}
          </p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('');
              setCategoryFilter('');
            }}
          >
            ล้างตัวกรอง
          </Button>
        </Card>
      ) : (
        /* Events Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onEdit={handleEditClick}
              onDelete={setDeleteConfirm}
            />
          ))}
        </div>
      )}

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-sm">
            <div className="space-y-4">
              <p className="text-lg font-medium">⚠️ ยืนยันการลบ</p>
              <p className="text-gray-600">
                คุณแน่ใจว่าต้องการลบงาน "{events.find(e => e._id === deleteConfirm)?.name}" หรือไม่?
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                  ยกเลิก
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  ยืนยันลบ
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default EventsPage;
