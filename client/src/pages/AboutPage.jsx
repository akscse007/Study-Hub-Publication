import { motion } from "framer-motion";
import { fadeUp, viewportConfig } from "../components/motion";
import { useSettings } from "../context/SettingsContext";

const AboutPage = () => {
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
        <h1>About Us</h1>
        <p>
          {settings.publicationName} is an educational publishing house focused on thoughtfully crafted books for early
          learners and secondary-level students. Our editorial team works with teachers, curriculum planners, and
          subject specialists to deliver high-quality academic resources.
        </p>
      </div>
    </motion.section>
  );
};

export default AboutPage;
