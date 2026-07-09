import { FaInstagram, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { useSettings } from "../context/SettingsContext";
import { formatPhoneForTel, formatWhatsAppForLink } from "../utils/contactFormatters";

const TopBar = () => {
  const settings = useSettings();
  return (
    <div className="top-bar">
      <div className="container top-bar-content">
        <p>For any queries or questions, reach us:</p>
        <div className="top-bar-links">
          <a href={`tel:${formatPhoneForTel(settings.phone)}`} className="top-bar-link">
            <FaPhoneAlt /> {settings.phone}
          </a>
          <a
            href={`https://wa.me/${formatWhatsAppForLink(settings.whatsappNumber)}`}
            className="top-bar-link"
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp /> WhatsApp Us
          </a>
          {settings.instagram ? (
            <a href={settings.instagram} className="top-bar-link" target="_blank" rel="noreferrer">
              <FaInstagram /> Instagram
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
