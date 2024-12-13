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
      <div className="login__container">
        <div className="login__header">
          <h2 className="login__header-title">Join the Chat</h2>
          <p className="login__header-subtitle">
            Enter your name to start chatting
          </p>
        </div>
        <form className="login__form" onSubmit={handleSubmit}>
          <input
            type="text"
            required
            className="login__form-input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="login__form-button">
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}
