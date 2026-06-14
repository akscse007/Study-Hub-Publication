import { Link } from "react-router-dom";
import { FaFacebookF, FaBell, FaWhatsapp } from "react-icons/fa";
import { useNotifications } from "../hooks/useNotifications";
import { useSettings } from "../context/SettingsContext";
import { formatWhatsAppForLink } from "../utils/contactFormatters";

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

  const { email, setEmail, status, message, subscribeEmail } = useNotifications();

  const handleSubmit = (e) => {
    e.preventDefault();
    subscribeEmail();
  };

  return (
    <footer className="footer">
      <div className="footer-top-strip">
        <div className="container footer-top-strip-inner">
          <p>Follow us on social media for updates & new releases:</p>
          <div className="footer-top-links">
            <a href={settings.facebook} target="_blank" rel="noreferrer">
              <FaFacebookF /> Facebook
            </a>
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
            <li>Pre School</li>
            <li>Nursery</li>
            <li>General Course</li>
            <li>Madhyamik</li>
            <li>Higher Secondary</li>
          </ul>
        </div>
        <div>
          <h4>Stay Updated</h4>
          <p>Get notified about new books and releases.</p>
          <form className="subscribe-box" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={status === "loading"}>
              <FaBell /> {status === "loading" ? "Subscribing..." : "Notify me"}
            </button>
          </form>
          {message ? <p className="subscribe-message">{message}</p> : null}
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
