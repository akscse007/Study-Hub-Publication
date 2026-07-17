import { motion } from "framer-motion";
import { fadeUp, viewportConfig } from "../components/motion";
import { useSettings } from "../context/SettingsContext";

const PrivacyPolicyPage = () => {
  const settings = useSettings();
  return (
    <motion.section
      className="section"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container page-card privacy-page">
        <h1>Privacy Policy</h1>
        <p>
          {settings.publicationName} respects your privacy. We collect only required contact details for responding to
          inquiries, fulfilling communication requests, and improving service quality. We do not sell personal data to
          third parties.
        </p>
        <h3>**Return Policy**</h3>
        <p>
          Books will be accepted for return within 7 days. Please ensure that the books are kept undamaged and free of
          any ink marks on the pages. Bringing the original bill or cash memo is mandatory.
        </p>
        <h3>**Security and Confidentiality**</h3>
        <p>
          <b>study-hub.in</b> restricts access to personal information to its employees, moderators, and
          authorized agents solely for order updates, delivery, and related services.
        
          Every customer is important to us, and we handle all personal information with the utmost respect and
          confidentiality.
        </p>
        <h3>**Data Integrity**</h3>
        <p>
          We assure our customers that the information they provide will be handled with the utmost discretion.
          Therefore, we kindly request that you provide information that is accurate and complete so that we can reach
          you quickly whenever required.
        </p>
      </div>
    </motion.section>
  );
};

export default PrivacyPolicyPage;
