export default function DestinationSearch({
  accommodationName = "",
  mustGo = [],
  onAccommodationChange = () => {},
  onMustGoChange = () => {},
  onMustGoAdd = () => {},
}) {
  const handleAddPlace = () => {
    onMustGoAdd();
  };

  const handleRemovePlace = (index) => {
    onMustGoChange(mustGo.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 space-y-4">
      <h2 className="font-semibold text-lg sm:text-xl text-gray-800 mb-3">ที่พักและสถานที่ที่ต้องไป</h2>

      {/* Accommodation Input */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm text-gray-600 font-medium block">ที่พัก (โรงแรม)</label>
        <input
          placeholder="เช่น โรงแรมพูลแมน ขอนแก่น ราชา ออคิด"
          type="text"
          value={accommodationName}
          onChange={(e) => onAccommodationChange(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-xl px-4 sm:px-5 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Must-Go Places */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm text-gray-600 font-medium block">
          สถานที่ที่ต้องไป ({mustGo.length}/{5})
        </label>
        <div className="space-y-2 mb-3">
          {mustGo.map((place, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={place}
                onChange={(e) => {
                  const newMustGo = [...mustGo];
                  newMustGo[index] = e.target.value;
                  onMustGoChange(newMustGo);
                }}
                placeholder={`สถานที่ที่ ${index + 1}`}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={() => handleRemovePlace(index)}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {mustGo.length < 5 && (
          <button
            onClick={handleAddPlace}
            className="w-full border-2 border-dashed border-green-300 hover:border-green-500 row-rounded-xl py-2 text-sm text-green-700 font-medium hover:bg-green-50 transition-all"
          >
            + เพิ่มสถานที่ที่ต้องไป
          </button>
        )}
      </div>
    </div>
  );
}
