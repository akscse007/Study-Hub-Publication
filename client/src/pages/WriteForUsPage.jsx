import { motion } from "framer-motion";
import { fadeUp, viewportConfig } from "../components/motion";
import { useSettings } from "../context/SettingsContext";

const WriteForUsPage = () => {
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
        <h1>Write for Us</h1>
        <p>
          We welcome educators and subject experts to contribute manuscripts, question banks, and curriculum-focused
          material. Share your proposal at <a href={`mailto:${settings.email}`}>{settings.email}</a>.
        </p>
      </div>
    </motion.section>
  );
};

export default WriteForUsPage;
