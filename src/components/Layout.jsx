import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout">
      <nav className="layout__nav">
        <div className="layout__nav-container">
          <div className="layout__nav-content">
            <div className="layout__nav-brand">
              <span className="layout__nav-brand-text">ChatStream</span>
            </div>
          </div>
        </div>
      </nav>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
