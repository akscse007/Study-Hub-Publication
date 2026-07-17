import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTruck, FaUndoAlt, FaSchool } from "react-icons/fa";
import { fadeUp, staggerContainer, viewportConfig } from "./motion";

const links = [
  { path: "/write-for-us", label: "Write for Us" },
  { path: "/media", label: "Media" },
  { path: "/about", label: "About Us" },
  { path: "/seller-information", label: "Seller Information" },
  { path: "/faq", label: "FAQ" },
  { path: "/privacy-policy", label: "Privacy Policy" },
  { path: "/disclaimer", label: "Disclaimer" }
];
const infoCards = [
  {
    title: "Delivery across Bengal and Tripura",
    body: "We supply our books throughout the states of West Bengal and Tripura. Our objective is to ensure fast, reliable, and accurate delivery to you through meticulous verification.",
    icon: <FaTruck />
  },
  {
    title: "Quality Assurance",
    body: "Before publishing, our books undergo rigorous and repeated screening by our dedicated editorial team and subject matter experts.",
    icon: <FaCheckCircle />
  },
  {
    title: "Easy Return",
    body: "Books will be accepted for return within 7 days. Please ensure that the books are kept undamaged or physically altered.",
    icon: <FaUndoAlt />
  },
  {
    title: "Trusted by Teachers",
    body: "Driven by the quality and innovation of our books, we are currently partnered with over 60 schools and nearly 240+ private coaching centers across the state.",
    icon: <FaSchool />
  }
];

const UsefulLinksSection = () => {
  return (
    <motion.section
      className="section"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container">
        <div className="useful-links-layout">
          <div>
            <span className="section-kicker">Why Choose Us</span>
            <h2>Useful Information</h2>
            <motion.div className="useful-card-grid" variants={staggerContainer}>
              {infoCards.map((item) => (
                <motion.article key={item.title} className="useful-card" variants={fadeUp}>
                  <span>{item.icon}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
          <div>
            <span className="section-kicker">Quick Access</span>
            <h2>Extra Links</h2>
            <motion.div className="extra-links-list" variants={staggerContainer}>
              {links.map((link) => (
                <motion.div key={link.path} variants={fadeUp}>
                  <Link className="extra-link" to={link.path}>
                    {link.label}
                    <span>›</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default UsefulLinksSection;

