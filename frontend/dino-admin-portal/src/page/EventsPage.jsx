import { useState, useEffect } from 'react';

// Mock data สำหรับ Events (งาน/กิจกรรม ที่จะจัดขึ้นในอนาคต)
const MOCK_EVENTS = [
  {
    id: 1,
    name: 'เทศกาลไหมและพาแลงขอนแก่น 2024',
    category: 'festival',
    description: 'งานประจำปีที่แสดงเอกลักษณ์ของขอนแก่น มีการแสดงสินค้าพื้นถิ่น ผ้าไหม และการแสดงวัฒนธรรม พร้อมด้วยขบวนพาเหรดสุดอลังการ และการจับฉลากรางวัลมากมาย',
    startDate: '2024-12-01',
    endDate: '2024-12-10',
    venueName: 'ศูนย์ประชุมและแสดงสินค้านานาชาติเอ็มพรีส',
    ticketPrice: 0,
    isFree: true,
    status: 'upcoming'
  },
  {
    id: 2,
    name: 'คอนเสิร์ตดนตรีคลาสสิก - Khon Kaen Symphony',
    category: 'concert',
    description: 'การแสดงดนตรีคลาสสิกโดยวงออเคสตราจังหวัดขอนแก่น ร่วมกับศิลปินรับเชิญชื่อดัง นำเสนอบทเพลงคลาสสิกจากนักประพันธ์ระดับโลก',
    startDate: '2024-11-15',
    endDate: '2024-11-15',
    venueName: 'หอประชุมมหาวิทยาลัยขอนแก่น',
    ticketPrice: 500,
    isFree: false,
    status: 'upcoming'
  },
  {
    id: 3,
    name: 'ตลาดนัดต้นตาล - ของดีจังหวัดขอนแก่น',
    category: 'market',
    description: 'ตลาดนัดขายของดีจากทั่วจังหวัดขอนแก่น ทั้งอาหารพื้นเมือง สินค้าหัตถกรรม และผลิตภัณฑ์ OTOP เปิดทุกสุดสัปดาห์ จุดนัดพบของคนรักของดี',
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    venueName: 'สวนหย่อมต้นตาล',
    ticketPrice: 0,
    isFree: true,
    status: 'ongoing'
  }
];

// หมวดหมู่งาน (ใช้แปลงค่าจาก enum เป็นภาษาไทย)
const categoryLabels = {
  concert: 'คอนเสิร์ต',
  festival: 'เทศกาล',
  exhibition: 'นิทรรศการ',
  sport: 'กีฬา',
  market: 'ตลาดนัด',
  workshop: 'เวิร์กช็อป',
  religious: 'งานศาสนา',
  food: 'อาหาร',
  other: 'อื่นๆ'
};

