import { useEffect, useState } from "react";
import PlaceCard from '../components/PlaceCard';

function HomePage() {
  const [places, setPlaces] = useState([]);
  const [loading , setLoading] = useState(true);

  useEffect(()=> {
    fetch("http://localhost:3000/api/places/")
    .then((res) => res.json())
    .then(data => {
      setPlaces(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch places:", err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-page">
      <h1 className="text-xl font-bold mb-2">
        ยินดีต้อนรับสู่นครขอนแก่น
      </h1>

      <p>เว็บไซต์ทางการสำหรับนักท่องเที่ยว</p>
      <p>วางแผนการเดินทางของคุณกับเรา</p>

      {/* 🔥 Cards จาก backend */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {places.map(place => (
          <PlaceCard key={place._id} place={place} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
