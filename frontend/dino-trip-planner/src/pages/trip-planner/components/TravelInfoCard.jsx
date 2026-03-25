export default function TravelInfoCard({
  startDate = "",
  endDate = "",
  tripPace = "relaxed",
  onStartDateChange = () => {},
  onEndDateChange = () => {},
  onTripPaceChange = () => {},
}) {
  const pacingOptions = [
    { id: "relaxed", title: "ชิลล์ๆ", subtitle: "2-3 ที่ต่อวัน", pace: "relaxed" },
    { id: "active", title: "เดินทางเต็มที่", subtitle: "4-5 ที่ต่อวัน", pace: "active" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 space-y-5">
      <h2 className="font-semibold text-lg sm:text-xl text-gray-800">ข้อมูลการเดินทาง</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="วันเริ่มต้นการเดินทาง"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
        <Input
          label="วันสิ้นสุดการเดินทาง"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pacingOptions.map((option) => (
          <OptionCard
            key={option.id}
            title={option.title}
            subtitle={option.subtitle}
            isSelected={tripPace === option.pace}
            onClick={() => onTripPaceChange(option.pace)}
          />
        ))}
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

function OptionCard({ title, subtitle, isSelected = false, onClick = () => {} }) {
  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 active:scale-95 ${
        isSelected
          ? "border-green-700 bg-green-50"
          : "border-gray-300 hover:border-green-500 hover:bg-green-50"
      }`}
    >
      <p className="font-semibold text-sm sm:text-base text-gray-800">{title}</p>
      <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
