import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { fadeUp, staggerContainer, viewportConfig } from "../components/motion";
import { useSettings } from "../context/SettingsContext";

// Replace entries here to update the team shown on /developers.
const DEVELOPERS = [
  {
    name: "John Anderson",
    image: "/developer1.webp",
    role: "Lead Full Stack Developer",
    description:
      "Architected the overall platform, backend APIs, database structure, deployment, and system integration.",
    email: "john@example.com",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/"
  },
  {
    name: "Emily Carter",
    image: "/developer2.webp",
    role: "Frontend Developer",
    description:
      "Designed and developed the responsive user interface, animations, accessibility, and user experience.",
    email: "emily@example.com",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/"
  },
  {
    name: "Michael Brown",
    image: "/developer3.webp",
    role: "Backend Developer",
    description:
      "Worked on server architecture, authentication, APIs, database optimization, and application performance.",
    email: "michael@example.com",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/"
  },
  {
    name: "Sophia Wilson",
    image: "/developer4.webp",
    role: "UI/UX Designer",
    description:
      "Designed layouts, branding, visual identity, and ensured a clean and consistent design language throughout the platform.",
    email: "sophia@example.com",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/"
  }
];

const DevelopersPage = () => {
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
        <h1>Meet the Development Team</h1>
        <p>
          This website has been thoughtfully designed and developed by our dedicated development team. We are committed
          to creating modern, reliable, and user-friendly digital experiences.
        </p>
        <motion.div className="dev-grid" variants={staggerContainer}>
          {DEVELOPERS.map((dev) => (
            <motion.article key={dev.name} className="dev-card" variants={fadeUp}>
              <img className="dev-avatar" src={dev.image} alt={dev.name} />
              <h4>{dev.name}</h4>
              <span className="dev-role">{dev.role}</span>
              <p>{dev.description}</p>
              <span className="dev-email">
                <FaEnvelope /> {dev.email}
              </span>
              <div className="dev-links">
                <a className="btn-secondary" href={dev.github} target="_blank" rel="noreferrer">
                  <FaGithub /> GitHub
                </a>
                <a className="btn-secondary" href={dev.linkedin} target="_blank" rel="noreferrer">
                  <FaLinkedin /> LinkedIn
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
        <div className="dev-footer-note">
          <p>Built with dedication for {settings.publicationName}.</p>
          <p>© {new Date().getFullYear()} {settings.publicationName}. All Rights Reserved.</p>
        </div>
      </div>
    </motion.section>
  );
};

export default DevelopersPage;
