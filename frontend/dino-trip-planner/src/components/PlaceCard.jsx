import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TypeBadge from "./TypeBadge";
import "./PlaceCard.css";

function PlaceCard({ place }) {
  const { core, address, media } = place;
  const photos = media?.photos ?? [];
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const intervalRef = useRef(null);

  // const getPhotoUrl = (name) =>
  //   `http://localhost:3000/api/google/photo?name=${name}&maxWidth=800`;
  const getPhotoUrl = (name)=>
    'https://cdn.pixabay.com/photo/2017/05/21/07/15/khonkaen-2330641_1280.jpg';

  // preload (เอาแค่ 5 รูปพอ)
  useEffect(() => {
    photos.slice(0, 5).forEach(p => {
      const img = new Image();
      img.src = getPhotoUrl(p.name);
    });
  }, [photos]);

  const startSlide = () => {
    if (photos.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % photos.length);
        setFade(false);
      }, 350);
    }, 1500);
  };

  const stopSlide = () => {
    clearInterval(intervalRef.current);
    setIndex(0);
    setFade(false);
  };

  const imageUrl = photos[index]
    ? getPhotoUrl(photos[index].name)
    : "/placeholder.jpg";

  return (
    <div
      className="place-card"
      onMouseEnter={startSlide}
      onMouseLeave={stopSlide}
      onClick={() => navigate(`/place/${place.google_place_id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="place-image fancy">
        <img
          src={imageUrl}
          alt={core.name}
          className={`photo ${fade ? "fade" : ""}`}
        />

        {/* rating */}
        <div className="rating-badge">
          ⭐ {core.rating ?? "N/A"}
          {core.userRatingCount && (
            <span className="rating-count">
              ({core.userRatingCount})
            </span>
          )}
        </div>

        {/* dot indicator */}
        {photos.length > 1 && (
          <div className="dots">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === index ? "active" : ""}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="place-content">
        <h3>{core.name}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          <TypeBadge label={core.primaryType} />
        </div>
        <p className="location">
          📍 {address.formatted}
        </p>
      </div>
    </div>
  );
}

export default PlaceCard;
