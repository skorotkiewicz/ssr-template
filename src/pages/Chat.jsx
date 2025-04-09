import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../utils/socket.js";
import Cookies from "js-cookie";
import { api } from "../utils/trpc.js";
import moment from "moment";
import { Forward } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const userId = Cookies.get("userId");

  const fetchMessages = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const result = await api.messages.list.query({ page });

      setMessages((prevMessages) => [...result.messages, ...prevMessages]);
      setHasMore(result.hasMore);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!userId) return navigate("/");

    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    fetchMessages();

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

    try {
      await api.messages.create.mutate({
        content: newMessage,
        userId,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        {hasMore && (
          <button
            type="button"
            onClick={fetchMessages}
            disabled={loading}
            className="load-more-btn"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`messages-container ${
              message.userId === userId ? "messages-container--sent" : ""
            }`}
          >
            <div
              className={`messages-bubble ${
                message.userId === userId
                  ? "messages-bubble--sent"
                  : "messages-bubble--received"
              }`}
            >
              <p className="messages-name">{message.user.name}</p>
              <p className="messages-content">{message.content}</p>
              <small className="messages-createdAt">
                {moment(message.createdAt).fromNow()}
              </small>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="form-input"
            placeholder="Type your message..."
          />
          <button type="submit" className="form-button">
            <Forward />
          </button>
        </div>
      </form>
    </div>
  );
}
