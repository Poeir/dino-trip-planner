import { useState } from 'react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Card from './Card';
import Modal from './Modal';
import { LoadingSpinner } from './Skeleton';

function EventDetailModal({ event, isOpen, onClose, onSave, isSaving = false }) {
  const [formData, setFormData] = useState(event || {});
  const [errors, setErrors] = useState({});
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'ชื่อของงานจำเป็นต้องมี';
    if (!formData.category) newErrors.category = 'หมวดหมู่จำเป็นต้องมี';
    if (!formData.schedule?.startDate) newErrors.startDate = 'วันเริ่มต้นจำเป็นต้องมี';
    if (!formData.schedule?.endDate) newErrors.endDate = 'วันสิ้นสุดจำเป็นต้องมี';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  // Photo gallery handlers
  const photos = formData.images && formData.images.length > 0 
    ? formData.images 
    : (formData.coverImage ? [formData.coverImage] : []);
  
  const currentPhoto = photos[currentPhotoIndex];

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event?._id ? 'แก้ไขงาน' : 'สร้างงานใหม่'} maxWidth="2xl">
      {isSaving ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* SECTION 1: Basic Information */}
          <div className="border-b pb-4">
            <h4 className="text-sm font-bold text-emerald-600 mb-4 flex items-center gap-2">
              <span className="text-lg">📋</span> ข้อมูลพื้นฐาน
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ชื่อของงาน"
                placeholder="เช่น เทศกาลไหมและพาแลง"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
              />
              <Select
                label="หมวดหมู่"
                options={[
                  { value: '', label: 'เลือกหมวดหมู่' },
                  { value: 'concert', label: 'คอนเสิร์ต' },
                  { value: 'festival', label: 'เทศกาล' },
                  { value: 'exhibition', label: 'นิทรรศการ' },
                  { value: 'sport', label: 'กีฬา' },
                  { value: 'market', label: 'ตลาด' },
                  { value: 'workshop', label: 'การอบรม' },
                  { value: 'religious', label: 'ศาสนา' },
                  { value: 'food', label: 'อาหาร' },
                  { value: 'other', label: 'อื่นๆ' },
                ]}
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                error={errors.category}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows="3"
                placeholder="คำอธิบายเพิ่มเติมเกี่ยวกับงาน"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </div>

          {/* SECTION 2: Schedule & Status */}
          <div className="border-b pb-4">
            <h4 className="text-sm font-bold text-emerald-600 mb-4 flex items-center gap-2">
              <span className="text-lg">📅</span> ตารางเวลา & สถานะ
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                label="วันเริ่มต้น"
                type="datetime-local"
                value={formData.schedule?.startDate ? new Date(formData.schedule.startDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleNestedInputChange('schedule', 'startDate', new Date(e.target.value).toISOString())}
                error={errors.startDate}
              />
              <Input
                label="วันสิ้นสุด"
                type="datetime-local"
                value={formData.schedule?.endDate ? new Date(formData.schedule.endDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleNestedInputChange('schedule', 'endDate', new Date(e.target.value).toISOString())}
                error={errors.endDate}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="สถานะ"
                options={[
                  { value: 'upcoming', label: 'กำลังจะมาถึง' },
                  { value: 'ongoing', label: 'กำลังเกิดขึ้น' },
                  { value: 'completed', label: 'เสร็จสิ้น' },
                  { value: 'cancelled', label: 'ยกเลิก' },
                ]}
                value={formData.status || 'upcoming'}
                onChange={(e) => handleInputChange('status', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สิทธิ์การเผยแพร่</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handleNestedInputChange('metadata', 'isPublished', !formData.metadata?.isPublished)}>
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={formData.metadata?.isPublished || false}
                      onChange={() => {}}
                      className="rounded w-5 h-5 cursor-pointer"
                    />
                    <label htmlFor="isPublished" className="flex-1 cursor-pointer font-medium text-sm">
                      {formData.metadata?.isPublished ? '✓ เผยแพร่แล้ว' : 'ไม่เผยแพร่'}
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handleNestedInputChange('metadata', 'isFeatured', !formData.metadata?.isFeatured)}>
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.metadata?.isFeatured || false}
                      onChange={() => {}}
                      className="rounded w-5 h-5 cursor-pointer"
                    />
                    <label htmlFor="isFeatured" className="flex-1 cursor-pointer font-medium text-sm">
                      {formData.metadata?.isFeatured ? '⭐ ไฮไลท์' : '⭐ เลือกไฮไลท์'}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Admission & Media */}
          <div className="border-b pb-4">
            <h4 className="text-sm font-bold text-emerald-600 mb-4 flex items-center gap-2">
              <span className="text-lg">🎫</span> ค่าเข้า & รูปภาพ
            </h4>
            
            {/* Price Section */}
            <div className="mb-4 p-3 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={formData.admission?.isFree || false}
                  onChange={(e) => handleNestedInputChange('admission', 'isFree', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="isFree" className="font-medium">ว่างเข้าฟรี</label>
              </div>
              {!formData.admission?.isFree && (
                <Input
                  label="ราคา"
                  type="number"
                  placeholder="เช่น 300"
                  value={formData.admission?.tickets?.[0]?.price || ''}
                  onChange={(e) => {
                    const tickets = [{ type: 'บัตรทั่วไป', price: parseFloat(e.target.value), currency: 'THB', available: true }];
                    handleNestedInputChange('admission', 'tickets', tickets);
                  }}
                />
              )}
            </div>

            {/* Photo Gallery Card */}
            {photos.length > 0 && (
              <div className="mb-4 p-3 border rounded-lg bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-3">🖼️ แกลเลอรี่ภาพ</label>
                
                {/* Main Photo Display */}
                <div className="relative bg-gray-200 rounded-lg overflow-hidden h-64 mb-3">
                  <img
                    src={currentPhoto}
                    alt={`Photo ${currentPhotoIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                    }}
                  />

                  {/* Photo Counter */}
                  {photos.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm font-medium">
                      {currentPhotoIndex + 1} / {photos.length}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevPhoto}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full w-8 h-8 flex items-center justify-center transition-all text-lg font-bold"
                      >
                        ←
                      </button>
                      <button
                        onClick={handleNextPhoto}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full w-8 h-8 flex items-center justify-center transition-all text-lg font-bold"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {photos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentPhotoIndex
                            ? 'border-emerald-500'
                            : 'border-gray-300 hover:border-emerald-300'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Add/Edit Image URLs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🖼️ ลิงก์รูปภาพหลัก (Cover Image)</label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.coverImage || ''}
                onChange={(e) => handleInputChange('coverImage', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">รูปภาพหลักที่จะแสดงบนหน้าจอหลัก</p>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">📸 รูปภาพเพิ่มเติม (ลิงค์ URL คั่นด้วยจุลภาค)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                rows="2"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg, https://example.com/image3.jpg"
                value={formData.images?.join(', ') || ''}
                onChange={(e) => handleInputChange('images', e.target.value.split(',').map(url => url.trim()).filter(url => url))}
              />
              <p className="text-xs text-gray-500 mt-1">คุณสามารถเพิ่มหลายรูปและนำทางดูได้</p>
            </div>
          </div>

          {/* SECTION 4: Organizer */}
          <div className="border-b pb-4">
            <h4 className="text-sm font-bold text-emerald-600 mb-4 flex items-center gap-2">
              <span className="text-lg">👥</span> ผู้จัดงาน
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ชื่อผู้จัดงาน"
                placeholder="เช่น สำนักวัฒนท่องเที่ยว"
                value={formData.organizer?.name || ''}
                onChange={(e) => handleNestedInputChange('organizer', 'name', e.target.value)}
              />
              <Input
                label="เบอร์ติดต่อ"
                placeholder="เช่น 043-221-341"
                value={formData.organizer?.contactPhone || ''}
                onChange={(e) => handleNestedInputChange('organizer', 'contactPhone', e.target.value)}
              />
              <Input
                label="อีเมล"
                type="email"
                placeholder="info@example.com"
                value={formData.organizer?.contactEmail || ''}
                onChange={(e) => handleNestedInputChange('organizer', 'contactEmail', e.target.value)}
              />
              <Input
                label="เว็บไซต์"
                placeholder="https://example.com"
                value={formData.organizer?.website || ''}
                onChange={(e) => handleNestedInputChange('organizer', 'website', e.target.value)}
              />
            </div>
          </div>

          {/* SECTION 5: Additional Info */}
          <div className="pb-4">
            <h4 className="text-sm font-bold text-emerald-600 mb-4 flex items-center gap-2">
              <span className="text-lg">🏷️</span> ข้อมูลเพิ่มเติม
            </h4>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">เหมาะสำหรับ</label>
              <div className="grid grid-cols-2 gap-3">
                {['solo', 'couple', 'family', 'group'].map(type => (
                  <div key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={type}
                      checked={formData.suitableFor?.[type] || false}
                      onChange={(e) => handleNestedInputChange('suitableFor', type, e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor={type} className="text-sm">
                      {type === 'solo' ? 'สำหรับคนเดียว' : type === 'couple' ? 'คู่รัก' : type === 'family' ? 'ครอบครัว' : 'กลุ่ม'}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">แท็ก (คั่นด้วยจุลภาค)</label>
              <Input
                placeholder="เช่น annual, family, free-entry"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons - Fixed at Bottom */}
      <div className="flex gap-3 justify-end pt-4 mt-4 border-t sticky bottom-0 bg-white">
        <Button variant="outline" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {event?._id ? 'บันทึกการแก้ไข' : 'สร้างงาน'}
        </Button>
      </div>
    </Modal>
  );
}

export default EventDetailModal;
