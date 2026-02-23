import { useState, useEffect } from 'react';
import { Button, Input, Select, Modal, Badge, Checkbox } from '../components';

// Mock Data -ข้อมูลจำลองกิจกรรม
// ใช้สำหรับ LLM แนะนำกิจกรรมที่เหมาะสมกับความชอบของผู้ใช้
const MOCK_ACTIVITIES = [
  {
    _id: '1',
    name: 'ปั่นจักรยานชมเมือง',
    slug: 'cycling-city-tour',
    category: 'outdoor',
    description: 'สัมผัสบรรยากาศเมืองด้วยการปั่นจักรยานผ่านจุดสำคัญต่างๆ',
    coverImage: 'https://via.placeholder.com/400x300?text=Cycling',
    tags: ['family-friendly', 'exercise', 'eco-friendly'],
    suitableFor: { solo: true, couple: true, family: true, group: true },
    places: [{ placeId: '1' }, { placeId: '5' }]
  },
  {
    _id: '2',
    name: 'ชิมอาหารริมทาง',
    slug: 'street-food-tasting',
    category: 'food',
    description: 'ชิมอาหารไทยแท้รสเด็ดจากร้านริมทาง',
    coverImage: 'https://via.placeholder.com/400x300?text=Street+Food',
    tags: ['local-experience', 'budget', 'authentic'],
    suitableFor: { solo: true, couple: true, family: false, group: true },
    places: [{ placeId: '3' }]
  },
  {
    _id: '3',
    name: 'เรียนรู้วัฒนธรรมไทย',
    slug: 'thai-culture-workshop',
    category: 'culture',
    description: 'เรียนรู้ประวัติศาสตร์และวัฒนธรรมไทยจากพิพิธภัณฑ์',
    coverImage: 'https://via.placeholder.com/400x300?text=Culture',
    tags: ['educational', 'indoor', 'family-friendly'],
    suitableFor: { solo: true, couple: true, family: true, group: true },
    places: [{ placeId: '4' }]
  },
  {
    _id: '4',
    name: 'ช้อปปิ้งตลาดนัด',
    slug: 'market-shopping',
    category: 'shopping',
    description: 'ช้อปปิ้งสินค้าหลากหลายในตลาดนัดที่ใหญ่ที่สุด',
    coverImage: 'https://via.placeholder.com/400x300?text=Market',
    tags: ['shopping', 'local-products', 'souvenir'],
    suitableFor: { solo: true, couple: true, family: true, group: true },
    places: [{ placeId: '2' }]
  }
];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'outdoor',
    description: '',
    tags: '',
    suitableForSolo: false,
    suitableForCouple: false,
    suitableForFamily: false,
    suitableForGroup: false
  });

  async function fetchActivities() {
    try {
      setTimeout(() => {
       setActivities(MOCK_ACTIVITIES);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || activity.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddActivity = (e) => {
    e.preventDefault();
    
    const newActivity = {
      _id: Date.now().toString(),
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      category: formData.category,
      description: formData.description,
      coverImage: `https://via.placeholder.com/400x300?text=${formData.name}`,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      suitableFor: {
        solo: formData.suitableForSolo,
        couple: formData.suitableForCouple,
        family: formData.suitableForFamily,
        group: formData.suitableForGroup
      },
      places: []
    };

    setActivities([...activities, newActivity]);
    setShowAddModal(false);
    setFormData({
      name: '',
      category: 'outdoor',
      description: '',
      tags: '',
      suitableForSolo: false,
      suitableForCouple: false,
      suitableForFamily: false,
      suitableForGroup: false
    });
    
    alert('เพิ่มกิจกรรมสำเร็จ! LLM จะใช้ข้อมูลนี้แนะนำกิจกรรมที่เหมาะสมให้ผู้ใช้');
  };

  const handleDeleteActivity = (id) => {
    if (confirm('คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?')) {
      setActivities(activities.filter(activity => activity._id !== id));
      alert('ลบกิจกรรมสำเร็จ!');
    }
  };

  const categoryLabels = {
    outdoor: 'กลางแจ้ง',
    food: 'อาหาร',
    culture: 'วัฒนธรรม',
    shopping: 'ช้อปปิ้ง',
    wellness: 'สุขภาพ',
    entertainment: 'บันเทิง',
    sports: 'กีฬา',
    education: 'การศึกษา'
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">จัดการกิจกรรม</h1>
        <p className="text-gray-600">จัดการข้อมูลกิจกรรมท่องเที่ยวทั้งหมด</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="ค้นหากิจกรรม..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[
              { value: 'all', label: 'ทุกหมวดหมู่' },
              { value: 'outdoor', label: 'กลางแจ้ง' },
              { value: 'food', label: 'อาหาร' },
              { value: 'culture', label: 'วัฒนธรรม' },
              { value: 'shopping', label: 'ช้อปปิ้ง' },
              { value: 'wellness', label: 'สุขภาพ' },
              { value: 'entertainment', label: 'บันเทิง' },
              { value: 'sports', label: 'กีฬา' },
              { value: 'education', label: 'การศึกษา' }
            ]}
          />
          <Button onClick={() => setShowAddModal(true)}>
            + เพิ่มกิจกรรม
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          กำลังโหลดข้อมูล...
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          ไม่พบข้อมูลกิจกรรม
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <div key={activity._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48

 bg-gray-200 relative">
                {activity.coverImage ? (
                  <img src={activity.coverImage} alt={activity.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    ไม่มีรูปภาพ
                  </div>
                )}
                <span className={`absolute top-2 right-2 px-3 py-1 text-xs rounded-full text-white ${
                  activity.category === 'outdoor' ? 'bg-green-500' :
                  activity.category === 'food' ? 'bg-orange-500' :
                  activity.category === 'culture' ? 'bg-purple-500' :
                  activity.category === 'shopping' ? 'bg-pink-500' :
                  activity.category === 'wellness' ? 'bg-teal-500' :
                  activity.category === 'entertainment' ? 'bg-red-500' :
                  activity.category === 'sports' ? 'bg-emerald-500' :
                  'bg-gray-500'
                }`}>
                  {categoryLabels[activity.category] || activity.category}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{activity.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {activity.description || 'ไม่มีคำอธิบาย'}
                </p>

                {activity.tags && activity.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {activity.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                        {tag}
                      </span>
                    ))}
                    {activity.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                        +{activity.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 text-xs text-gray-600 mb-3">
                  {activity.suitableFor?.solo && <span>👤 เดี่ยว</span>}
                  {activity.suitableFor?.couple && <span>💑 คู่</span>}
                  {activity.suitableFor?.family && <span>👨‍👩‍👧‍👦 ครอบครัว</span>}
                  {activity.suitableFor?.group && <span>👥 กลุ่ม</span>}
                </div>

                <div className="text-sm text-gray-500 mb-3">
                  📍 {activity.places?.length || 0} สถานที่
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" fullWidth>
                    แก้ไข
                  </Button>
                  <Button 
                    variant="danger"
                    size="sm"
                    fullWidth
                    onClick={() => handleDeleteActivity(activity._id)}
                  >
                    ลบ
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="เพิ่มกิจกรรมใหม่"
        maxWidth="2xl"
      >
        <div className="mb-4 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>💡 คำอธิบาย:</strong> กิจกรรมนี้จะถูกใช้โดย <strong>LLM และ Chatbot</strong> ในการแนะนำกิจกรรม
            ที่เหมาะสมตามความสนใจ ประเภทนักท่องเที่ยว และลักษณะการเดินทาง (เดี่ยว/คู่/ครอบครัว/กลุ่ม)
          </p>
        </div>

        <form onSubmit={handleAddActivity}>
          <div className="space-y-4">
            <Input
              label="ชื่อกิจกรรม"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="เช่น ปั่นจักรยานชมเมือง, ชิมอาหารริมทาง"
              helperText="LLM ใช้ชื่อนี้ในการแนะนำกิจกรรมผ่าน Chatbot"
            />

            <Select
              label="หมวดหมู่"
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              options={[
                { value: 'outdoor', label: 'กลางแจ้ง' },
                { value: 'food', label: 'อาหาร' },
                { value: 'culture', label: 'วัฒนธรรม' },
                { value: 'shopping', label: 'ช้อปปิ้ง' },
                { value: 'wellness', label: 'สุขภาพ' },
                { value: 'entertainment', label: 'บันเทิง' },
                { value: 'sports', label: 'กีฬา' },
                { value: 'education', label: 'การศึกษา' }
              ]}
              helperText="ใช้จัดหมวดหมู่และกรองกิจกรรมตามความสนใจ"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                คำอธิบายกิจกรรม
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="อธิบายรายละเอียดกิจกรรม..."
              />
              <p className="text-xs text-gray-500 mt-1">LLM ใช้ข้อมูลนี้ในการสร้างคำแนะนำที่ละเอียดขึ้น</p>
            </div>

            <Input
              label="แท็ก (คั่นด้วยเครื่องหมายจุลภาค)"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="family-friendly, budget, instagram-worthy"
              helperText="แท็กช่วย LLM ค้นหาและแนะนำกิจกรรมที่ตรงใจมากขึ้น"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เหมาะสำหรับ <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <Checkbox
                  label="👤 นักท่องเที่ยวเดี่ยว (Solo)"
                  checked={formData.suitableForSolo}
                  onChange={(e) => setFormData({...formData, suitableForSolo: e.target.checked})}
                />
                <Checkbox
                  label="💑 คู่รัก (Couple)"
                  checked={formData.suitableForCouple}
                  onChange={(e) => setFormData({...formData, suitableForCouple: e.target.checked})}
                />
                <Checkbox
                  label="👨‍👩‍👧‍👦 ครอบครัว (Family)"
                  checked={formData.suitableForFamily}
                  onChange={(e) => setFormData({...formData, suitableForFamily: e.target.checked})}
                />
                <Checkbox
                  label="👥 กลุ่มเพื่อน (Group)"
                  checked={formData.suitableForGroup}
                  onChange={(e) => setFormData({...formData, suitableForGroup: e.target.checked})}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                LLM ใช้ข้อมูลนี้กรองกิจกรรมตามลักษณะการเดินทาง
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button type="submit" fullWidth>
              เพิ่มกิจกรรม
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
