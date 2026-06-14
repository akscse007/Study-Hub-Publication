import { motion } from "framer-motion";
import { fadeUp, viewportConfig } from "../components/motion";
import { useSettings } from "../context/SettingsContext";

const MediaPage = () => {
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
        <h1>Media</h1>
        <p>
          For press requests, interviews, catalogue announcements, and media partnerships, please contact{" "}
          <a href={`mailto:${settings.email}`}>{settings.email}</a>.
        </p>
      </div>
    </motion.section>
  );
};

export default MediaPage;
