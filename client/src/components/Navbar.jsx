import { NavLink, Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import BrandLogo from "./BrandLogo";
import { useSettings } from "../context/SettingsContext";

const navItems = [
  { path: "/home", label: "Home" },
  { path: "/books", label: "Books" },
  { path: "/about", label: "About Us" },
  { path: "/contact", label: "Contact Us" },
  { path: "/seller-information", label: "Seller Information" },
  { path: "/announcements", label: "Announcements" }
];

const Navbar = () => {
  const settings = useSettings();
  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/home" className="logo">
          <span className="logo-icon">
            <BrandLogo />
          </span>
          <span className="logo-text">
            {settings.publicationName}
            {settings.tagline && <small className="brand-tagline">{settings.tagline}</small>}
          </span>
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
