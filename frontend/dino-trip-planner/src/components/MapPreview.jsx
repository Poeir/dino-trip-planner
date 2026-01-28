import { useEffect, useState } from "react";

function MapPreview({ lat, lng }) {
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    if (!lat || !lng) return;

    fetch(`http://localhost:3000/api/google/map?lat=${lat}&long=${lng}`)
      .then(res => res.json())
      .then(data => setMapUrl(data.mapUrl))
      .catch(() => setMapUrl(""));
  }, [lat, lng]);

  if (!lat || !lng) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        ไม่มีข้อมูลตำแหน่ง
      </div>
    );
  }

  return (
    <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
      {mapUrl ? (
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={mapUrl}
          title="Map"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          กำลังโหลดแผนที่...
        </div>
      )}
    </div>
  );
}

export default MapPreview;
