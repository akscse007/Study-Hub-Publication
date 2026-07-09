import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBullhorn, FaRegCalendarAlt } from "react-icons/fa";
import { announcementApi } from "../services/api";
import { fadeUp, staggerContainer, viewportConfig } from "../components/motion";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await announcementApi.getAnnouncements();
        if (!cancelled) setAnnouncements(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load announcements");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.section
      className="section"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container page-card">
        <h1>Announcements</h1>
        <p className="announcements-intro">Latest news and updates from our publication.</p>

        {loading && <p className="status-text">Loading announcements...</p>}
        {error && <p className="status-text error">{error}</p>}

        {!loading && !error && announcements.length === 0 && (
          <div className="announcements-empty">
            <FaBullhorn aria-hidden="true" />
            <p>No announcements right now. Please check back soon.</p>
          </div>
        )}

        {!loading && !error && announcements.length > 0 && (
          <motion.div
            className="announcements-list"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {announcements.map((item) => (
              <motion.article key={item._id} className="announcement-card" variants={fadeUp}>
                <div className="announcement-card-head">
                  <h2>{item.title}</h2>
                  <span className="announcement-date">
                    <FaRegCalendarAlt aria-hidden="true" /> {formatDate(item.createdAt)}
                  </span>
                </div>
                <p className="announcement-content">{item.content}</p>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default AnnouncementsPage;
