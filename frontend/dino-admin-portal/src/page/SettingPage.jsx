import { useState } from 'react';
import { Button, Input, Select, Modal, Badge, Table, Checkbox } from '../components';

// Mock Data สำหรับ Place Types
const MOCK_PLACE_TYPES = [
  { id: 1, value: 'tourist_attraction', label: 'สถานที่ท่องเที่ยว', isActive: true },
  { id: 2, value: 'restaurant', label: 'ร้านอาหาร', isActive: true },
  { id: 3, value: 'shopping_mall', label: 'ห้างสรรพสินค้า', isActive: true },
  { id: 4, value: 'hotel', label: 'โรงแรม', isActive: true },
  { id: 5, value: 'museum', label: 'พิพิธภัณฑ์', isActive: true },
  { id: 6, value: 'park', label: 'สวนสาธารณะ', isActive: true },
  { id: 7, value: 'temple', label: 'วัด', isActive: true },
  { id: 8, value: 'market', label: 'ตลาด', isActive: true },
];

// Mock Data สำหรับ Activity Categories
const MOCK_ACTIVITY_CATEGORIES = [
  { id: 1, value: 'outdoor', label: 'กิจกรรมกลางแจ้ง', isActive: true },
  { id: 2, value: 'cultural', label: 'วัฒนธรรม', isActive: true },
  { id: 3, value: 'shopping', label: 'ช้อปปิ้ง', isActive: true },
  { id: 4, value: 'dining', label: 'รับประทานอาหาร', isActive: true },
  { id: 5, value: 'nightlife', label: 'ชีวิตยามค่ำคืน', isActive: true },
  { id: 6, value: 'sports', label: 'กีฬา', isActive: true },
  { id: 7, value: 'wellness', label: 'สุขภาพและความงาม', isActive: true },
  { id: 8, value: 'entertainment', label: 'ความบันเทิง', isActive: true },
];

// Mock Data สำหรับ Event Categories
const MOCK_EVENT_CATEGORIES = [
  { id: 1, value: 'concert', label: 'คอนเสิร์ต', isActive: true },
  { id: 2, value: 'festival', label: 'เทศกาล', isActive: true },
  { id: 3, value: 'exhibition', label: 'นิทรรศการ', isActive: true },
  { id: 4, value: 'sport', label: 'กีฬา', isActive: true },
  { id: 5, value: 'market', label: 'ตลาดนัด', isActive: true },
  { id: 6, value: 'workshop', label: 'เวิร์กช็อป', isActive: true },
  { id: 7, value: 'religious', label: 'งานศาสนา', isActive: true },
  { id: 8, value: 'food', label: 'งานอาหาร', isActive: true },
];

