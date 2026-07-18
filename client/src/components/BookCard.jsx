import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useSettings } from "../context/SettingsContext";
import { buildWhatsAppUrl, trackWhatsAppLead } from "../utils/whatsappLead";
import { getBookCover, getCoverImageProps, markPortraitImage } from "../utils/bookImages";
import { isNewBook } from "../utils/isNewBook";

const BookCard = ({ book }) => {
  const settings = useSettings();
  const message = `Hello I am interested in the book ${book.title}`;
  const whatsappUrl = buildWhatsAppUrl({ whatsappNumber: settings.whatsappNumber, message });

  const handleWhatsAppClick = (e) => {
    trackWhatsAppLead({ whatsappNumber: settings.whatsappNumber, book, source: "Book Card" });
    const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (newWindow) {
      e.preventDefault();
    }
  };

  return (
    <motion.article
      className="book-card"
      whileHover={{ y: -7 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="book-card-link">
        <div className="book-cover-wrap">
          {book.isBestSeller ? <span className="book-badge">Best Seller</span> : null}
          {isNewBook(book) ? <span className="book-badge-new">New</span> : null}
          <span className="book-category-badge">{book.category}</span>
          <Link to={`/books/${book._id}`}>
            <img {...getCoverImageProps(getBookCover(book))} alt={book.title} loading="lazy" onLoad={markPortraitImage} />
          </Link>
        </div>
        <div className="book-card-content">
          <h3>{book.title}</h3>
          {book.author ? (
            <p className="book-author">
              <span className="author-chip">{book.author}</span>
            </p>
          ) : null}
          <p className="book-rating">
            <FaStar /> {book.rating.toFixed(1)}
          </p>
          <a href={whatsappUrl} className="book-btn" target="_blank" rel="noreferrer" onClick={handleWhatsAppClick}>
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </motion.article>
  );
};

export default BookCard;

