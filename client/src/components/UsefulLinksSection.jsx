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
    title: "Delivery Across Bengal",
    body: "We deliver to all major districts in West Bengal. Fast, reliable, and tracked shipping.",
    icon: <FaTruck />
  },
  {
    title: "Quality Assured",
    body: "Every book undergoes rigorous editorial review by subject matter experts before publication.",
    icon: <FaCheckCircle />
  },
  {
    title: "Easy Returns",
    body: "Damaged or misprinted copies? We offer hassle-free replacement within 7 days.",
    icon: <FaUndoAlt />
  },
  {
    title: "Trusted by Schools",
    body: "Adopted by over 500+ schools and tuition centres across the state.",
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

