import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { api } from "../utils/trpc.js";

export default function Login() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const user = await api.users.create.mutate({ name });

      if (user?.id) {
        Cookies.set("userId", user.id, { expires: 7 }); // 7 days
        navigate("/chat");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login">
      <div className="container">
        <div className="header">
          <h2 className="header-title">Join the Chat</h2>
          <p className="header-subtitle">Enter your name to start chatting</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            required
            className="form-input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="form-button">
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}
