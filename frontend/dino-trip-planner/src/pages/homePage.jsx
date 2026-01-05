import PlaceCard from '../components/PlaceCard';

function HomePage() {
  return (
    <div className="home-page">
      <h1 className="text-xl font-bold mb-2">
        ยินดีต้อนรับสู่นครขอนแก่น
      </h1>

      <p>เว็บไซต์ทางการสำหรับนักท่องเที่ยว</p>
      <p>วางแผนการเดินทางของคุณกับเรา</p>

      {/* 🔥 Card */}
      <div className="mt-6 flex justify-center ">
        <PlaceCard />
      </div>
      
    </div>
  );
}

export default HomePage;
