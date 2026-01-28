import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom"; // ถอด comment ออก
import { useEffect } from "react"; // เพิ่ม useEffect
import { get_one_place } from "../api/get-one-place"; // เพิ่ม import ฟังก์ชัน API
// Mock data

function PlaceDetailPage() {
  const { id } = useParams(); // ถอด comment ออก - ดึง placeId จาก URL
  const [place, setPlace] = useState(null); // เปลี่ยนจาก mockPlaceData เป็น state
  const [loading, setLoading] = useState(true); // สำหรับแสดง loading state
  const [error, setError] = useState(null); // สำหรับจัดการ error
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate(); // 👈 ต้องมีบรรทัดนี้
  // API call to fetch place data
  useEffect(() => {
    const fetchPlaceData = async () => {
      try{
        setLoading(true);
        setError(null);
        const response = await get_one_place(id);
       setPlace(response.data.data);
      }catch(err){
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลสถานที่");
      }finally{
        setLoading(false);
      }

    }
      if(id){
        fetchPlaceData  ();
      }
  },[id]);

    // แสดง loading spinner
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      );
    }
  // แสดง error message
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            กลับ
          </button>
        </div>
      </div>
    );
  }
  // ถ้าไม่มีข้อมูล
  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">ไม่พบข้อมูลสถานที่</p>
      </div>
    );
  }
  const { core, address, media, reviews } = place;
  const photos = media?.photos ?? [];

  const getPhotoUrl = (name) =>
    `http://localhost:3000/api/google/photo?name=${name}&maxWidth=1200`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">⯨</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Image Background */}
      <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
        {/* Background Image */}
        {photos.length > 0 && (
          <img
            src={getPhotoUrl(photos[selectedImage].name)}
            alt={core.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        
        {/* Back Button - Floating on image */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-gray-200 font-medium transition-colors bg-black/30 hover:bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              <span className="text-xl">←</span>
              กลับ
            </button>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            {/* Header Content */}
            <div className="max-w-4xl">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {core.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-2xl">
                  {renderStars(core.rating)}
                </div>
                <span className="text-2xl font-bold text-white drop-shadow">{core.rating}</span>
                <span className="text-lg text-white/90 drop-shadow">({core.userRatingCount} รีวิว)</span>
              </div>

              {/* Types */}
              <div className="flex flex-wrap gap-2 mb-4">
                {core.types.slice(0, 3).map((type, index) => (
                  <span
                    key={index}
                    className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-full text-sm sm:text-base font-medium"
                  >
                    {type.replaceAll("_", " ")}
                  </span>
                ))}
              </div>

              {/* Address */}
              <div className="flex gap-3 text-white/95 mb-4 text-base sm:text-lg">
                <span className="text-2xl">📍</span>
                <p className="leading-relaxed drop-shadow">{address.formatted}</p>
              </div>

              {/* Business Status */}
              <div className="inline-flex items-center gap-2 bg-green-500/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full font-semibold text-base shadow-lg">
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
                {core.businessStatus === "OPERATIONAL" ? "เปิดให้บริการ" : "ปิดให้บริการ"}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows for Images */}
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage((selectedImage - 1 + photos.length) % photos.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedImage((selectedImage + 1) % photos.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              →
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 z-20 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
          {selectedImage + 1} / {photos.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {photos.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {photos.slice(0, 10).map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-green-500 ring-2 ring-green-200 scale-105" : "border-gray-300 hover:border-green-300"
                  }`}
                >
                  <img
                    src={getPhotoUrl(photo.name)}
                    alt={`${core.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              {photos.length > 10 && (
                <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                  +{photos.length - 10}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">รีวิวจากผู้เยี่ยมชม</h2>
              
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.authorName}</p>
                          <p className="text-sm text-gray-500">{formatDate(review.publishTime)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 ml-13 pl-0 sm:ml-13">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Map Preview */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">ตำแหน่งที่ตั้ง</h3>
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${core.location.lat},${core.location.lng}`}
                  allowFullScreen
                  title="Map"
                ></iframe>
              </div>
              <p className="text-sm text-gray-600">
                <strong>พิกัด:</strong> {core.location.lat.toFixed(6)}, {core.location.lng.toFixed(6)}
              </p>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">เวลาทำการ</h3>
              {place.openingHours ? (
                <div className="space-y-2">
                  {/* แสดงเวลาทำการ */}
                </div>
              ) : (
                <p className="text-gray-500">ไม่มีข้อมูลเวลาทำการ</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">ดำเนินการ</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all">
                  เพิ่มในแผนการเดินทาง
                </button>
                <button className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-xl transition-all">
                  แชร์สถานที่นี้
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceDetailPage;
