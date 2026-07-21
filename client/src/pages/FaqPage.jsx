import { motion } from "framer-motion";
import { fadeUp, viewportConfig } from "../components/motion";

const faqs = [
  { q: "How can I order books in bulk?", a: "Contact us through phone, WhatsApp, or email for institutional orders." },
  { q: "Do you publish curriculum-specific books?", a: "Yes, we provide books aligned to key school board and course requirements." },
  { q: "Can I become a seller partner?", a: "Yes. Visit Seller Information page and submit your partnership request." }
];

const FaqPage = () => {
  return (
    <motion.section
      className="section"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container page-card">
        <h1>FAQ</h1>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FaqPage;

