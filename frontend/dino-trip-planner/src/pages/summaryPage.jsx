function SummaryPage() {
    return (
        <div className="summary-page">
            <h1>สรุปการเดินทาง</h1>
            <div className="summary-content">
                <div className="summary-section">
                    <h3>แผนการเดินทาง</h3>
                    <p>รายละเอียดแผนการเดินทางของคุณ</p>
                </div>
                <div className="summary-section">
                    <h3>สถานที่ท่องเที่ยว</h3>
                    <p>รายการสถานที่ที่แนะนำ</p>
                </div>
                <div className="summary-section">
                    <h3>งบประมาณโดยรวม</h3>
                    <p>สรุปค่าใช้จ่าย</p>
                </div>
            </div>
        </div>
    )
}

export default SummaryPage
