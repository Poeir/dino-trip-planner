import { useEffect, useState } from "react";
import PlaceCard from "../components/PlaceCard";
import heroImage from "../assets/pic1.jpg";

function HomePage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/places/")
      .then(res => res.json())
      .then(data => {
        setPlaces(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-6
          ">
            {places.map(place => (
              <PlaceCard key={place.google_place_id} place={place} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
