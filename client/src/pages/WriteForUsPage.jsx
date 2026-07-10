import { motion } from "framer-motion";
import { fadeUp, viewportConfig } from "../components/motion";
import ContactEmail from "../components/ContactEmail";

const WriteForUsPage = () => {
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
          material. Share your proposal at the email below.
        </p>
        <ContactEmail chip />
      </div>
    </motion.section>
  );
};

export default WriteForUsPage;
