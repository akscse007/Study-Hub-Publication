import { useNavigate } from "react-router-dom";
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Header = ({ menuOpen = false, onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          type="button"
          className="icon-btn admin-menu-btn"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="admin-sidebar"
          onClick={onMenuToggle}
        >
          <FaBars />
        </button>
        <h1 className="admin-header-title">Publication Dashboard</h1>
      </div>
      <div className="admin-header-actions">
        <button type="button" className="icon-btn" aria-label="Notifications">
          <FaBell />
        </button>
        <div className="admin-user">
          <FaUserCircle />
          <span>{user?.userId || "Admin"}</span>
          <span className="admin-role-badge">{user?.role}</span>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
