import { useState } from "react";
import { mockTripPlan } from "../../data/mockTripPlan";

function TripResultPage() {
  const [expandedDate, setExpandedDate] = useState(null);

  const toggleDateExpand = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const handleExportMap = () => {
    // TODO: Implement export to Google Maps
    console.log("Export to Google Maps");
  };

  const handleSaveTrip = () => {
    // TODO: Implement save trip functionality
    console.log("Save trip:", mockTripPlan);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Summary Card */}
      <div className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-800 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              🎉 ทริปของคุณพร้อมแล้ว!
            </h1>
            <p className="text-green-100 text-lg">วัจฉินการที่เหมาะเจาะสมเรียบร้อย</p>
          </div>

          {/* Trip Details */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <ul className="space-y-3 text-white font-medium text-lg mb-6">
              <li className="flex items-center gap-3">
                <span>📅</span>
                <span>
                  {mockTripPlan.startDate} – {mockTripPlan.endDate}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span>🗺️</span>
                <span>คลิกแต่ละสถานที่เพื่อดูที่ตั้งบนแผนที่</span>
              </li>
            </ul>

            {/* Stats Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-lg">
                <p className="text-3xl font-bold text-green-700">
                  {mockTripPlan.totalPlaces}
                </p>
                <p className="text-gray-600 text-sm font-medium">สถานที่</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-lg">
                <p className="text-3xl font-bold text-green-700">
                  {mockTripPlan.totalDistance}
                </p>
                <p className="text-gray-600 text-sm font-medium">กม.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Itinerary Timeline */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">📍 ตารางการเดินทาง</h2>

          <div className="space-y-8">
            {mockTripPlan.days.map((day, dayIndex) => (
              <div key={dayIndex}>
                {/* Date Header */}
                <button
                  onClick={() => toggleDateExpand(day.date)}
                  className="w-full flex items-center justify-between mb-4 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
                >
                  <h3 className="text-xl font-bold text-green-700">{day.date}</h3>
                  <span className="text-green-700 text-xl">
                    {expandedDate === day.date ? "▼" : "▶"}
                  </span>
                </button>

                {/* Time Slots */}
                <div
                  className={`space-y-6 overflow-hidden transition-all duration-300 ${
                    expandedDate === day.date ? "" : "hidden"
                  }`}
                >
                  {day.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex gap-4">
                      {/* Time Label */}
                      <div className="flex-shrink-0 w-16">
                        {slot.time && (
                          <p className="text-sm font-semibold text-gray-500 text-center">
                            {slot.time}
                          </p>
                        )}
                      </div>

                      {/* Place Cards Column */}
                      <div className="flex-1 space-y-3 pb-6">
                        {slot.places.map((place) => (
                          <button
                            key={place.id}
                            onClick={() => console.log("Place clicked:", place)}
                            className="w-full text-left bg-white border-2 border-green-100 hover:border-green-400 hover:shadow-md rounded-full px-5 py-3 transition-all duration-200 cursor-pointer group"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-800 group-hover:text-green-700">
                                  {place.name}
                                </p>
                                <p className="text-xs text-gray-500">{place.type}</p>
                              </div>
                              <span className="text-gray-400 group-hover:text-green-600">
                                →
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Date Divider */}
                {dayIndex < mockTripPlan.days.length - 1 && (
                  <div className="mt-8 mb-8 border-t-2 border-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Map Placeholder Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🗺️ แสดงแผนที่การเดินทาง</h2>
          <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-center">
              <span className="block text-2xl mb-2">📍</span>
              <span>แผนที่อยู่ที่นี่ (Google Maps)</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Export to Google Maps Button */}
          <button
            onClick={handleExportMap}
            className="w-full bg-green-700 hover:bg-green-600 text-white rounded-xl py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98"
          >
            ส่งออกไปยัง Google Map
          </button>

          {/* Save Trip Button */}
          <button
            onClick={handleSaveTrip}
            className="w-full bg-white border-2 border-green-700 hover:bg-green-50 text-green-700 rounded-xl py-4 font-semibold text-lg transition-all duration-200"
          >
            บันทึกทริปนี้
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripResultPage;
