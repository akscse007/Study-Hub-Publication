import { NavLink, Link } from "react-router-dom";
import { FaBookOpen, FaLock } from "react-icons/fa";
import { useSettings } from "../context/SettingsContext";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/books", label: "Books" },
  { path: "/about", label: "About Us" },
  { path: "/contact", label: "Contact Us" },
  { path: "/faq", label: "FAQ" }
];

const Navbar = () => {
  const settings = useSettings();
  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <span className="logo-icon">
            <FaBookOpen />
          </span>
          <span className="logo-text">{settings.publicationName}</span>
        </Link>
        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? "active-nav" : "")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-actions">
          <Link to="/admin/login" className="btn-admin-login">
            <FaLock /> Admin Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
