import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa";
import { fadeUp, viewportConfig } from "../components/motion";
import { useSettings } from "../context/SettingsContext";
import { buildContactMailto } from "../utils/contactFormatters";

const MediaPage = () => {
  const settings = useSettings();

  const cards = [
    {
      key: "facebook",
      title: "Facebook",
      href: settings.facebook,
      external: true,
      icon: <FaFacebookF />,
      note:
        "Follow our official Facebook page for the latest updates, announcements, book releases, and educational content."
    },
    {
      key: "instagram",
      title: "Instagram",
      href: settings.instagram,
      external: true,
      icon: <FaInstagram />,
      note:
        "Follow us on Instagram to explore our latest books, updates, behind-the-scenes moments, and educational highlights."
    },
    {
      key: "email",
      title: "Email",
      href: buildContactMailto(settings),
      icon: <FaEnvelope />,
      detail: settings.email,
      note:
        "For media enquiries, collaborations, publishing-related communication, or general assistance, feel free to contact us by email."
    }
  ].filter((card) => card.href);

  return (
    <motion.section
      className="section"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container page-card">
        <h1>Media</h1>
        <p>We are very happy to have you with us.
          <br />
          Connect with us through our official channels.</p>
        <div className="media-card-list">
          {cards.map((card) => (
            <a
              key={card.key}
              className="media-card"
              href={card.href}
              target={card.external ? "_blank" : undefined}
              rel={card.external ? "noreferrer" : undefined}
            >
              <span className="media-card-icon">{card.icon}</span>
              <div>
                <h4>{card.title}</h4>
                {card.detail && <p className="media-card-detail">{card.detail}</p>}
                <p>{card.note}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default MediaPage;