const statusLabels = {
  upcoming: 'เร็วๆ นี้',
  ongoing: 'กำลังจัดขึ้น',
  completed: 'จัดแล้ว',
  cancelled: 'ยกเลิก'
};

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state สำหรับเพิ่มงาน
  const [formData, setFormData] = useState({
    name: '',
    category: 'festival',
    description: '',
    startDate: '',
    endDate: '',
    venueName: '',
    isFree: true,
    ticketPrice: 0,
  });

  // ใช้ Mock data แทน API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    // จำลองการโหลดข้อมูล
    setLoading(true);
    setTimeout(() => {
      setEvents(MOCK_EVENTS);
      setLoading(false);
    }, 500);
  };

  // ฟังก์ชันกรองข้อมูล
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // จัดการเปลี่ยนค่า form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ฟังก์ชันเพิ่มงานใหม่
  const handleAddEvent = (e) => {
    e.preventDefault();
    
    const newEvent = {
      id: events.length + 1,
      ...formData,
      status: 'upcoming', // ค่าเริ่มต้น
      ticketPrice: formData.isFree ? 0 : Number(formData.ticketPrice)
    };

    setEvents([...events, newEvent]);
    setShowAddModal(false);
    
    // รีเซ็ตฟอร์ม
    setFormData({
      name: '',
      category: 'festival',
      description: '',
      startDate: '',
      endDate: '',
      venueName: '',
      isFree: true,
      ticketPrice: 0,
    });
  };

  // ฟังก์ชันลบงาน
  const handleDeleteEvent = (id) => {
    if (confirm('คุณต้องการลบงานนี้หรือไม่?')) {
      setEvents(events.filter(event => event.id !== id));
    }
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">จัดการงาน/กิจกรรม (Events)</h1>
        <p className="text-gray-600">
          Events คืองานหรือกิจกรรมที่มีระยะเวลาจัดขึ้นเฉพาะช่วง เช่น คอนเสิร์ต เทศกาล นิทรรศการ 
          LLM จะใช้ข้อมูลนี้เพื่อแนะนำงานที่เกิดขึ้นตรงกับช่วงเวลาที่ผู้ใช้เดินทาง
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="ค้นหางาน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Filter Category */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">ทุกประเภท</option>
            {Object.keys(categoryLabels).map(key => (
              <option key={key} value={key}>{categoryLabels[key]}</option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">ทุกสถานะ</option>
            {Object.keys(statusLabels).map(key => (
              <option key={key} value={key}>{statusLabels[key]}</option>
            ))}
          </select>

          {/* ปุ่มเพิ่ม */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span> เพิ่มงาน
          </button>
        </div>

        {/* สรุปจำนวน */}
        <div className="mt-4 text-sm text-gray-600">
          แสดง {filteredEvents.length} จาก {events.length} งานทั้งหมด
        </div>
      </div>

      {/* Events List - แบบ Card */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            ไม่พบงานที่คุณค้นหา
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
                    
                    {/* Badges */}
                    <div className="flex gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                        {categoryLabels[event.category]}
                      </span>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                        event.status === 'upcoming' ? 'bg-green-100 text-green-700' :
                        event.status === 'ongoing' ? 'bg-yellow-100 text-yellow-700' :
                        event.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {statusLabels[event.status]}
                      </span>
                      {event.isFree && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                          เข้าฟรี
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
                    >
                      ลบ
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4">{event.description}</p>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📅 วันที่เริ่ม:</span>
                    <span className="font-medium">{new Date(event.startDate).toLocaleDateString('th-TH')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📅 วันที่สิ้นสุด:</span>
                    <span className="font-medium">{new Date(event.endDate).toLocaleDateString('th-TH')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📍 สถานที่:</span>
                    <span className="font-medium">{event.venueName}</span>
                  </div>
                  {!event.isFree && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">💰 ราคาบัตร:</span>
                      <span className="font-medium">{event.ticketPrice} บาท</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal สำหรับเพิ่มงาน */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">เพิ่มงาน/กิจกรรมใหม่</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-5">
                {/* ชื่องาน */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่องาน *
                    <span className="text-gray-500 font-normal ml-2">
                      (LLM ใช้เพื่อ: แสดงชื่องานให้ผู้ใช้เห็น และค้นหาตามชื่อ)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="เช่น เทศกาลไหมและพาแลงขอนแก่น"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* ประเภทงาน */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประเภทงาน *
                    <span className="text-gray-500 font-normal ml-2">
                      (LLM ใช้เพื่อ: จับคู่งานตามความชอบของผู้ใช้ เช่น ชอบเทศกาลหรือคอนเสิร์ต)
                    </span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.keys(categoryLabels).map(key => (
                      <option key={key} value={key}>{categoryLabels[key]}</option>
                    ))}
                  </select>
                </div>

                {/* รายละเอียด */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รายละเอียดงาน
                    <span className="text-gray-500 font-normal ml-2">
                      (LLM ใช้เพื่อ: อธิบายรายละเอียดงานให้ผู้ใช้เข้าใจ ว่างานนี้เหมาะกับเขาหรือไม่)
                    </span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="บรรยายเกี่ยวกับงานนี้ มีกิจกรรมอะไรบ้าง..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* วันที่เริ่ม - สิ้นสุด */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      วันที่เริ่ม *
                      <span className="text-gray-500 font-normal ml-2">
                        (LLM ใช้เพื่อ: เช็คว่างานนี้อยู่ในช่วงเวลาที่ผู้ใช้เดินทางหรือไม่)
                      </span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      วันที่สิ้นสุด *
                      <span className="text-gray-500 font-normal ml-2">
                        (LLM ใช้เพื่อ: ระบุว่างานจัดถึงวันไหน)
                      </span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* สถานที่จัดงาน */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สถานที่จัดงาน *
                    <span className="text-gray-500 font-normal ml-2">
                      (LLM ใช้เพื่อ: บอกผู้ใช้ว่างานจัดที่ไหน เพื่อวางแผนเส้นทาง)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleInputChange}
                    required
                    placeholder="เช่น ศูนย์ประชุมและแสดงสินค้านานาชาติเอ็มพรีส"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* ค่าเข้างาน */}
                <div>
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="isFree"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="isFree" className="ml-2 text-sm font-medium text-gray-700">
                      เข้างานฟรี
                      <span className="text-gray-500 font-normal ml-2">
                        (LLM ใช้เพื่อ: แนะนำงานให้คนชอบงานฟรี หรือผู้ที่งบประมาณน้อย)
                      </span>
                    </label>
                  </div>

                  {!formData.isFree && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ราคาบัตร (บาท)
                        <span className="text-gray-500 font-normal ml-2">
                          (LLM ใช้เพื่อ: คำนวณงบประมาณให้ผู้ใช้)
                        </span>
                      </label>
                      <input
                        type="number"
                        name="ticketPrice"
                        value={formData.ticketPrice}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="500"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* ปุ่ม Submit */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    เพิ่มงาน
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

export default EventsPage;
