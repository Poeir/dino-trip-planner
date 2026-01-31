import { useEffect, useState } from "react";
import PlaceCard from "../components/PlaceCard";
import heroImage from "../assets/pic1.jpg";

function HomePage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [availableTypes, setAvailableTypes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/places/")
      .then(res => res.json())
      .then(data => {
        setPlaces(data);
        
        // Extract unique types from places
        const types = [...new Set(data.map(place => place.core.primaryType))];
        setAvailableTypes(types.sort());
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter places based on search and type
  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.core.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || place.core.primaryType === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <>
      {/* ================= HERO (เต็มจอ ดูอลังการบนคอม) ================= */}
      <section className="relative bg-gradient-to-b from-green-700 to-green-600 text-white pt-16 pb-24 overflow-hidden">
  
  {/* 🔹 Background Image (จาง ๆ) */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-20"
    style={{
      backgroundImage: `url(${heroImage})`,
    }}
  />

  {/* 🔹 Content */}
  <div className="relative z-10 content-wrapper">
    <h1 className="text-3xl md:text-4xl font-bold mb-3">
      ยินดีต้อนรับสู่นครขอนแก่น
    </h1>

    <p className="text-sm opacity-90">
      เว็บไซต์ทางการสำหรับนักท่องเที่ยว
    </p>
    <p className="text-sm opacity-90 mb-6">
      วางแผนการเดินทางของคุณกับเรา
    </p>

    {/* Search */}
    <div className="flex bg-white rounded-full overflow-hidden shadow-lg max-w-xl">
      <input
        className="flex-1 px-4 py-3 text-gray-700 outline-none"
        placeholder="ค้นหาสถานที่..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="px-6 text-green-600 font-bold">
        🔍
      </button>
    </div>
  </div>
</section>

      {/* ================= CONTENT ================= */}
      <section className="-mt-16 pb-16">
        <div className="content-wrapper">
          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🔍 กรองตามประเภท</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === "all"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ทั้งหมด ({places.length})
              </button>
              {availableTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedType === type
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type.replaceAll("_", " ")} ({places.filter(p => p.core.primaryType === type).length})
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-gray-600">
            แสดง {filteredPlaces.length} จาก {places.length} สถานที่
            {searchQuery && ` สำหรับ "${searchQuery}"`}
          </div>

          {/* Places Grid */}
          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-6
          ">
            {filteredPlaces.length > 0 ? (
              filteredPlaces.map(place => (
                <PlaceCard key={place.google_place_id} place={place} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                ไม่พบสถานที่ที่ค้นหา
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
