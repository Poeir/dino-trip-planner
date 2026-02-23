import { useState, useEffect } from 'react';
import { Button, Input, Select, Modal, Badge, Table } from '../components';

// Mock Data - ข้อมูลจำลองสำหรับสถานที่ท่องเที่ยว
// ใช้สำหรับ LLM และ Chatbot ในการแนะนำสถานที่ท่องเที่ยวให้ผู้ใช้
const MOCK_PLACES = [
  {
    _id: '1',
    google_place_id: 'ChIJxxxxxxxxxxxx1',
    core: {
      name: 'วัดพระแก้ว',
      primaryType: 'tourist_attraction',
      types: ['temple', 'tourist_attraction', 'place_of_worship'],
      location: { lat: 13.7515, lng: 100.4927 },
      rating: 4.7,
      userRatingCount: 45230,
      priceLevel: 1,
      businessStatus: 'OPERATIONAL'
    }
  },
  {
    _id: '2',
    google_place_id: 'ChIJxxxxxxxxxxxx2',
    core: {
      name: 'ตลาดนัดจตุจักร',
      primaryType: 'shopping_mall',
      types: ['shopping_mall', 'market', 'tourist_attraction'],
      location: { lat: 13.7995, lng: 100.5501 },
      rating: 4.5,
      userRatingCount: 32100,
      priceLevel: 2,
      businessStatus: 'OPERATIONAL'
    }
  },
  {
    _id: '3',
    google_place_id: 'ChIJxxxxxxxxxxxx3',
    core: {
      name: 'ร้านอาหาร Som Tam Nua',
      primaryType: 'restaurant',
      types: ['restaurant', 'food', 'thai_restaurant'],
      location: { lat: 13.7440, lng: 100.5413 },
      rating: 4.6,
      userRatingCount: 8920,
      priceLevel: 2,
      businessStatus: 'OPERATIONAL'
    }
  },
  {
    _id: '4',
    google_place_id: 'ChIJxxxxxxxxxxxx4',
    core: {
      name: 'พิพิธภัณฑ์สยาม',
      primaryType: 'museum',
      types: ['museum', 'tourist_attraction', 'cultural_center'],
      location: { lat: 13.7300, lng: 100.4945 },
      rating: 4.4,
      userRatingCount: 5630,
      priceLevel: 1,
      businessStatus: 'OPERATIONAL'
    }
  },
  {
    _id: '5',
    google_place_id: 'ChIJxxxxxxxxxxxx5',
    core: {
      name: 'สวนลุมพินี',
      primaryType: 'park',
      types: ['park', 'tourist_attraction', 'green_space'],
      location: { lat: 13.7307, lng: 100.5418 },
      rating: 4.5,
      userRatingCount: 12450,
      priceLevel: 0,
      businessStatus: 'OPERATIONAL'
    }
  }
];

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    primaryType: 'tourist_attraction',
    rating: 0,
    priceLevel: 1,
    latitude: '',
    longitude: ''
  });

  async function fetchPlaces() {
    try {
      // ใช้ Mock Data แทนการเรียก API จริง
      setTimeout(() => {
        setPlaces(MOCK_PLACES);
        setLoading(false);
      }, 500); // จำลองการโหลดข้อมูล
    } catch (error) {
      console.error('Error fetching places:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlaces();
  }, []);

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.core?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || place.core?.primaryType === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddPlace = (e) => {
    e.preventDefault();
    
    // สร้างข้อมูลสถานที่ใหม่
    const newPlace = {
      _id: Date.now().toString(),
      google_place_id: `ChIJ_mock_${Date.now()}`,
      core: {
        name: formData.name,
        primaryType: formData.primaryType,
        types: [formData.primaryType, 'tourist_attraction'],
        location: { 
          lat: parseFloat(formData.latitude), 
          lng: parseFloat(formData.longitude) 
        },
        rating: parseFloat(formData.rating),
        userRatingCount: 0,
        priceLevel: parseInt(formData.priceLevel),
        businessStatus: 'OPERATIONAL'
      }
    };

    // เพิ่มเข้า Mock Data
    setPlaces([...places, newPlace]);
    
    // ปิด Modal และรีเซ็ตฟอร์ม
    setShowAddModal(false);
    setFormData({
      name: '',
      primaryType: 'tourist_attraction',
      rating: 0,
      priceLevel: 1,
      latitude: '',
      longitude: ''
    });
    
    alert('เพิ่มสถานที่สำเร็จ! ข้อมูลนี้จะถูกใช้โดย LLM และ Chatbot ในการแนะนำสถานที่ท่องเที่ยว');
  };

  const handleDeletePlace = (id) => {
    if (confirm('คุณต้องการลบสถานที่นี้ใช่หรือไม่?')) {
      setPlaces(places.filter(place => place._id !== id));
      alert('ลบสถานที่สำเร็จ!');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">จัดการสถานที่</h1>
        <p className="text-gray-600">จัดการข้อมูลสถานที่ท่องเที่ยวทั้งหมด</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="ค้นหาสถานที่..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'all', label: 'ทุกประเภท' },
              { value: 'tourist_attraction', label: 'สถานที่ท่องเที่ยว' },
              { value: 'restaurant', label: 'ร้านอาหาร' },
              { value: 'hotel', label: 'โรงแรม' },
              { value: 'museum', label: 'พิพิธภัณฑ์' },
              { value: 'park', label: 'สวนสาธารณะ' }
            ]}
          />
          <Button onClick={() => setShowAddModal(true)}>
            + เพิ่มสถานที่
          </Button>
        </div>
      </div>

      {/* Places Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
      ) : (
        <Table
          columns={[
            {
              header: 'ชื่อสถานที่',
              field: 'name',
              render: (place) => (
                <div>
                  <div className="text-sm font-medium text-gray-900">{place.core?.name}</div>
                  <div className="text-sm text-gray-500">{place.google_place_id}</div>
                </div>
              )
            },
            {
              header: 'ประเภท',
              field: 'type',
              render: (place) => (
                <Badge variant="emerald" size="sm">
                  {place.core?.primaryType}
                </Badge>
              )
            },
            {
              header: 'คะแนน',
              field: 'rating',
              render: (place) => (
                <div className="flex items-center">
                  <span className="text-yellow-500">⭐</span>
                  <span className="ml-1 text-sm text-gray-900">{place.core?.rating || 'N/A'}</span>
                  <span className="ml-1 text-xs text-gray-500">({place.core?.userRatingCount || 0})</span>
                </div>
              )
            },
            {
              header: 'สถานะ',
              field: 'status',
              render: (place) => (
                <Badge variant={place.core?.businessStatus === 'OPERATIONAL' ? 'success' : 'danger'} size="sm">
                  {place.core?.businessStatus === 'OPERATIONAL' ? 'เปิดให้บริการ' : 'ปิดให้บริการ'}
                </Badge>
              )
            },
            {
              header: 'จัดการ',
              field: 'actions',
              align: 'right',
              render: (place) => (
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm">แก้ไข</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeletePlace(place._id)} className="text-red-600 hover:text-red-900">
                    ลบ
                  </Button>
                </div>
              )
            }
          ]}
          data={filteredPlaces}
        />
      )}

      {/* Add Place Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="เพิ่มสถานที่ใหม่"
        maxWidth="2xl"
      >
        <div className="mb-4 p-4 bg-emerald-50 rounded-lg">
          <p className="text-sm text-emerald-800">
            <strong>💡 คำอธิบาย:</strong> ข้อมูลสถานที่นี้จะถูกใช้โดย <strong>LLM และ Chatbot</strong> ในระบบ Trip Planner 
            เพื่อแนะนำสถานที่ท่องเที่ยวที่เหมาะสมให้กับผู้ใช้ตามความต้องการและงบประมาณ
          </p>
        </div>

        <form onSubmit={handleAddPlace}>
          <div className="space-y-4">
            <Input
              label="ชื่อสถานที่"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="เช่น วัดพระแก้ว, ตลาดนัดจตุจักร"
              helperText="ใช้สำหรับแสดงและค้นหาสถานที่ในระบบ"
            />

            <Select
              label="ประเภทสถานที่"
              required
              value={formData.primaryType}
              onChange={(e) => setFormData({...formData, primaryType: e.target.value})}
              options={[
                { value: 'tourist_attraction', label: 'สถานที่ท่องเที่ยว' },
                { value: 'restaurant', label: 'ร้านอาหาร' },
                { value: 'hotel', label: 'โรงแรม' },
                { value: 'museum', label: 'พิพิธภัณฑ์' },
                { value: 'park', label: 'สวนสาธารณะ' },
                { value: 'shopping_mall', label: 'ห้างสรรพสินค้า' },
                { value: 'temple', label: 'วัด/ศาสนสถาน' }
              ]}
              helperText="LLM ใช้ในการกรองและแนะนำสถานที่ตามประเภท"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ละติจูด (Latitude)"
                type="number"
                step="0.000001"
                required
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                placeholder="13.7563"
                helperText="ใช้สำหรับแสดงบนแผนที่"
              />
              <Input
                label="ลองติจูด (Longitude)"
                type="number"
                step="0.000001"
                required
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                placeholder="100.5018"
                helperText="คำนวณระยะทางระหว่างสถานที่"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="คะแนนรีวิว (0-5)"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: e.target.value})}
                placeholder="4.5"
                helperText="LLM ใช้จัดอันดับความน่าสนใจ"
              />
              <Select
                label="ระดับราคา (0-4)"
                value={formData.priceLevel}
                onChange={(e) => setFormData({...formData, priceLevel: e.target.value})}
                options={[
                  { value: '0', label: 'ฟรี (Free)' },
                  { value: '1', label: '$ (ประหยัด)' },
                  { value: '2', label: '$$ (ปานกลาง)' },
                  { value: '3', label: '$$$ (แพง)' },
                  { value: '4', label: '$$$$ (หรูหรา)' }
                ]}
                helperText="ใช้กรองตามงบประมาณผู้ใช้"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button type="submit" fullWidth>
              เพิ่มสถานที่
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
              ยกเลิก
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
