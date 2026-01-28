export default function DestinationSearch() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
      <h2 className="font-semibold text-lg sm:text-xl text-gray-800 mb-3">สถานที่ที่ต้องไป</h2>
      <input
        placeholder="🔍 ค้นหา ที่เที่ยว คาเฟ่ โรงแรม"
        className="w-full border-2 border-gray-300 rounded-xl px-4 sm:px-5 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
      />
    </div>
  );
}
