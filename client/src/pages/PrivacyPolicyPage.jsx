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
      <div className="container page-card">
        <h1>Privacy Policy</h1>
        <p>
          {settings.publicationName} respects your privacy. We collect only required contact details for responding to
          inquiries, fulfilling communication requests, and improving service quality. We do not sell personal data to
          third parties.
        </p>
      </div>
    </motion.section>
  );
};

export default PrivacyPolicyPage;
