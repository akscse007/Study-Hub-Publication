import { motion } from "framer-motion";
import { FaPhoneAlt, FaFacebookF, FaInstagram, FaWhatsapp, FaEnvelope, FaYoutube } from "react-icons/fa";
import { fadeUp, viewportConfig } from "./motion";
import { useSettings } from "../context/SettingsContext";
import { buildContactMailto, formatPhoneForTel, formatWhatsAppForLink } from "../utils/contactFormatters";

const AutoBanner = () => {
  const settings = useSettings();
  const links = [
    { label: "Call", href: `tel:${formatPhoneForTel(settings.phone)}`, icon: <FaPhoneAlt /> },
    { label: "Facebook", href: settings.facebook, icon: <FaFacebookF />, external: true },
    { label: "Instagram", href: settings.instagram, icon: <FaInstagram />, external: true },
    { label: "YouTube", href: settings.youtube, icon: <FaYoutube />, external: true },
    { label: "WhatsApp", href: `https://wa.me/${formatWhatsAppForLink(settings.whatsappNumber)}`, icon: <FaWhatsapp />, external: true },
    // Same compose flow as the landing page; hidden when no email is configured.
    { label: "Email Us", href: buildContactMailto(settings), icon: <FaEnvelope /> }
  ].filter((link) => link.href);

  return (
    <motion.section
      className="auto-banner-wrap"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container">
        <div className="quick-contact-row">
          <span>Quick Contact</span>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="quick-contact-item"
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
            >
              {link.icon} {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default AutoBanner;
