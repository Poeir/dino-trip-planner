function ChatbotPage() {
    return (
        <div className="chatbot-page">
            <h1>แชทบอท</h1>
            <div className="chatbot-container">
                <div className="chat-messages">
                    <div className="message bot">
                        <p>สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?</p>
                    </div>
                </div>
                <div className="chat-input">
                    <input type="text" placeholder="พิมพ์ข้อความ..." />
                    <button>ส่ง</button>
                </div>
            </div>
        </div>
    )
}

export default ChatbotPage
