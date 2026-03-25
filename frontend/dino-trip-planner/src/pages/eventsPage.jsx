import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import heroImage from "../assets/pic1.jpg";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/events/")
      .then(res => res.json())
      .then(data => {
        const eventsData = data.data || data;
        setEvents(eventsData);

        // Extract unique categories
        const categories = [...new Set(eventsData.map(event => event.category))];
        setAvailableCategories(categories.sort());

        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredEvents = selectedCategory === "all"
    ? events
    : events.filter(event => event.category === selectedCategory);

  // Split filtered events
  const featured = filteredEvents.filter(event => event.metadata?.isFeatured);
  const others = filteredEvents.filter(event => !event.metadata?.isFeatured);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-b from-green-700 to-green-600 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            📅 กิจกรรมและเหตุการณ์
          </h1>
          <p className="text-base opacity-90">
            ค้นหาและค้นพบกิจกรรมที่สุดเพศสร้างในขอนแก่น
          </p>
        </div>
      </section>

      {/* ================= CONTENT SECTION ================= */}
      <section className="bg-white py-16">
        <div className="content-wrapper">

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔍 กรองตามหมวดหมู่</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ทั้งหมด ({events.length})
            </button>
            {availableCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category} ({events.filter(e => e.category === category).length})
              </button>
            ))}
          </div>
        </div>

        {/* Featured Events */}
        {featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">⭐ กิจกรรมเด่น</h2>
            <div className="space-y-3">
              {featured.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Other Events */}
        {others.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {featured.length > 0 ? "กิจกรรมอื่นๆ" : "กิจกรรมทั้งหมด"}
            </h2>
            <div className="space-y-3">
              {others.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {featured.length === 0 && others.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">ไม่พบกิจกรรม</p>
          </div>
        )}

        </div>
      </section>
    </>
  );
}

export default EventsPage;
