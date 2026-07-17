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
          <b>*{settings.publicationName}*</b> is a trusted, emerging institution that ensures a bright future for you and your child through our published books. Our organization primarily publishes books across various academic disciplines from Nursery to the Higher Secondary level. All our books are meticulously written in accordance with the newly designed syllabus of West Bengal and Tripura Board .
          Furthermore, our objective extends beyond mere publishing; we are deeply committed to a child’s mental development. Therefore, STUDY-HUB Publication has crafted a diverse range of books for your child, including art and craft, fun rhymes, playful handwriting practice, and alphabet learning, all designed to foster their holistic growth.
          Before publishing, our books undergo rigorous and repeated screening by our dedicated editorial team. Our primary mission is to deliver flawless, error-free books into the hands of students at a minimal and affordable price.
          We highly value and welcome feedback from students, teachers, and authors alike. Additionally, you can stay updated on all our new arrivals by visiting our Facebook and Instagram pages.
          We cordially invite you to join our community. Please explore our website and social media handles, and share your valuable feedback, which will help us enhance the quality of our upcoming books.
          <br />
          <br />Best Regards,
          <br />Team of <b>{settings.publicationName}</b>
        </p>
      </div>
    </motion.section>
  );
};

export default AboutPage;
