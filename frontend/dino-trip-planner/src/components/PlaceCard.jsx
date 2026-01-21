import './PlaceCard.css';

function PlaceCard() {
  return (
    <div className="place-card">
      <div className="place-image">
        <img src="https://pukmudmuangthai.com/wp-content/uploads/2021/02/%E0%B8%82%E0%B8%AD%E0%B8%99%E0%B9%81%E0%B8%81%E0%B9%88%E0%B8%99-%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AB%E0%B8%99%E0%B8%AD%E0%B8%87%E0%B9%81%E0%B8%A7%E0%B8%87%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%AD%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%A5%E0%B8%A7%E0%B8%87-Medium.jpg" alt="วัดหนองแวง" />
        <div className="rating-badge">⭐ 4.4</div>
      </div>

      <div className="place-content">
        <h3>วัดหนองแวง</h3>
        <p className="type">Local Museum</p>
        <p className="location">📍 ถนนหน้าเมือง</p>
      </div>
    </div>
  );
}

export default PlaceCard;