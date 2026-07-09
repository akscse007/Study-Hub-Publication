import { motion } from "framer-motion";
import { fadeUp, viewportConfig } from "../components/motion";

const DisclaimerPage = () => {
  return (
    <motion.section
      className="section"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container page-card">
        <h1>Disclaimer</h1>
        <p>
          All book details, ratings, and publication information presented on this website are provided for general
          informational purposes and are subject to revision in future catalogue updates.
        </p>
      </div>
    </motion.section>
  );
};

export default DisclaimerPage;

