function TripPlannerPage() {
    return (
        <div className="trip-planner-page">
            <h1>วางแผนการเดินทาง</h1>
            <div className="trip-form">
                <form>
                    <div className="form-group">
                        <label>จุดหมายปลายทาง</label>
                        <input type="text" placeholder="ใส่จุดหมายปลายทาง" />
                    </div>
                    <div className="form-group">
                        <label>วันที่เดินทาง</label>
                        <input type="date" />
                    </div>
                    <div className="form-group">
                        <label>จำนวนวัน</label>
                        <input type="number" placeholder="จำนวนวัน" />
                    </div>
                    <div className="form-group">
                        <label>งบประมาณ</label>
                        <input type="number" placeholder="งบประมาณ (บาท)" />
                    </div>
                    <button type="submit">วางแผนการเดินทาง</button>
                </form>
            </div>
        </div>
    )
}

export default TripPlannerPage