// Mock Global Settings
const MOCK_GLOBAL_SETTINGS = {
  systemName: 'Dino Trip Planner Admin',
  systemVersion: '1.0.0',
  defaultLanguage: 'th',
  maxItineraryDays: 14,
  minItineraryDays: 1,
  defaultBudgetLevel: 'medium',
  enableLLMSuggestions: true,
  enablePublicItineraries: true,
  mapApiKey: 'AIzaSy*********************',
  openAiApiKey: 'sk-*********************',
};

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState('placeTypes');
  
  // States สำหรับ Place Types
  const [placeTypes, setPlaceTypes] = useState(MOCK_PLACE_TYPES);
  const [showPlaceTypeModal, setShowPlaceTypeModal] = useState(false);
  const [editingPlaceType, setEditingPlaceType] = useState(null);
  const [placeTypeForm, setPlaceTypeForm] = useState({ value: '', label: '', isActive: true });

  // States สำหรับ Activity Categories
  const [activityCategories, setActivityCategories] = useState(MOCK_ACTIVITY_CATEGORIES);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityForm, setActivityForm] = useState({ value: '', label: '', isActive: true });

  // States สำหรับ Event Categories
  const [eventCategories, setEventCategories] = useState(MOCK_EVENT_CATEGORIES);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ value: '', label: '', isActive: true });

  // States สำหรับ Global Settings
  const [globalSettings, setGlobalSettings] = useState(MOCK_GLOBAL_SETTINGS);
  const [isEditingGlobal, setIsEditingGlobal] = useState(false);

  // ==================== Place Types Functions ====================
  const handleAddPlaceType = () => {
    setEditingPlaceType(null);
    setPlaceTypeForm({ value: '', label: '', isActive: true });
    setShowPlaceTypeModal(true);
  };

  const handleEditPlaceType = (type) => {
    setEditingPlaceType(type);
    setPlaceTypeForm({ value: type.value, label: type.label, isActive: type.isActive });
    setShowPlaceTypeModal(true);
  };

  const handleSavePlaceType = (e) => {
    e.preventDefault();
    if (editingPlaceType) {
      setPlaceTypes(placeTypes.map(t => t.id === editingPlaceType.id ? { ...t, ...placeTypeForm } : t));
    } else {
      setPlaceTypes([...placeTypes, { id: placeTypes.length + 1, ...placeTypeForm }]);
    }
    setShowPlaceTypeModal(false);
  };

  const handleDeletePlaceType = (id) => {
    if (confirm('คุณต้องการลบประเภทนี้หรือไม่?')) {
      setPlaceTypes(placeTypes.filter(t => t.id !== id));
    }
  };

  const handleTogglePlaceType = (id) => {
    setPlaceTypes(placeTypes.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  // ==================== Activity Categories Functions ====================
  const handleAddActivity = () => {
    setEditingActivity(null);
    setActivityForm({ value: '', label: '', isActive: true });
    setShowActivityModal(true);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setActivityForm({ value: activity.value, label: activity.label, isActive: activity.isActive });
    setShowActivityModal(true);
  };

  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (editingActivity) {
      setActivityCategories(activityCategories.map(a => a.id === editingActivity.id ? { ...a, ...activityForm } : a));
    } else {
      setActivityCategories([...activityCategories, { id: activityCategories.length + 1, ...activityForm }]);
    }
    setShowActivityModal(false);
  };

  const handleDeleteActivity = (id) => {
    if (confirm('คุณต้องการลบหมวดหมู่นี้หรือไม่?')) {
      setActivityCategories(activityCategories.filter(a => a.id !== id));
    }
  };

  const handleToggleActivity = (id) => {
    setActivityCategories(activityCategories.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  // ==================== Event Categories Functions ====================
  const handleAddEvent = () => {
    setEditingEvent(null);
    setEventForm({ value: '', label: '', isActive: true });
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({ value: event.value, label: event.label, isActive: event.isActive });
    setShowEventModal(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (editingEvent) {
      setEventCategories(eventCategories.map(ev => ev.id === editingEvent.id ? { ...ev, ...eventForm } : ev));
    } else {
      setEventCategories([...eventCategories, { id: eventCategories.length + 1, ...eventForm }]);
    }
    setShowEventModal(false);
  };

  const handleDeleteEvent = (id) => {
    if (confirm('คุณต้องการลบหมวดหมู่นี้หรือไม่?')) {
      setEventCategories(eventCategories.filter(e => e.id !== id));
    }
  };

  const handleToggleEvent = (id) => {
    setEventCategories(eventCategories.map(e => e.id === id ? { ...e, isActive: !e.isActive } : e));
  };

  // ==================== Global Settings Functions ====================
  const handleSaveGlobalSettings = (e) => {
    e.preventDefault();
    setIsEditingGlobal(false);
    alert('บันทึกการตั้งค่าสำเร็จ!');
  };

  const handleGlobalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGlobalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  // ==================== Render Functions ====================
  const renderPlaceTypes = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">ประเภทสถานที่ (Place Types)</h2>
          <p className="text-gray-600 mt-1">จัดการประเภทสถานที่ท่องเที่ยวที่ LLM จะใช้ในการแนะนำ</p>
        </div>
        <Button onClick={handleAddPlaceType}>
          <span className="text-xl">+</span> เพิ่มประเภท
        </Button>
      </div>

      <Table
        columns={[
          { header: 'Value', field: 'value' },
          { header: 'ชื่อ (ภาษาไทย)', field: 'label' },
          {
            header: 'สถานะ',
            field: 'status',
            render: (type) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTogglePlaceType(type.id)}
              >
                <Badge variant={type.isActive ? 'success' : 'gray'} size="sm">
                  {type.isActive ? '✓ เปิดใช้งาน' : '✗ ปิดใช้งาน'}
                </Badge>
              </Button>
            )
          },
          {
            header: 'จัดการ',
            field: 'actions',
            align: 'right',
            render: (type) => (
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleEditPlaceType(type)}>
                  แก้ไข
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeletePlaceType(type.id)} className="text-red-600 hover:text-red-900">
                  ลบ
                </Button>
              </div>
            )
          }
        ]}
        data={placeTypes}
      />

      {/* Modal สำหรับเพิ่ม/แก้ไข Place Type */}
      <Modal
        isOpen={showPlaceTypeModal}
        onClose={() => setShowPlaceTypeModal(false)}
        title={editingPlaceType ? 'แก้ไขประเภทสถานที่' : 'เพิ่มประเภทสถานที่'}
        maxWidth="md"
      >
        <form onSubmit={handleSavePlaceType} className="space-y-4">
          <Input
            label="Value (ภาษาอังกฤษ)"
            required
            value={placeTypeForm.value}
            onChange={(e) => setPlaceTypeForm({ ...placeTypeForm, value: e.target.value })}
            placeholder="เช่น tourist_attraction"
          />
          <Input
            label="ชื่อ (ภาษาไทย)"
            required
            value={placeTypeForm.label}
            onChange={(e) => setPlaceTypeForm({ ...placeTypeForm, label: e.target.value })}
            placeholder="เช่น สถานที่ท่องเที่ยว"
          />
          <Checkbox
            label="เปิดใช้งาน"
            checked={placeTypeForm.isActive}
            onChange={(e) => setPlaceTypeForm({ ...placeTypeForm, isActive: e.target.checked })}
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit" fullWidth>
              บันทึก
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={() => setShowPlaceTypeModal(false)}>
              ยกเลิก
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );

  const renderActivityCategories = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">หมวดหมู่กิจกรรม (Activity Categories)</h2>
          <p className="text-gray-600 mt-1">จัดการหมวดหมู่กิจกรรมที่ LLM จะใช้ในการแนะนำ</p>
        </div>
        <Button onClick={handleAddActivity}>
          <span className="text-xl">+</span> เพิ่มหมวดหมู่
        </Button>
      </div>

      <Table
        columns={[
          { header: 'Value', field: 'value' },
          { header: 'ชื่อ (ภาษาไทย)', field: 'label' },
          {
            header: 'สถานะ',
            field: 'status',
            render: (activity) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleActivity(activity.id)}
              >
                <Badge variant={activity.isActive ? 'success' : 'gray'} size="sm">
                  {activity.isActive ? '✓ เปิดใช้งาน' : '✗ ปิดใช้งาน'}
                </Badge>
              </Button>
            )
          },
          {
            header: 'จัดการ',
            field: 'actions',
            align: 'right',
            render: (activity) => (
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleEditActivity(activity)}>
                  แก้ไข
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteActivity(activity.id)} className="text-red-600 hover:text-red-900">
                  ลบ
                </Button>
              </div>
            )
          }
        ]}
        data={activityCategories}
      />

      {/* Modal สำหรับเพิ่ม/แก้ไข Activity */}
      <Modal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        title={editingActivity ? 'แก้ไขหมวดหมู่กิจกรรม' : 'เพิ่มหมวดหมู่กิจกรรม'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveActivity} className="space-y-4">
          <Input
            label="Value (ภาษาอังกฤษ)"
            required
            value={activityForm.value}
            onChange={(e) => setActivityForm({ ...activityForm, value: e.target.value })}
            placeholder="เช่น outdoor"
          />
          <Input
            label="ชื่อ (ภาษาไทย)"
            required
            value={activityForm.label}
            onChange={(e) => setActivityForm({ ...activityForm, label: e.target.value })}
            placeholder="เช่น กิจกรรมกลางแจ้ง"
          />
          <Checkbox
            label="เปิดใช้งาน"
            checked={activityForm.isActive}
            onChange={(e) => setActivityForm({ ...activityForm, isActive: e.target.checked })}
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit" fullWidth>
              บันทึก
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={() => setShowActivityModal(false)}>
              ยกเลิก
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );

  const renderEventCategories = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">หมวดหมู่งาน/กิจกรรม (Event Categories)</h2>
          <p className="text-gray-600 mt-1">จัดการหมวดหมู่งานและเทศกาลที่ LLM จะใช้ในการแนะนำ</p>
        </div>
        <Button onClick={handleAddEvent}>
          <span className="text-xl">+</span> เพิ่มหมวดหมู่
        </Button>
      </div>

      <Table
        columns={[
          { header: 'Value', field: 'value' },
          { header: 'ชื่อ (ภาษาไทย)', field: 'label' },
          {
            header: 'สถานะ',
            field: 'status',
            render: (event) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleEvent(event.id)}
              >
                <Badge variant={event.isActive ? 'success' : 'gray'} size="sm">
                  {event.isActive ? '✓ เปิดใช้งาน' : '✗ ปิดใช้งาน'}
                </Badge>
              </Button>
            )
          },
          {
            header: 'จัดการ',
            field: 'actions',
            align: 'right',
            render: (event) => (
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleEditEvent(event)}>
                  แก้ไข
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)} className="text-red-600 hover:text-red-900">
                  ลบ
                </Button>
              </div>
            )
          }
        ]}
        data={eventCategories}
      />

      {/* Modal สำหรับเพิ่ม/แก้ไข Event */}
      <Modal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        title={editingEvent ? 'แก้ไขหมวดหมู่งาน' : 'เพิ่มหมวดหมู่งาน'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <Input
            label="Value (ภาษาอังกฤษ)"
            required
            value={eventForm.value}
            onChange={(e) => setEventForm({ ...eventForm, value: e.target.value })}
            placeholder="เช่น concert"
          />
          <Input
            label="ชื่อ (ภาษาไทย)"
            required
            value={eventForm.label}
            onChange={(e) => setEventForm({ ...eventForm, label: e.target.value })}
            placeholder="เช่น คอนเสิร์ต"
          />
          <Checkbox
            label="เปิดใช้งาน"
            checked={eventForm.isActive}
            onChange={(e) => setEventForm({ ...eventForm, isActive: e.target.checked })}
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit" fullWidth>
              บันทึก
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={() => setShowEventModal(false)}>
              ยกเลิก
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );

  const renderGlobalSettings = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">การตั้งค่าทั่วไป (Global Settings)</h2>
          <p className="text-gray-600 mt-1">ตั้งค่าพารามิเตอร์สำคัญของระบบ</p>
        </div>
        {!isEditingGlobal && (
          <Button onClick={() => setIsEditingGlobal(true)}>
            แก้ไขการตั้งค่า
          </Button>
        )}
      </div>

      <form onSubmit={handleSaveGlobalSettings} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* System Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="ชื่อระบบ"
            name="systemName"
            value={globalSettings.systemName}
            onChange={handleGlobalInputChange}
            disabled={!isEditingGlobal}
          />
          <Input
            label="เวอร์ชัน"
            name="systemVersion"
            value={globalSettings.systemVersion}
            onChange={handleGlobalInputChange}
            disabled={!isEditingGlobal}
          />
        </div>

        {/* Language & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="ภาษาเริ่มต้น"
            name="defaultLanguage"
            value={globalSettings.defaultLanguage}
            onChange={handleGlobalInputChange}
            disabled={!isEditingGlobal}
            options={[
              { value: 'th', label: 'ไทย' },
              { value: 'en', label: 'English' }
            ]}
          />
          <Select
            label="ระดับงบประมาณเริ่มต้น"
            name="defaultBudgetLevel"
            value={globalSettings.defaultBudgetLevel}
            onChange={handleGlobalInputChange}
            disabled={!isEditingGlobal}
            options={[
              { value: 'low', label: 'ต่ำ' },
              { value: 'medium', label: 'กลาง' },
              { value: 'high', label: 'สูง' }
            ]}
          />
        </div>

        {/* Itinerary Limits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="จำนวนวันขั้นต่ำในโปรแกรม"
            type="number"
            name="minItineraryDays"
            value={globalSettings.minItineraryDays}
            onChange={handleGlobalInputChange}
            disabled={!isEditingGlobal}
            min="1"
          />
          <Input
            label="จำนวนวันสูงสุดในโปรแกรม"
            type="number"
            name="maxItineraryDays"
            value={globalSettings.maxItineraryDays}
            onChange={handleGlobalInputChange}
            disabled={!isEditingGlobal}
            min="1"
            max="30"
          />
        </div>

        {/* Feature Toggles */}
        <div className="space-y-3 border-t pt-6">
          <h3 className="font-semibold text-gray-800 mb-3">คุณสมบัติระบบ</h3>
          <Checkbox
            label="เปิดใช้งานการแนะนำโดย LLM (AI-powered recommendations)"
            name="enableLLMSuggestions"
            checked={globalSettings.enableLLMSuggestions}
            onChange={handleGlobalInputChange}
            disabled={!isEditingGlobal}
          />
          <Checkbox
            label="เปิดใช้งานโปรแกรมสาธารณะ (ผู้ใช้สามารถแชร์โปรแกรมได้)"
            name="enablePublicItineraries"
            checked={globalSettings.enablePublicItineraries}
            onChange={handleGlobalInputChange}
            disabled={!isEditingGlobal}
          />
        </div>

        {/* API Keys */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="font-semibold text-gray-800 mb-3">API Keys</h3>
          <Input
            label="Google Maps API Key"
            name="mapApiKey"
            value={globalSettings.mapApiKey}
            onChange={handleGlobalInputChange}
            disabled={!isEditingGlobal}
            placeholder="AIzaSy..."
            className="font-mono text-sm"
          />
          <Input
            label="OpenAI API Key"
            name="openAiApiKey"
            value={globalSettings.openAiApiKey}
            onChange={handleGlobalInputChange}
            disabled={!isEditingGlobal}
            placeholder="sk-..."
            className="font-mono text-sm"
          />
        </div>

        {/* Save Button */}
        {isEditingGlobal && (
          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" fullWidth>
              บันทึกการตั้งค่า
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setIsEditingGlobal(false);
                setGlobalSettings(MOCK_GLOBAL_SETTINGS);
              }}
            >
              ยกเลิก
            </Button>
          </div>
        )}
      </form>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* หัวข้อหน้า */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">การตั้งค่า (Settings)</h1>
        <p className="text-gray-600 mt-1">จัดการประเภทต่างๆ และตัวแปรสำคัญของระบบ</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('placeTypes')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'placeTypes'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏛️ ประเภทสถานที่
            </button>
            <button
              onClick={() => setActiveTab('activityCategories')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'activityCategories'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🎯 หมวดหมู่กิจกรรม
            </button>
            <button
              onClick={() => setActiveTab('eventCategories')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'eventCategories'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🎪 หมวดหมู่งาน
            </button>
            <button
              onClick={() => setActiveTab('globalSettings')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'globalSettings'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ⚙️ การตั้งค่าทั่วไป
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'placeTypes' && renderPlaceTypes()}
        {activeTab === 'activityCategories' && renderActivityCategories()}
        {activeTab === 'eventCategories' && renderEventCategories()}
        {activeTab === 'globalSettings' && renderGlobalSettings()}
      </div>
    </div>
  );
}