import heroImage from "../../../assets/pic1.jpg";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-green-700 to-green-600 text-white py-16 sm:py-20 md:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      <div className="relative z-10 text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Trip Planning 🧳</h1>
        <p className="text-sm sm:text-base opacity-90">ระบบวางแผนท่องเที่ยว</p>
      </div>
    </section>
  );
}
