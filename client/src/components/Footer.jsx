import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { useSettings } from "../context/SettingsContext";
import { formatWhatsAppForLink } from "../utils/contactFormatters";
import { BOOK_CATEGORIES } from "../constants/categories";

const Footer = () => {
  const settings = useSettings();
  const quickLinks = [
    { path: "/about", label: "About Us" },
    { path: "/faq", label: "FAQ" },
    { path: "/privacy-policy", label: "Privacy Policy" },
    { path: "/disclaimer", label: "Disclaimer" },
    { path: "/write-for-us", label: "Write For Us" },
    { path: "/media", label: "Media" },
    { path: "/seller-information", label: "Seller Information" }
  ];

  return (
    <footer className="footer">
      <div className="footer-top-strip">
        <div className="container footer-top-strip-inner">
          <p>Follow us on social media for updates & new releases:</p>
          <div className="footer-top-links">
            <a href={settings.facebook} target="_blank" rel="noreferrer">
              <FaFacebookF /> Facebook
            </a>
            {settings.instagram ? (
              <a href={settings.instagram} target="_blank" rel="noreferrer">
                <FaInstagram /> Instagram
              </a>
            ) : null}
            {settings.youtube ? (
              <a href={settings.youtube} target="_blank" rel="noreferrer">
                <FaYoutube /> YouTube
              </a>
            ) : null}
            <a href={`https://wa.me/${formatWhatsAppForLink(settings.whatsappNumber)}`} target="_blank" rel="noreferrer">
              <FaWhatsapp /> WhatsApp Channel
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <div className="footer-logo">{settings.publicationName}</div>
          <p>{settings.tagline}</p>
          <ul>
            <li>{settings.address}</li>
            <li>{settings.phone}</li>
          </ul>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Categories</h4>
          <ul>
            {BOOK_CATEGORIES.map((category) => (
              <li key={category.value}>
                <Link to={`/books?category=${encodeURIComponent(category.value)}`}>{category.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>About Developer</h4>
          <div className="footer-dev-link">
            <Link to="/developers">About Developers</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom-row">
        <p className="footer-note">© {new Date().getFullYear()} {settings.publicationName}. All rights reserved.</p>
        <div>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <span>Terms of Service</span>
          <Link to="/disclaimer">Disclaimer</Link>
          <Link to="/admin/login">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
