import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { fadeUp, staggerContainer, viewportConfig } from "../components/motion";
import { useSettings } from "../context/SettingsContext";

// Dummy Images (Replace Later)
import developer3 from "../developers/akash.PNG";
import developer2 from "../developers/sounil.JPEG";
import developer1 from "../developers/rwita.JPEG";
import developer4 from "../developers/soham.JPEG";

const DEVELOPERS = [
  {
    name: "Rwitabrata Pan",
    image: developer1,
    role: "Lead Full Stack Developer",
    description:
      "Led the end-to-end development of the platform by architecting scalable frontend and backend solutions, designing the database, integrating core services, and ensuring a secure, high-performance application.",
    email: "panrwitabrata34t@gmail.com",
    github: "https://github.com/RwitabrataPan",
    linkedin: "https://www.linkedin.com/in/rwitabrata-pan-6bb047362/"
  },
  {
    name: "Sounil Mukhopadhyay",
    image: developer2,
    role: "Team coordinator and Customer Relationship Manager",
    description:
      "Coordinated project execution, managed client communications, ensured seamless collaboration between stakeholders and the development team.",
    email: "sounilmuk@gmail.com",
    github: "https://github.com/Sounil1125",
    linkedin: "https://in.linkedin.com/in/sounil-mukhopadhyay-266b42319"
  },
  {
    name: "Akash Roy",
    image: developer3,
    role: "Project Manager & DevOps Lead",
    description:
      "Directed project execution, streamlined DevOps processes, automated deployment workflows, and maintained cloud infrastructure to ensure efficient, secure, and reliable software delivery.",
    email: "roy.akashcucse@gmail.com",
    github: "https://github.com/akscse007",
    linkedin: "https://www.linkedin.com/in/akscse007/"
  },
  {
    name: "Soham Saha",
    image: developer4,
    role: "Full Stack Developer & DevOps Contributor",
    description:
      "Contributed to frontend and backend development, implemented scalable features, optimized application performance, and supported deployment, testing, and infrastructure maintenance.",
    email: "sahasoham807@gmail.com",
    github: "https://github.com/GithubSohamSaha/",
    linkedin: "https://www.linkedin.com/in/soham-saha-74594721b"
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
        <motion.div variants={fadeUp} className="page-header">
          <h1>Meet Our Development Team</h1>

          <p>
            Behind every successful platform is a passionate team of developers,
            designers, and innovators dedicated to building modern, secure, and
            scalable digital experiences.
          </p>
        </motion.div>

        <motion.div
          className="dev-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {DEVELOPERS.map((dev) => (
            <motion.article
              key={dev.name}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="dev-card"
            >
              <div className="dev-image-wrapper">
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="dev-avatar"
                />
              </div>

              <h3>{dev.name}</h3>

              <span className="dev-role">{dev.role}</span>

              <p>{dev.description}</p>

              <div className="dev-email">
                <FaEnvelope />
                <span>{dev.email}</span>
              </div>

              <div className="dev-links">
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  <FaGithub /> GitHub
                </a>

                <a
                  href={dev.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  <FaLinkedin /> LinkedIn
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="dev-footer-note">
          <p>
            Built with dedication by the Development Team of{" "}
            <strong>{settings.publicationName}</strong>.
          </p>

          <p>
            © {new Date().getFullYear()} {settings.publicationName}. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default DevelopersPage;