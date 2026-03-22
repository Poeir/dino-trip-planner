import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import TravelInfoCard from "./components/TravelInfoCard";
import PreferenceSection from "./components/PreferenceSection.jsx";
import BudgetSection from "./components/BudgetSection";
import DestinationSearch from "./components/DestinationSearch";

// Mock recommended places data
const mockPlaces = [
  {
    id: 1,
    name: "วัดหนองแวง",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=400&fit=crop",
    tags: ["วัด", "ธรรมชาติ"],
    distance: "500 เมตร",
  },
  {
    id: 2,
    name: "เมืองเก่าขอนแก่น",
    image: "https://images.unsplash.com/photo-1586225409604-9f7f67c57b24?w=400&h=400&fit=crop",
    tags: ["ประวัติศาสตร์", "วัฒนธรรม"],
    distance: "2 กม.",
  },
  {
    id: 3,
    name: "บ้านกาแฟ Baan Kaffe",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop",
    tags: ["คาเฟ่", "ติดแกรม"],
    distance: "1.5 กม.",
  },
  {
    id: 4,
    name: "ตลาดไก่ย่างขาวขอนแก่น",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561404?w=400&h=400&fit=crop",
    tags: ["อาหารพื้นเมือง", "บ้านท้องถิ่น"],
    distance: "3 กม.",
  },
  {
    id: 5,
    name: "สวนสัตว์ขอนแก่น",
    image: "https://images.unsplash.com/photo-1565143666747-69f6646db940?w=400&h=400&fit=crop",
    tags: ["ธรรมชาติ", "สัตว์"],
    distance: "8 กม.",
  },
];

// Mock interests from previous selection
const mockSelectedInterests = ["ธรรมชาติ", "คาเฟ่", "ติดแกรม"];

function TripPlannerPage() {
  const navigate = useNavigate();
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [autoRecommend, setAutoRecommend] = useState(false);

  const togglePlaceSelection = (placeId) => {
    setSelectedPlaces((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
    );
  };

  const handleNextClick = async () => {
    // Collect data from the form
    const formData = {
      travelInfo: {}, // Will be populated from TravelInfoCard
      preferences: mockSelectedInterests,
      budget: {}, // Will be populated from BudgetSection
      destination: {}, // Will be populated from DestinationSearch
    };

    console.log("Sending to AI for processing:", formData);

    // TODO: Send formData to AI endpoint
    // Example: POST /api/ai/recommend with formData
    // The AI will process preferences and return similar places

    // Once AI responds, show recommendations
    setShowRecommendations(true);

    // Scroll to recommendations section
    setTimeout(() => {
      document.getElementById("recommendations-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSubmitTrip = () => {
    // Collect all data including selected places
    const allData = {
      travelInfo: {},
      preferences: mockSelectedInterests,
      budget: {},
      destination: {},
      selectedPlaces: selectedPlaces,
      autoRecommend: autoRecommend,
    };

    console.log("Submitting complete trip data:", allData);

    // TODO: Send allData to create trip endpoint
    // Example: POST /api/trips/create with allData

    navigate("/trip-loading");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <HeroSection />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-8">
        <div className="space-y-6">
          {/* SECTION 1: FORM INPUTS */}
          {!showRecommendations && (
            <>
              <TravelInfoCard />
              <PreferenceSection />
              <BudgetSection />
              <DestinationSearch />

              {/* Next Button - Send to AI */}
              <div className="pt-4">
                <button
                  onClick={handleNextClick}
                  className="w-full bg-green-700 hover:bg-green-600 text-white rounded-xl py-3.5 sm:py-4 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98"
                >
                  ต่อไป → (ส่งให้ AI ประมวลผล)
                </button>
              </div>
            </>
          )}

          {/* SECTION 2: AI RECOMMENDATIONS */}
          {showRecommendations && (
            <>
              {/* Back Button */}
              <button
                onClick={() => setShowRecommendations(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-all duration-200 hover:shadow-lg"
              >
                <span>←</span>
                <span>ย้อนกลับ</span>
              </button>

              {/* Page Title Section */}
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">
                  Recommend <span className="text-2xl">🧳</span>
                </h1>
                <p className="text-gray-600 text-lg">สถานที่เที่ยวที่เหมาะกับคุณ</p>
              </div>

              {/* Interest Tags Card */}
              <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <p className="font-semibold text-gray-800 mb-4">จากความสนใจของคุณ</p>
                <div className="flex flex-wrap gap-3">
                  {mockSelectedInterests.map((interest) => (
                    <div
                      key={interest}
                      className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Places List Card */}
              <div className="bg-white rounded-2xl shadow-md p-6 mb-8" id="recommendations-section">
                <h2 className="font-semibold text-lg text-gray-800 mb-6">เราขอแนะนำสถานที่เหล่านี้</h2>

                <div className="space-y-4">
                  {mockPlaces.map((place) => (
                    <div
                      key={place.id}
                      className="flex gap-4 border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200"
                    >
                      {/* Thumbnail Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-bold text-gray-800 mb-2">{place.name}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {place.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-orange-600 text-sm font-medium">{place.distance}</p>
                        </div>
                      </div>

                      {/* Add to Plan Button */}
                      <div className="flex-shrink-0 flex items-center">
                        <button
                          onClick={() => togglePlaceSelection(place.id)}
                          className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                            selectedPlaces.includes(place.id)
                              ? "bg-green-700 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {selectedPlaces.includes(place.id) ? "✓ เพิ่มแล้ว" : "เพิ่มในแผน"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Auto Recommend Checkbox */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="autoRecommend"
                    checked={autoRecommend}
                    onChange={(e) => setAutoRecommend(e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer accent-green-700"
                  />
                  <label htmlFor="autoRecommend" className="text-gray-700 font-medium cursor-pointer">
                    ให้เราช่วยแนะนำให้เลย
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleSubmitTrip}
                  className="w-full bg-green-700 hover:bg-green-600 text-white rounded-xl py-3.5 sm:py-4 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98"
                >
                  สร้างแผนการท่องเที่ยว →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripPlannerPage;
