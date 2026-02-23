import { useState, useEffect } from 'react';

// Mock data สำหรับ Itineraries (โปรแกรมการเดินทาง)
const MOCK_ITINERARIES = [
  {
    id: 1,
    title: 'ทริปสุดสัปดาห์ขอนแก่น 2 วัน 1 คืน',
    theme: 'วัฒนธรรมและธรรมชาติ',
    days: 2,
    generatedBy: 'LLM',
    isPublic: true,
    stops: [
      { day: 1, time: '09:00', placeName: 'หนองแวง', activity: 'ถ่ายรูป ชมทิวทัศน์ยามเช้า' },
      { day: 1, time: '12:00', placeName: 'ร้านอาหารเมืองขอนแก่น', activity: 'ทานอาหารกลางวัน' },
      { day: 1, time: '14:00', placeName: 'พิพิธภัณฑ์ท้องถิ่นขอนแก่น', activity: 'ชมนิทรรศการ เรียนรู้ประวัติศาสตร์' },
      { day: 2, time: '08:00', placeName: 'ตลาดต้นตาล', activity: 'ช้อปปิ้งของฝาก' }
    ]
  },
  {
    id: 2,
    title: 'ทริปเที่ยวครอบครัว 3 วัน 2 คืน',
    theme: 'สนุกสนาน/ท่องเที่ยว',
    days: 3,
    generatedBy: 'User',
    isPublic: false,
    stops: [
      { day: 1, time: '10:00', placeName: 'ศูนย์การค้าเซ็นทรัลพลาซ่า', activity: 'ช้อปปิ้ง พักผ่อน' },
      { day: 2, time: '09:00', placeName: 'สวนสาธารณะบึงแก่นนคร', activity: 'ปั่นจักรยาน วิ่งออกกำลังกาย' },
      { day: 3, time: '08:00', placeName: 'ตลาดบ้านโคก', activity: 'ชิมอาหารพื้นถิ่น' }
    ]
  },
  {
    id: 3,
    title: 'One Day Trip ขอนแก่น',
    theme: 'ท่องเที่ยวแบบเร็ว',
    days: 1,
    generatedBy: 'LLM',
    isPublic: true,
    stops: [
      { day: 1, time: '08:00', placeName: 'หนองแวง', activity: 'เช็คอิน ชมทะเลสาบ' },
      { day: 1, time: '12:00', placeName: 'ร้านอาหารเก่งเจ๊ก', activity: 'ทานอาหารกลางวัน' },
      { day: 1, time: '15:00', placeName: 'พิพิธภัณฑ์ไดโนเสาร์', activity: 'ชมโครงกระดูกไดโนเสาร์' }
    ]
  }
];

