import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles.css";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="admin-shell">
      <Sidebar open={sidebarOpen} />
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="admin-main">
        <Header menuOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen((open) => !open)} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
