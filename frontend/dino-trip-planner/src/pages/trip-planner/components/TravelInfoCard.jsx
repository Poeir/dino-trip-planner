export default function TravelInfoCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 space-y-5">
      <h2 className="font-semibold text-lg sm:text-xl text-gray-800">ข้อมูลการเดินทาง</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="วันเริ่มต้นการเดินทาง" value="วันนี้" />
        <Input label="วันสิ้นสุดการเดินทาง" value="วันพรุ่งนี้" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <OptionCard title="ชิลล์ๆ" subtitle="2-3 ที่ต่อวัน" />
        <OptionCard title="เดินทางเต็มที่" subtitle="4-5 ที่ต่อวัน" />
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs sm:text-sm text-gray-600 font-medium block">{label}</label>
      <input
        className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all"
        {...props}
      />
    </div>
  );
}

function OptionCard({ title, subtitle }) {
  return (
    <div className="border-2 border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-200 active:scale-95">
      <p className="font-semibold text-sm sm:text-base text-gray-800">{title}</p>
      <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
