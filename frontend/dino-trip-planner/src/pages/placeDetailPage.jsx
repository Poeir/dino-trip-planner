import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Mock data
const mockPlaceData = {
  core: {
    location: {
      lat: 16.4349499,
      lng: 102.80249049999999
    },
    name: "Bueng Nong Khot",
    primaryType: "state_park",
    types: [
      "state_park",
      "tourist_attraction",
      "park",
      "point_of_interest",
      "establishment"
    ],
    rating: 4.6,
    userRatingCount: 179,
    businessStatus: "OPERATIONAL"
  },
  address: {
    formatted: "00001 Tambon Ban Pet, Amphoe Mueang Khon Kaen, Chang Wat Khon Kaen 40000, Thailand"
  },
  openingHours: null,
  media: {
    photos: [
      {
        name: "places/ChIJ89dnBcVhIjERyDBrxGmmz_0/photos/AcnlKN2Cjvf-NKAvt6lbRmA9SDSI0Jo7lDGv7Sc6OM0ju00sjnrlm77PGU0LGHJEg082vnZvmSBffFSLwiSpuP8KCE7pje4KpZpJOVZQoR5q8osE36xucdO4_CsoLMlDV4vm_1aS893RxccOr8izrkIgrSqkh0q5ph9_V8ZjHvonm1mFBeh-3EvJywT7-6X6LMltJ7IZmKz61iWD-D0UoOpDeYXZQWKLT9M3gE-uHXlnnUOI0oeGVv8svwh2077m2szW5YmQRLdeMZhd5ng_-040ontpskJ-QoGb767Wpia1RSHp1uDy_OKfvT_ZMZ5WZyPn21lBIg-cI11L2Pl9vOfhP-0nXh9iEUEhiZrbqEfPpgrU6MUl9pKhkchTgneemP18ExMRqK6O7wJivtFuOoTiWssxjmHbDIfAJmKpP4wtApU",
        width: 4032,
        height: 3024
      },
      {
        name: "places/ChIJ89dnBcVhIjERyDBrxGmmz_0/photos/AcnlKN1ViuAzgTa3kLnYHJQvQLMw7J6X1frcyIUO9jmVOJ3_vuIUEGVN6mMWKuoeO2auuu0GsJMTUIxhuPeeJsM4aasqEdiwF7UTHp2QWBCX7YYuX5-64DUqEXmuJqhNXEpdQZjmrKeByYCVKdUGD96gcLqN_8kIT2RoGFpkvHiS8eyOzfPVWpdQbKhoIrWX0gbC6HHPUn5XKcVPxZeVPI7HUsHQ_IjSnW_gA_z1wRFct8M-DLcZ5_v1ecwjoUUMOm8MiBYXDLGd6WcfWprqcS0i97eOT9FtJZwpItiQwFYHkri4w5AT8fLNE7NPtJXmFhAmR-n2c9em92Cyfg2NqqopIVKVqb8NQ-YZ3F2eryz8ih2FVhG7UceoOXNlOmFe7k8w1TkNKtoWPrTpo7-G_ROrCkGmm-dqqRvayMsQs_6-uTo4dW8d",
        width: 4800,
        height: 3600
      },
      {
        name: "places/ChIJ89dnBcVhIjERyDBrxGmmz_0/photos/AcnlKN2GG2avfg6BGaVHUjvwiy8P8-4GsCQ2h3LM-1Adm6hIntEuIAuZ4uS7Fh_UDhDliZ3jIOQIXMxX5CJfKLh653D_uqIOFQDM9dikPL9m_y0x2Kn23gk-EkA7km_7ohfr80E-YN1xBnK78HzOPkLIf4zocevrkk3uOp3JDODNJq4-7pF5xkQiiuynUvaVpN3wcYJqfxGs88z2Pwzt4-4d5QGu9aFVAXBr2Uw2SjAuWBuSKEt9-eUDRZaoBplsjs9uqDQn7CQJV8z49AfJfggAUiIMlS5g8btIonQEAUTlXmGHlb3gBYRIvgvB7hXzLSag547cvA1Z9BoP9N-Jub98YPIy1sUejz9hFt5OxOJfFIvc_coma0KZfqMYqjyZ2qR6jxRK15lafWAwzj1Z9VnYepwliDn4i53ecrY6M6dgz1E",
        width: 3024,
        height: 4032
      },
      {
        name: "places/ChIJ89dnBcVhIjERyDBrxGmmz_0/photos/AcnlKN2Whfb95wtuGWOHgmBJlNj8_JPfq4LQc-RVPaSX87uC2N4Jziquq0uevaJU592raoTbZ1vakhEfx0PKVhKbyqH6XkHNHvJ8bpVoVg2-NQRWj2DTEWqEpJiuVWb2exfiQNdyFms57rV7LTSdFyVTKNUFY8RdiKQl7fded6J77EfkOO-gW72oy9zXsKejoTONXekW6fcqmcYJbTzzzUtTAzON8r6OqQi0rMl87PmKmOOB6jYFPv4wgwUokiFAacXcbJdGW2pp8DGnlRHPi5uWDv0x-dNFA_CBl8z7XCN3UDPuIZC4_wFQKQCpfD7nxT_a4PiyDW84Dp43FelgDcAQcAahcAx6WSS2H8QNT1WHmQfO_P0DF54H8G9Nq_1zk00iiMDUkAi2p-GOsdyRHLDYtgTaf0wXnSxWVp-ccVifDphi834GRi5XaeLbDRuLCRow",
        width: 1600,
        height: 1200
      }
    ]
  },
  reviews: [
    {
      authorName: "rodger ramjet",
      rating: 5,
      text: "Very Clean room and grounds, free coffee and tea, beautiful pool will stay again A+",
      publishTime: "2025-08-18T03:18:27.796Z"
    },
    {
      authorName: "Michelle",
      rating: 3,
      text: "Wow.... need to be maintenance. Diry smelly..",
      publishTime: "2025-07-02T08:23:55.025Z"
    },
    {
      authorName: "Tom Price",
      rating: 5,
      text: "A beautiful lake with an adjoined park and some long walking/cycling routes. There is exercise equipment here available to use too.",
      publishTime: "2024-08-20T17:46:33.790Z"
    },
    {
      authorName: "Andrasch Neunert",
      rating: 5,
      text: "A nice place, locals like to sit there to enjoy sunset views, having picknicks or watching fishermen. Romantic.",
      publishTime: "2024-10-31T12:03:43.401Z"
    },
    {
      authorName: "Laila x",
      rating: 5,
      text: "A good place in the community to chill and visit. Surrounded by street food markets.",
      publishTime: "2025-04-17T13:39:32.612Z"
    }
  ]
};

function PlaceDetailPage() {
//   const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  
  const place = mockPlaceData; // ใน production จะ fetch ด้วย id
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
