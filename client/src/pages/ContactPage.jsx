import { motion } from "framer-motion";
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import ContactEmail from "../components/ContactEmail";
import { fadeUp, viewportConfig } from "../components/motion";
import { useSettings } from "../context/SettingsContext";
import { formatWhatsAppForLink, formatForDisplay, getGoogleMapsUrls } from "../utils/contactFormatters";

const ContactPage = () => {
  const settings = useSettings();
  const { embedUrl } = getGoogleMapsUrls(settings.address);

  return (
    <motion.section
      className="section"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container contact-page-grid">
        <article className="contact-card contact-page-card">
          <div className="contact-page-details">
            <h1>Contact Us</h1>
            <p>
              <FaPhoneAlt /> {settings.phone}
            </p>
            <p>
              <FaWhatsapp /> {formatForDisplay(settings.whatsappNumber)}
            </p>
            <ContactEmail />
            <p>
              <FaMapMarkerAlt /> {settings.address}
            </p>
            <a href={`https://wa.me/${formatWhatsAppForLink(settings.whatsappNumber)}`} className="chip-link" target="_blank" rel="noreferrer">
              WhatsApp Support
            </a>
          </div>
          <div className="map-card contact-page-map">
            <iframe
              title={`${settings.publicationName} map`}
              src={embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </article>
      </div>
    </motion.section>
  );
};

export default ContactPage;
