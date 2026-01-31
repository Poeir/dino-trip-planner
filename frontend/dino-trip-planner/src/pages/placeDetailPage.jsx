import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom"; // ถอด comment ออก
import { useEffect } from "react"; // เพิ่ม useEffect
import { get_one_place } from "../api/get-one-place"; // เพิ่ม import ฟังก์ชัน API
import MapPreview from "../components/MapPreview";
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
  const { core, address, media, reviews, contact, features, extra, maps, openingHours: hours, ev } = place;
  const photos = media?.photos ?? [];
  const getMapUrl = (lat, lng) =>
    'http://localhost:3000/api/google/map?lat=' + lat + '&long=' + lng;

    const getPhotoUrl = (name) =>
    `http://localhost:3000/api/google/photo?name=${name}&maxWidth=800`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatPrice = (priceRange) => {
    if (!priceRange?.start || !priceRange?.end) return null;
    return `${priceRange.start.units || 0} - ${priceRange.end.units || 0} ${priceRange.start.currencyCode || 'THB'}`;
  };

  const getPriceLevelText = (level) => {
    const levels = {
      1: '฿ - ราคาถูก',
      2: '฿฿ - ราคาปานกลาง',
      3: '฿฿฿ - ราคาแพง',
      4: '฿฿฿฿ - ราคาแพงมาก'
    };
    return levels[level] || null;
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

            {/* Summary Section */}
            {(extra?.editorialSummary || extra?.generativeSummary || extra?.neighborhoodSummary) && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">เกี่ยวกับสถานที่นี้</h2>
                {extra?.editorialSummary && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">สรุป</h3>
                    <p className="text-gray-700 leading-relaxed">{extra.editorialSummary}</p>
                  </div>
                )}
                {extra?.generativeSummary && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">ข้อมูลเพิ่มเติม</h3>
                    <p className="text-gray-700 leading-relaxed">{extra.generativeSummary}</p>
                  </div>
                )}
                {extra?.neighborhoodSummary && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">ข้อมูลย่าน</h3>
                    <p className="text-gray-700 leading-relaxed">{extra.neighborhoodSummary}</p>
                  </div>
                )}
              </div>
            )}

            {/* Price Range */}
            {(core?.priceLevel || extra?.priceRange) && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">ช่วงราคา</h2>
                <div className="space-y-2">
                  {core?.priceLevel && (
                    <p className="text-gray-700 text-lg">
                      <span className="font-semibold">ระดับ:</span> {getPriceLevelText(core.priceLevel)}
                    </p>
                  )}
                  {extra?.priceRange && formatPrice(extra.priceRange) && (
                    <p className="text-gray-700 text-lg">
                      <span className="font-semibold">ราคาโดยประมาณ:</span> {formatPrice(extra.priceRange)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Features Section */}
            {features && Object.keys(features).length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">สิ่งอำนวยความสะดวก</h2>
                
                {/* Service Type */}
                {(features.takeout !== undefined || features.delivery !== undefined || features.dineIn !== undefined || features.curbsidePickup !== undefined || features.reservable !== undefined) && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">บริการ</h3>
                    <div className="flex flex-wrap gap-2">
                      {features.takeout !== undefined && (
                        <span className={features.takeout ? "bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🥡 สั่งกลับบ้าน
                        </span>
                      )}
                      {features.delivery !== undefined && (
                        <span className={features.delivery ? "bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🚚 จัดส่ง
                        </span>
                      )}
                      {features.dineIn !== undefined && (
                        <span className={features.dineIn ? "bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🍽️ ทานที่ร้าน
                        </span>
                      )}
                      {features.curbsidePickup !== undefined && (
                        <span className={features.curbsidePickup ? "bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🚗 รับหน้าร้าน
                        </span>
                      )}
                      {features.reservable !== undefined && (
                        <span className={features.reservable ? "bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          📅 จองได้
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Food & Drink */}
                {(features.servesBreakfast !== undefined || features.servesLunch !== undefined || features.servesDinner !== undefined || features.servesBrunch !== undefined || 
                  features.servesBeer !== undefined || features.servesWine !== undefined || features.servesCocktails !== undefined || features.servesDessert !== undefined || 
                  features.servesCoffee !== undefined || features.servesVegetarianFood !== undefined) && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">อาหารและเครื่องดื่ม</h3>
                    <div className="flex flex-wrap gap-2">
                      {features.servesBreakfast !== undefined && (
                        <span className={features.servesBreakfast ? "bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🌅 อาหารเช้า
                        </span>
                      )}
                      {features.servesLunch !== undefined && (
                        <span className={features.servesLunch ? "bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          ☀️ อาหารกลางวัน
                        </span>
                      )}
                      {features.servesDinner !== undefined && (
                        <span className={features.servesDinner ? "bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🌙 อาหารเย็น
                        </span>
                      )}
                      {features.servesBrunch !== undefined && (
                        <span className={features.servesBrunch ? "bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🥞 บรันช์
                        </span>
                      )}
                      {features.servesBeer !== undefined && (
                        <span className={features.servesBeer ? "bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🍺 เบียร์
                        </span>
                      )}
                      {features.servesWine !== undefined && (
                        <span className={features.servesWine ? "bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🍷 ไวน์
                        </span>
                      )}
                      {features.servesCocktails !== undefined && (
                        <span className={features.servesCocktails ? "bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🍹 ค็อกเทล
                        </span>
                      )}
                      {features.servesDessert !== undefined && (
                        <span className={features.servesDessert ? "bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🍰 ขนม
                        </span>
                      )}
                      {features.servesCoffee !== undefined && (
                        <span className={features.servesCoffee ? "bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          ☕ กาแฟ
                        </span>
                      )}
                      {features.servesVegetarianFood !== undefined && (
                        <span className={features.servesVegetarianFood ? "bg-lime-100 text-lime-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🥗 อาหารเจ
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {(features.outdoorSeating !== undefined || features.liveMusic !== undefined || features.menuForChildren !== undefined || features.goodForChildren !== undefined || 
                  features.goodForGroups !== undefined || features.goodForWatchingSports !== undefined || features.allowsDogs !== undefined || features.restroom !== undefined) && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">สิ่งอำนวยความสะดวกอื่นๆ</h3>
                    <div className="flex flex-wrap gap-2">
                      {features.outdoorSeating !== undefined && (
                        <span className={features.outdoorSeating ? "bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🪴 ที่นั่งกลางแจ้ง
                        </span>
                      )}
                      {features.liveMusic !== undefined && (
                        <span className={features.liveMusic ? "bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🎵 ดนตรีสด
                        </span>
                      )}
                      {features.menuForChildren !== undefined && (
                        <span className={features.menuForChildren ? "bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🧒 เมนูเด็ก
                        </span>
                      )}
                      {features.goodForChildren !== undefined && (
                        <span className={features.goodForChildren ? "bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          👶 เหมาะสำหรับเด็ก
                        </span>
                      )}
                      {features.goodForGroups !== undefined && (
                        <span className={features.goodForGroups ? "bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          👥 เหมาะสำหรับกลุ่ม
                        </span>
                      )}
                      {features.goodForWatchingSports !== undefined && (
                        <span className={features.goodForWatchingSports ? "bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          ⚽ ดูกีฬา
                        </span>
                      )}
                      {features.allowsDogs !== undefined && (
                        <span className={features.allowsDogs ? "bg-brown-100 text-brown-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🐕 พาสุนัขได้
                        </span>
                      )}
                      {features.restroom !== undefined && (
                        <span className={features.restroom ? "bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium" : "bg-gray-200 text-gray-400 px-4 py-2 rounded-full text-sm font-medium line-through opacity-60"}>
                          🚻 ห้องน้ำ
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Section */}
            {reviews && reviews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">รีวิวจากผู้เยี่ยมชม</h2>
                
                {/* Review Summary */}
                {extra?.reviewSummary && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-gray-700 leading-relaxed">{extra.reviewSummary}</p>
                  </div>
                )}

                <div className="space-y-4 mb-6">
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

                {/* Review Actions */}
                {maps?.googleMapsLinks && (maps.googleMapsLinks.reviewsUri || maps.googleMapsLinks.writeAReviewUri) && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    {maps.googleMapsLinks.reviewsUri && (
                      <a 
                        href={maps.googleMapsLinks.reviewsUri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-3 rounded-lg transition-colors font-medium"
                      >
                        <span className="text-xl">⭐</span>
                        <span>ดูรีวิวทั้งหมด</span>
                      </a>
                    )}
                    {maps.googleMapsLinks.writeAReviewUri && (
                      <a 
                        href={maps.googleMapsLinks.writeAReviewUri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg transition-colors font-medium"
                      >
                        <span className="text-xl">✍️</span>
                        <span>เขียนรีวิว</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Contact Info */}
            {(contact?.phone || contact?.website || maps?.googleMapsUri) && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">ข้อมูลติดต่อ</h3>
                <div className="space-y-3">
                  {contact?.phone && (
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors">
                      <span className="text-xl">📞</span>
                      <span>{contact.phone}</span>
                    </a>
                  )}
                  {contact?.website && (
                    <a href={contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors break-all">
                      <span className="text-xl">🌐</span>
                      <span className="truncate">{contact.website}</span>
                    </a>
                  )}
                  {maps?.googleMapsUri && (
                    <a href={maps.googleMapsUri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors">
                      <span className="text-xl">🗺️</span>
                      <span>เปิดใน Google Maps</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Map Preview */}
            <MapPreview
                lat={core?.location?.lat}
                lng={core?.location?.lng}
              />

            {/* Map Actions */}
            {maps?.googleMapsLinks && (maps.googleMapsLinks.directionsUri || maps.googleMapsLinks.placeUri) && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="space-y-2">
                  {maps.googleMapsLinks.directionsUri && (
                    <a 
                      href={maps.googleMapsLinks.directionsUri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg transition-colors"
                    >
                      <span className="text-xl">🧭</span>
                      <span className="font-medium">เส้นทางการเดินทาง</span>
                    </a>
                  )}
                  {maps.googleMapsLinks.placeUri && (
                    <a 
                      href={maps.googleMapsLinks.placeUri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg transition-colors"
                    >
                      <span className="text-xl">📍</span>
                      <span className="font-medium">ดูสถานที่ใน Maps</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Opening Hours */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">เวลาทำการ</h3>

              {hours ? (
                <div className="space-y-3">
                  {hours.openNow !== undefined && (
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${hours.openNow ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: hours.openNow ? '#10b981' : '#ef4444' }}></span>
                      {hours.openNow ? 'เปิดอยู่ตอนนี้' : 'ปิดอยู่ตอนนี้'}
                    </div>
                  )}
                  
                  {hours.weekdayDescriptions && hours.weekdayDescriptions.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {hours.weekdayDescriptions.map((day, index) => (
                        <p key={index} className="text-gray-700 text-sm">
                          {day}
                        </p>
                      ))}
                    </div>
                  )}

                  {hours.nextOpenTime && (
                    <p className="text-sm text-gray-600 mt-3">
                      <span className="font-semibold">เปิดถัดไป:</span> {formatDate(hours.nextOpenTime)}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">ไม่มีข้อมูลเวลาทำการ</p>
              )}
            </div>

            {/* Payment Options */}
            {extra?.paymentOptions && Object.keys(extra.paymentOptions).length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">วิธีการชำระเงิน</h3>
                <div className="space-y-2">
                  {extra.paymentOptions.acceptsCreditCards && <p className="flex items-center gap-2 text-gray-700"><span>💳</span> รับบัตรเครดิต</p>}
                  {extra.paymentOptions.acceptsDebitCards && <p className="flex items-center gap-2 text-gray-700"><span>💳</span> รับบัตรเดบิต</p>}
                  {extra.paymentOptions.acceptsCashOnly && <p className="flex items-center gap-2 text-gray-700"><span>💵</span> เงินสดเท่านั้น</p>}
                  {extra.paymentOptions.acceptsNfc && <p className="flex items-center gap-2 text-gray-700"><span>📱</span> รับชำระผ่าน NFC</p>}
                </div>
              </div>
            )}

            {/* Parking Options */}
            {extra?.parkingOptions && Object.keys(extra.parkingOptions).length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">ที่จอดรถ</h3>
                <div className="space-y-2">
                  {extra.parkingOptions.freeParking && <p className="flex items-center gap-2 text-gray-700"><span>🅿️</span> ที่จอดรถฟรี</p>}
                  {extra.parkingOptions.paidParking && <p className="flex items-center gap-2 text-gray-700"><span>🅿️</span> ที่จอดรถแบบเสียค่าบริการ</p>}
                  {extra.parkingOptions.freeStreetParking && <p className="flex items-center gap-2 text-gray-700"><span>🚗</span> จอดริมถนนฟรี</p>}
                  {extra.parkingOptions.paidStreetParking && <p className="flex items-center gap-2 text-gray-700"><span>🚗</span> จอดริมถนนแบบเสียค่าบริการ</p>}
                  {extra.parkingOptions.valetParking && <p className="flex items-center gap-2 text-gray-700"><span>🎩</span> บริการรับจอดรถ</p>}
                  {extra.parkingOptions.freeParkingLot && <p className="flex items-center gap-2 text-gray-700"><span>🅿️</span> ลานจอดรถฟรี</p>}
                  {extra.parkingOptions.paidParkingLot && <p className="flex items-center gap-2 text-gray-700"><span>🅿️</span> ลานจอดรถแบบเสียค่าบริการ</p>}
                </div>
              </div>
            )}

            {/* Accessibility Options */}
            {extra?.accessibilityOptions && Object.keys(extra.accessibilityOptions).length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">การเข้าถึงสำหรับผู้พิการ</h3>
                <div className="space-y-2">
                  {extra.accessibilityOptions.wheelchairAccessibleEntrance && <p className="flex items-center gap-2 text-gray-700"><span>♿</span> ทางเข้าสำหรับรถเข็น</p>}
                  {extra.accessibilityOptions.wheelchairAccessibleParking && <p className="flex items-center gap-2 text-gray-700"><span>♿</span> ที่จอดรถสำหรับผู้พิการ</p>}
                  {extra.accessibilityOptions.wheelchairAccessibleRestroom && <p className="flex items-center gap-2 text-gray-700"><span>♿</span> ห้องน้ำสำหรับผู้พิการ</p>}
                  {extra.accessibilityOptions.wheelchairAccessibleSeating && <p className="flex items-center gap-2 text-gray-700"><span>♿</span> ที่นั่งสำหรับรถเข็น</p>}
                </div>
              </div>
            )}

            {/* EV Charging */}
            {ev?.evChargeOptions && Object.keys(ev.evChargeOptions).length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">สถานีชาร์จรถยนต์ไฟฟ้า</h3>
                <div className="space-y-2">
                  {ev.evChargeAmenitySummary && (
                    <p className="text-gray-700 mb-3">{ev.evChargeAmenitySummary}</p>
                  )}
                  {ev.evChargeOptions.connectorCount && (
                    <p className="text-gray-700">
                      <span className="font-semibold">จำนวนหัวชาร์จ:</span> {ev.evChargeOptions.connectorCount}
                    </p>
                  )}
                </div>
              </div>
            )}

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
