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
        <h2>Disclaimer</h2>

        <p>
          Study-Hub Publication strives to ensure that all information presented on
          this website is <strong>accurate, reliable, and up to date</strong>.
          However, we reserve the right to modify, update, or discontinue any
          information, publication, pricing, availability, or service at any time
          without prior notice.
        </p>

        <p>
          The <strong>book descriptions, images, prices, specifications, publication
          details, and other content</strong> available on this website are provided
          for general informational purposes only. While every effort is made to
          maintain accuracy, inadvertent errors or omissions may occur.
        </p>

        <p>
          Book cover images displayed on this website are intended for identification
          and promotional purposes. The actual printed edition may vary slightly due
          to updates in design, printing processes, or subsequent editions.
        </p>

        <p>
          <strong>Availability of books</strong> is subject to stock and distribution
          conditions. Orders and enquiries received through this website do not
          constitute a confirmed sale until verified by Study-Hub Publication.
        </p>

        <p>
          External websites or third-party platforms that may be accessed through
          links provided on this website, including social media platforms, are
          maintained independently. <strong>Study-Hub Publication is not responsible
          for the content, policies, or practices of those external services.</strong>
        </p>

        <p>
          Users are requested to verify important information before making purchasing
          decisions. If any discrepancy is noticed regarding book details, pricing,
          or availability, please contact us directly for clarification.
        </p>

        <p>
          By using this website, you acknowledge that your use of the information and
          services provided is at your own discretion and agree to the policies
          published on this website.
        </p>

        <p>
          For any questions regarding this disclaimer, please contact{" "}
          <strong>Study-Hub Publication</strong> through the official contact
          information provided on this website.
        </p>
      </div>
    </motion.section>
  );
};

export default DisclaimerPage;

