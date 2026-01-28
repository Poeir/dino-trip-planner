import PlaceCard from "../components/PlaceCard";
import heroImage from "../assets/pic1.jpg";

function AboutPage() {
  return (
    <>
      {/* ================= HERO (สั้น กระชับ) ================= */}
      <section className="relative bg-gradient-to-b from-green-700 to-green-600 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            About Khon Kaen
          </h1>
          <p className="text-base opacity-90">
            เมืองศูนย์กลางแห่งภาคอีสาน ที่ผสานการพัฒนาและอัตลักษณ์ท้องถิ่น
          </p>
        </div>
      </section>

      {/* ================= CONTENT SECTION ================= */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6 space-y-6">
          <h2 className="text-2xl font-bold text-green-700">
            ทำความรู้จักจังหวัดขอนแก่น
          </h2>

          <p className="text-gray-700 leading-relaxed">
            จังหวัดขอนแก่น เป็นหนึ่งในจังหวัดสำคัญของภาคตะวันออกเฉียงเหนือ
            ที่มีบทบาทโดดเด่นด้านเศรษฐกิจ การศึกษา และการคมนาคม
            ขอนแก่นไม่เพียงเป็นศูนย์กลางของภูมิภาค
            แต่ยังเป็นเมืองที่กำลังพัฒนาไปสู่ความเป็นเมืองนวัตกรรม
          </p>

          <p className="text-gray-700 leading-relaxed">
            การทำความรู้จักขอนแก่นจึงช่วยให้เราเข้าใจบทบาทของเมืองภูมิภาค
            ในการขับเคลื่อนประเทศ ควบคู่ไปกับการรักษาอัตลักษณ์
            และวิถีชีวิตท้องถิ่น
          </p>
        </div>
      </section>

      {/* ================= PLACES / GRID ================= */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">
            สถานที่น่าสนใจ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
