import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaEnvelope, FaRegClock } from "react-icons/fa";
import SectionHeader from "./SectionHeader";
import { fadeUp, viewportConfig } from "./motion";
import { useSettings } from "../context/SettingsContext";
import { formatPhoneForTel, formatWhatsAppForLink, formatForDisplay, getGoogleMapsUrls } from "../utils/contactFormatters";

const ContactPreviewSection = () => {
  const settings = useSettings();
  const { mapsUrl, embedUrl } = getGoogleMapsUrls(settings.address);
  return (
    <motion.section
      className="section"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container">
        <SectionHeader title="Contact Us / Need Help?" kicker="Get in touch" />
        <div className="contact-preview-grid">
          <div className="contact-card">
            <h3>Shop Details</h3>
            <ul className="contact-details-list">
              <li>
                <FaMapMarkerAlt />
                <span>
                  <strong>Address</strong>
                  {settings.address}
                </span>
              </li>
              <li>
                <FaPhoneAlt />
                <span>
                  <strong>Phone</strong>
                  <a href={`tel:${formatPhoneForTel(settings.phone)}`}>{settings.phone}</a>
                </span>
              </li>
              <li>
                <FaWhatsapp />
                <span>
                  <strong>WhatsApp</strong>
                  <a href={`https://wa.me/${formatWhatsAppForLink(settings.whatsappNumber)}`} target="_blank" rel="noreferrer">
                    {formatForDisplay(settings.whatsappNumber)}
                  </a>
                </span>
              </li>
              <li>
                <FaEnvelope />
                <span>
                  <strong>Email</strong>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </span>
              </li>
              <li>
                <FaRegClock />
                <span>
                  <strong>Business Hours</strong>
                  Mon – Fri: 11:00 AM – 6:00 PM
                  <br />
                  Sat: 11:00 AM – 5:00 PM
                </span>
              </li>
            </ul>
          </div>
          <div className="map-highlight-card">
            <iframe
              title={`${settings.publicationName} location map`}
              src={embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="map-highlight-overlay">
              <h4>{settings.publicationName}</h4>
              <p>{settings.address}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                Open in Google Maps
              </a>
              <a href={`https://wa.me/${formatWhatsAppForLink(settings.whatsappNumber)}`} target="_blank" rel="noreferrer" className="chip-link">
                <FaWhatsapp /> WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactPreviewSection;
