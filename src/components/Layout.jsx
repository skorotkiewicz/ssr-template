import { Outlet } from "react-router-dom";
import { MessageSquare } from "lucide-react";

export default function Layout() {
  return (
    <div className="layout">
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand">
              <MessageSquare className="nav-brand-icon" />
              <span className="nav-brand-text">ChatStream</span>
            </div>
          </div>
        </div>
      </nav>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
