import { motion } from "framer-motion";
import { fadeUp, viewportConfig } from "../components/motion";
import { useSettings } from "../context/SettingsContext";

const SellerInfoPage = () => {
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
        <h1>Seller Information</h1>
        <p>
          We collaborate with bookstores, educational distributors, and institutional sellers across India. Send your
          organization details to <a href={`mailto:${settings.email}`}>{settings.email}</a> to
          receive our trade catalogue and onboarding information.
        </p>
      </div>
    </motion.section>
  );
};

export default SellerInfoPage;
