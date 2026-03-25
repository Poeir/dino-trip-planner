import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function TripResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedDate, setExpandedDate] = useState(null);

  // Get itinerary from location state
  const apiResponse = location.state?.itinerary;

  if (!apiResponse) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">ไม่พบข้อมูลแผนการท่องเที่ยว</p>
          <button
            onClick={() => navigate("/trip-planner")}
            className="bg-green-700 hover:bg-green-600 text-white rounded-xl py-3 px-6 font-semibold transition-all"
          >
            กลับไปสร้างแผนการท่องเที่ยว
          </button>
        </div>
      </div>
    );
  }

  const toggleDateExpand = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const handleExportMap = () => {
    console.log("Export to Google Maps:", apiResponse);
    alert("การส่งออกไปยัง Google Maps กำลังได้รับการพัฒนา");
  };

  const handleSaveTrip = () => {
    console.log("Save trip:", apiResponse);
    alert("การบันทึกทริปกำลังได้รับการพัฒนา");
  };

  // Extract summary data
  const summary = apiResponse.summary || {};
  const totalPlaces = summary.total_places || 0;
  const totalDistance = Math.round(apiResponse.total_distance_km || 0);
  const totalCost = Math.round(apiResponse.total_cost_estimate || 0);
  const days = apiResponse.itinerary || [];

  // Get date range from the itinerary
  const startDate = days.length > 0 ? days[0].date : "N/A";
  const endDate = days.length > 0 ? days[days.length - 1].date : "N/A";

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
                  {startDate} – {endDate}
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
                  {totalPlaces}
                </p>
                <p className="text-gray-600 text-sm font-medium">สถานที่</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-lg">
                <p className="text-3xl font-bold text-green-700">
                  {totalDistance}
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
            {days.map((day, dayIndex) => (
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

                {/* Schedule Items */}
                <div
                  className={`space-y-6 overflow-hidden transition-all duration-300 ${
                    expandedDate === day.date ? "" : "hidden"
                  }`}
                >
                  {day.schedule.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-4">
                      {/* Time Label */}
                      <div className="flex-shrink-0 w-24">
                        <p className="text-sm font-semibold text-gray-500 text-center">
                          {item.arrival_time}
                        </p>
                        {item.status !== "End of Day (Return to Hotel)" && (
                          <p className="text-xs text-gray-400 text-center mt-1">
                            ↓ {item.travel_time_min}นาที
                          </p>
                        )}
                      </div>

                      {/* Place Card */}
                      <div className="flex-1 pb-6">
                        <button
                          onClick={() => console.log("Place clicked:", item.place)}
                          className="w-full text-left bg-white border-2 border-green-100 hover:border-green-400 hover:shadow-md rounded-2xl px-5 py-4 transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800 group-hover:text-green-700 text-lg">
                                {item.place.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                ⭐ {item.place.rating} ({item.place.user_ratings_total} รีวิว)
                              </p>
                              <p className="text-sm text-gray-600 mt-2">{item.place.formatted_address}</p>
                              <p className="text-xs text-orange-600 font-medium mt-2">
                                🚗 {item.distance_km} กม. • ⏱️ {item.travel_time_min} นาที
                              </p>
                            </div>
                            <span className="text-gray-400 group-hover:text-green-600 text-xl ml-2">
                              →
                            </span>
                          </div>
                        </button>

                        {/* Duration in place */}
                        {item.status !== "End of Day (Return to Hotel)" && (
                          <p className="text-xs text-gray-500 mt-2 ml-2">
                            ⏱️ อยู่ที่นี่: {Math.round((new Date(item.departure_time) - new Date(item.arrival_time)) / 60000)} นาที
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Day Summary */}
                  <div className="bg-green-50 rounded-lg p-4 mt-6">
                    <p className="text-sm text-gray-600">
                      ค่าใช้จ่ายประมาณวันนี้: <span className="font-bold text-green-700">฿{Math.round(day.day_cost_estimate).toLocaleString()}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      เวลาเดินทาง: <span className="font-bold text-green-700">{day.day_travel_time_total} นาที</span>
                    </p>
                  </div>
                </div>

                {/* Date Divider */}
                {dayIndex < days.length - 1 && (
                  <div className="mt-8 mb-8 border-t-2 border-gray-200" />
                )}
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📊 สรุปทั้งทริป</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">ระยะทางทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-700">{totalDistance} กม.</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">ค่าใช้จ่ายรวม</p>
                <p className="text-2xl font-bold text-orange-700">฿{Math.round(totalCost).toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">สถานที่รวม</p>
                <p className="text-2xl font-bold text-purple-700">{totalPlaces}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🗺️ แสดงแผนที่การเดินทาง</h2>
          <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-center">
              <span className="block text-2xl mb-2">📍</span>
              <span>แผนที่อยู่ที่นี่ (Google Maps Integration)</span>
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

          {/* Back to Planner Button */}
          <button
            onClick={() => navigate("/trip-planner")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl py-4 font-semibold text-lg transition-all duration-200"
          >
            ← สร้างแผนการท่องเที่ยวใหม่
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripResultPage;
