import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      const user = await response.json();
      localStorage.setItem("userId", user.id);
      navigate("/chat");
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
