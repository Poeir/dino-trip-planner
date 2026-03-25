import { useState, useRef, useEffect } from "react";
import "./ChatWidget.css";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: "bot", text: "สวัสดีครับ! ยินดีต้อนรับสู่น้องไดโน 🦖 แชทบอทช่วยเหลือนักท่องเที่ยวของจังหวัดขอนแก่น หากสงสัยใด ๆ สามารถสอบถามได้เลยคจ้า" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Convert messages format for API
      const history = messages
        .filter(m => m.type !== 'bot' || !m.text.includes('...')) // exclude loading states
        .map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

      // Call chatbot API
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          history: history
        })
      });

      const data = await response.json();
      
      // Add bot response
      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        text: data.reply || "ขอโทษครับ ไม่สามารถประมวลผลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง"
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      
      // Fallback bot message
      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        text: "ขอโทษครับ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-fab"
        title="เปิดแชท"
      >
        💬
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="chat-modal">
          {/* Header */}
          <div className="chat-header">
            <h3>น้องไดโน</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="close-btn"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="พิมพ์คำถามของคุณ..."
              rows="2"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="send-btn"
            >
              {loading ? "⏳" : "📤"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
