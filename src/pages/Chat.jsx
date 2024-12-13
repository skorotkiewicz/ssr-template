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
    <div className="flex flex-col h-[80vh] bg-white rounded-lg shadow">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.userId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.userId === userId
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm font-medium">{message.user.name}</p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