function ItinerariesPage() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGeneratedBy, setFilterGeneratedBy] = useState('all');
  const [filterPublic, setFilterPublic] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state สำหรับเพิ่ม Itinerary
  const [formData, setFormData] = useState({
    title: '',
    theme: '',
    days: 1,
    generatedBy: 'User',
    isPublic: true,
  });

  // ใช้ Mock data แทน API
  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = () => {
    // จำลองการโหลดข้อมูล
    setLoading(true);
    setTimeout(() => {
      setItineraries(MOCK_ITINERARIES);
      setLoading(false);
    }, 500);
  };

  // ฟังก์ชันกรองข้อมูล
  const filteredItineraries = itineraries.filter(itinerary => {
    const matchesSearch = itinerary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         itinerary.theme.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGeneratedBy = filterGeneratedBy === 'all' || itinerary.generatedBy === filterGeneratedBy;
    const matchesPublic = filterPublic === 'all' || 
                         (filterPublic === 'public' && itinerary.isPublic) ||
                         (filterPublic === 'private' && !itinerary.isPublic);
    return matchesSearch && matchesGeneratedBy && matchesPublic;
  });

  // จัดการเปลี่ยนค่า form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ฟังก์ชันเพิ่ม Itinerary ใหม่
  const handleAddItinerary = (e) => {
    e.preventDefault();
    
    const newItinerary = {
      id: itineraries.length + 1,
      ...formData,
      days: Number(formData.days),
      stops: [] // เริ่มต้นด้วย array ว่าง
    };

    setItineraries([...itineraries, newItinerary]);
    setShowAddModal(false);
    
    // รีเซ็ตฟอร์ม
    setFormData({
      title: '',
      theme: '',
      days: 1,
      generatedBy: 'User',
      isPublic: true,
    });
  };

  // ฟังก์ชันลบ Itinerary
  const handleDeleteItinerary = (id) => {
    if (confirm('คุณต้องการลบโปรแกรมนี้หรือไม่?')) {
      setItineraries(itineraries.filter(itinerary => itinerary.id !== id));
    }
  };

  // ฟังก์ชัน Toggle สถานะ Public/Private
  const handleTogglePublic = (id) => {
    setItineraries(itineraries.map(itinerary => 
      itinerary.id === id 
        ? { ...itinerary, isPublic: !itinerary.isPublic }
        : itinerary
    ));
  };

  // แสดงสถานะโหลด
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* หัวข้อหน้า */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">จัดการโปรแกรมการเดินทาง (Itineraries)</h1>
        <p className="text-gray-600">
          Itinerary คือโปรแกรมการเดินทางแบบเต็มรูปแบบ ประกอบด้วยสถานที่หลายจุดและกิจกรรมต่างๆ 
          อาจถูกสร้างโดย LLM หรือผู้ใช้จัดเอง โปรแกรมที่เป็น Public จะถูกแชร์ให้ผู้อื่นใช้ได้
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="ค้นหาโปรแกรม..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Filter Generated By */}
          <select
            value={filterGeneratedBy}
            onChange={(e) => setFilterGeneratedBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">ทุกแหล่งที่มา</option>
            <option value="LLM">สร้างโดย LLM</option>
            <option value="User">สร้างโดยผู้ใช้</option>
          </select>

          {/* Filter Public/Private */}
          <select
            value={filterPublic}
            onChange={(e) => setFilterPublic(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="public">สาธารณะ</option>
            <option value="private">ส่วนตัว</option>
          </select>

          {/* ปุ่มเพิ่ม */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span> เพิ่มโปรแกรม
          </button>
        </div>

        {/* สรุปจำนวน */}
        <div className="mt-4 text-sm text-gray-600">
          แสดง {filteredItineraries.length} จาก {itineraries.length} โปรแกรมทั้งหมด
        </div>
      </div>

      {/* Itineraries List */}
      <div className="space-y-4">
        {filteredItineraries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            ไม่พบโปรแกรมที่คุณค้นหา
          </div>
        ) : (
          filteredItineraries.map(itinerary => (
            <div key={itinerary.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{itinerary.title}</h3>
                    
                    {/* Badges */}
                    <div className="flex gap-2 mb-3">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                        {itinerary.days} วัน
                      </span>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                        itinerary.generatedBy === 'LLM' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {itinerary.generatedBy === 'LLM' ? '🤖 LLM สร้าง' : '👤 ผู้ใช้สร้าง'}
                      </span>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                        itinerary.isPublic 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {itinerary.isPublic ? '🌐 สาธารณะ' : '🔒 ส่วนตัว'}
                      </span>
                    </div>

                    {/* Theme */}
                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">ธีม:</span> {itinerary.theme}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleTogglePublic(itinerary.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        itinerary.isPublic
                          ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                    >
                      {itinerary.isPublic ? '🔒 ทำเป็นส่วนตัว' : '🌐 เผยแพร่'}
                    </button>
                    <button
                      onClick={() => handleDeleteItinerary(itinerary.id)}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
                    >
                      ลบ
                    </button>
                  </div>
                </div>

                {/* Timeline of Stops */}
                {itinerary.stops && itinerary.stops.length > 0 && (
                  <div className="mt-4 pl-4 border-l-4 border-blue-200">
                    <h4 className="font-semibold text-gray-700 mb-3">จุดแวะในโปรแกรม:</h4>
                    <div className="space-y-3">
                      {itinerary.stops.map((stop, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-600">
                            วันที่ {stop.day}
                          </div>
                          <div className="flex-shrink-0 w-16 text-sm text-gray-500">
                            {stop.time}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{stop.placeName}</p>
                            <p className="text-sm text-gray-600">{stop.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ถ้าไม่มี stops */}
                {(!itinerary.stops || itinerary.stops.length === 0) && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                    ยังไม่มีจุดแวะในโปรแกรมนี้
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal สำหรับเพิ่มโปรแกรม */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">เพิ่มโปรแกรมการเดินทางใหม่</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddItinerary} className="space-y-5">
                {/* ชื่อโปรแกรม */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อโปรแกรม *
                    <span className="text-gray-500 font-normal ml-2">
                      (LLM ใช้เพื่อ: แสดงหัวข้อให้ผู้ใช้เห็นว่าโปรแกรมนี้เกี่ยวกับอะไร)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="เช่น ทริปสุดสัปดาห์ขอนแก่น 2 วัน 1 คืน"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* ธีมของโปรแกรม */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ธีมโปรแกรม *
                    <span className="text-gray-500 font-normal ml-2">
                      (LLM ใช้เพื่อ: จับคู่ธีมกับความชอบของผู้ใช้ เช่น ชอบวัฒนธรรม ธรรมชาติ หรือการผจญภัย)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    required
                    placeholder="เช่น วัฒนธรรมและธรรมชาติ, สนุกสนาน/ท่องเที่ยว"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* จำนวนวัน */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    จำนวนวัน *
                    <span className="text-gray-500 font-normal ml-2">
                      (LLM ใช้เพื่อ: แนะนำโปรแกรมให้ตรงกับระยะเวลาที่ผู้ใช้มี)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="days"
                    value={formData.days}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="30"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* สร้างโดย */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สร้างโดย *
                    <span className="text-gray-500 font-normal ml-2">
                      (LLM ใช้เพื่อ: ระบุว่าโปรแกรมนี้เป็น AI-generated หรือผู้ใช้จัดเอง)
                    </span>
                  </label>
                  <select
                    name="generatedBy"
                    value={formData.generatedBy}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="User">ผู้ใช้</option>
                    <option value="LLM">LLM</option>
                  </select>
                </div>

                {/* สถานะ Public/Private */}
                <div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="isPublic" className="ml-2 text-sm font-medium text-gray-700">
                      เผยแพร่เป็นสาธารณะ (Public)
                      <span className="text-gray-500 font-normal ml-2">
                        (LLM ใช้เพื่อ: แชร์โปรแกรมนี้ให้ผู้อื่นเห็นและใช้ได้)
                      </span>
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 ml-6">
                    ✓ ถ้าเป็น Public: โปรแกรมจะถูกแชร์และผู้อื่นสามารถใช้เป็นต้นแบบได้<br />
                    ✗ ถ้าเป็น Private: เฉพาะเจ้าของเท่านั้นที่เห็น
                  </p>
                </div>

                {/* หมายเหตุ */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>💡 หมายเหตุ:</strong> หลังจากสร้างโปรแกรมแล้ว คุณสามารถเพิ่มจุดแวะต่างๆ (Stops) 
                    ที่ต้องการเข้าไปในโปรแกรมได้ในภายหลัง
                  </p>
                </div>

                {/* ปุ่ม Submit */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    เพิ่มโปรแกรม
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItinerariesPage;
