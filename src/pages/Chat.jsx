import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../utils/socket.js";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    fetch("/api/messages")
      .then((res) => res.json())
      .then(setMessages);

    return () => {
      socket.disconnect();
    };
  }, [userId, navigate]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage, userId }),
    });

    setNewMessage("");
  };

  return (
    <div className="chat">
      <div className="chat__messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat__messages-container ${
              message.userId === userId ? "chat__messages-container--sent" : ""
            }`}
          >
            <div
              className={`chat__messages-bubble ${
                message.userId === userId
                  ? "chat__messages-bubble--sent"
                  : "chat__messages-bubble--received"
              }`}
            >
              <p className="chat__messages-name">{message.user.name}</p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat__form">
        <div className="chat__form-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="chat__form-input"
            placeholder="Type your message..."
          />
          <button type="submit" className="chat__form-button">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
