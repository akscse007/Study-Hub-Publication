import { motion } from "framer-motion";
import BookCard from "./BookCard";
import SectionHeader from "./SectionHeader";
import { fadeUp, staggerContainer, viewportConfig } from "./motion";

const BookGridSection = ({ title, subtitle, books, kicker, actionLabel, actionTo, tone = "light" }) => {
  if (!books?.length) {
    return null;
  }

  return (
    <motion.section
      className={`section books-section ${tone === "cream" ? "books-section-cream" : ""}`}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          kicker={kicker}
          actionLabel={actionLabel}
          actionTo={actionTo}
        />
        <motion.div className="book-grid" variants={staggerContainer}>
          {books.map((book) => (
            <motion.div key={book._id} variants={fadeUp}>
              <BookCard book={book} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BookGridSection;

