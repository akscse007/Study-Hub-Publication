import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp, viewportConfig } from "../components/motion";

const NotFoundPage = () => {
  return (
    <motion.section
      className="section"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container page-card center">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link className="btn-primary" to="/">
          Back to Home
        </Link>
      </div>
    </motion.section>
  );
};

export default NotFoundPage;

