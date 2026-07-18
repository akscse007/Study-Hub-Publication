import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { bookApi } from "../services/api";
import { fadeUp, viewportConfig } from "../components/motion";
import { useSettings } from "../context/SettingsContext";
import { buildWhatsAppUrl, trackWhatsAppLead } from "../utils/whatsappLead";
import { getBookImages, getCoverImageProps, markPortraitImage } from "../utils/bookImages";

// Details column is 340px on desktop (.details-layout), full-width on mobile.
const DETAILS_SIZES = "(max-width: 760px) 92vw, 340px";
import { isNewBook } from "../utils/isNewBook";

const EXCLUDED_DETAIL_FIELDS = new Set([
  "_id",
  "__v",
  "isbn",
  "image",
  "images",
  "searchCount",
  "isActive",
  "isFeatured",
  // Legacy flag; may linger on old documents until the removeIsLanding script runs.
  "isLanding",
  "isBestSeller",
  "createdAt",
  "updatedAt",
]);

const EXPLICITLY_RENDERED_FIELDS = ["title", "author", "rating", "description"];

const isValidDisplayValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return true;
};

const formatFieldLabel = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

const renderFieldValue = (key, value) => {
  if (key === "price") return `₹${value}`;
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
};

const badgeStyle = {
  display: "inline-block",
  fontSize: "0.65rem",
  fontWeight: 700,
  padding: "3px 10px",
  borderRadius: "999px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const bestSellerBadgeStyle = {
  ...badgeStyle,
  background: "#9f1e1e",
  color: "#ffefdc",
};

const newBadgeStyle = {
  ...badgeStyle,
  background: "linear-gradient(135deg, #6b4d0e, #b9934f)",
  color: "#fdf6e3",
};

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const settings = useSettings();

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await bookApi.getBookById(id);
        setBook(data);
      } catch (err) {
        setError(err.message || "Could not fetch book details");
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [id]);

  if (loading) {
    return <p className="status-text">Loading book details...</p>;
  }

  if (error) {
    return <p className="status-text error">{error}</p>;
  }

  if (!book) {
    return <p className="status-text error">Book not found.</p>;
  }

  const images = getBookImages(book);
  const message = `Hello I am interested in the book ${book.title}`;
  const whatsappUrl = buildWhatsAppUrl({ whatsappNumber: settings.whatsappNumber, message });

  const handleWhatsAppClick = (e) => {
    trackWhatsAppLead({ whatsappNumber: settings.whatsappNumber, book, source: "Book Details" });
    const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (newWindow) {
      e.preventDefault();
    }
  };

  const detailFields = Object.entries(book).filter(([key, value]) => {
    if (EXCLUDED_DETAIL_FIELDS.has(key)) return false;
    if (EXPLICITLY_RENDERED_FIELDS.includes(key)) return false;
    return isValidDisplayValue(value);
  });

  return (
    <motion.section
      className="section"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container details-layout">
        <div className="details-image-wrap">
          {images.length <= 1 ? (
            <img {...getCoverImageProps(images[0] || book.image, DETAILS_SIZES)} alt={book.title} className="details-image" onLoad={markPortraitImage} />
          ) : (
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              loop
              navigation
              pagination={{ clickable: true }}
              className="details-swiper"
              aria-label={`${book.title} cover images`}
            >
              {images.map((src, index) => (
                <SwiperSlide key={src}>
                  <img
                    {...getCoverImageProps(src, DETAILS_SIZES)}
                    alt={`${book.title} — cover ${index + 1} of ${images.length}`}
                    className="details-image"
                    loading={index === 0 ? "eager" : "lazy"}
                    onLoad={markPortraitImage}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <article className="details-card">
          <h1>{book.title}</h1>
          {(book.isBestSeller || isNewBook(book)) && (
            <div style={{ display: "flex", gap: "8px", marginTop: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
              {isNewBook(book) && <span style={newBadgeStyle}>New</span>}
              {book.isBestSeller === true && (
                <span style={bestSellerBadgeStyle}>Best Seller</span>
              )}
            </div>
          )}
          {isValidDisplayValue(book.author) && (
            <p className="book-author">
              Author: <span className="author-chip">{book.author}</span>
            </p>
          )}
          {isValidDisplayValue(book.rating) && (
            <p className="book-rating">
              <FaStar /> {Number(book.rating).toFixed(1)}
            </p>
          )}
          {isValidDisplayValue(book.description) && (
            <p className="book-description">{book.description}</p>
          )}
          {detailFields.length > 0 && (
            <ul className="detail-list">
              {detailFields.map(([key, value]) => (
                <li key={key}>
                  <strong>{formatFieldLabel(key)}:</strong> {renderFieldValue(key, value)}
                </li>
              ))}
            </ul>
          )}
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary" onClick={handleWhatsAppClick}>
            <FaWhatsapp /> Enquire on WhatsApp
          </a>
        </article>
      </div>
    </motion.section>
  );
};

export default BookDetailsPage;
