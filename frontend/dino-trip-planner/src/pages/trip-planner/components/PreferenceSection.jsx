const preferences = [
  "ธรรมชาติ",
  "คาเฟ่",
  "ช้อปปิ้ง",
  "วัด",
  "พิพิธภัณฑ์",
  "อาหารพื้นเมือง",
  "ตลาดกลางคืน",
  "อาหารอีสาน",
];

export default function PreferenceSection() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
      <h2 className="font-semibold text-lg sm:text-xl text-gray-800 mb-4">ความสนใจของคุณ</h2>

      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {preferences.map((item) => (
          <button
            key={item}
            className="border-2 border-gray-300 rounded-full px-4 sm:px-5 py-2 text-sm sm:text-base hover:bg-green-700 hover:text-white hover:border-green-500 transition-all duration-200 active:scale-95 font-medium"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
