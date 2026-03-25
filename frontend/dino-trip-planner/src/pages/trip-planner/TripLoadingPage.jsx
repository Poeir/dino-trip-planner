import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createTripItinerary } from "../../api/tripplannerAPI";

function TripLoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const tripData = location.state?.tripData;

  useEffect(() => {
    const generateItinerary = async () => {
      try {
        if (!tripData) {
          console.error("No trip data provided");
          navigate("/trip-planner");
          return;
        }

        console.log("Sending trip data to API:", tripData);
        
        // Call the API to generate the itinerary
        const response = await createTripItinerary(tripData);
        
        console.log("Received itinerary from API:", response);
        
        // Navigate to result page and pass the itinerary
        navigate("/trip-result", { state: { itinerary: response } });
      } catch (error) {
        console.error("Error generating itinerary:", error);
        // Show error message and redirect back
        alert("เกิดข้อผิดพลาดในการสร้างแผนการท่องเที่ยว กรุณาลองใหม่อีกครั้ง");
        navigate("/trip-planner");
      }
    };

    generateItinerary();
  }, [tripData, navigate]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background with temple image and overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=1200&fit=crop')",
          opacity: 0.15,
        }}
      />

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/80" />

      {/* Content */}
      <div className="relative w-full min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Glowing Orb */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            {/* Outer glow effect */}
            <div className="absolute inset-0 rounded-full bg-green-400/20 blur-3xl animate-pulse" />

            {/* Main orb */}
            <div className="absolute inset-0 rounded-full bg-white shadow-2xl animate-pulse">
              {/* Inner shine effect */}
              <div className="absolute top-4 left-4 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/40 blur-md" />
            </div>
          </div>

          {/* Loading Text with Icon */}
          <div className="flex items-center gap-3 justify-center">
            <span className="text-3xl sm:text-4xl">✏️</span>
            <div className="text-3xl sm:text-4xl font-bold text-green-700 animate-bounce">
              กำลังประมวลผล
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-gray-600 text-lg text-center max-w-md">
            AI ของเรากำลังสร้างแผนการท่องเที่ยวที่เหมาะสำหรับคุณ...
          </p>

          {/* Loading dots animation */}
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 rounded-full bg-green-700 animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-3 h-3 rounded-full bg-green-700 animate-bounce" style={{ animationDelay: "0.15s" }} />
            <div className="w-3 h-3 rounded-full bg-green-700 animate-bounce" style={{ animationDelay: "0.3s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripLoadingPage;
