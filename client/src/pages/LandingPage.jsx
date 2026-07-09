import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import {
  FaArrowRight,
  FaBookOpen,
  FaEnvelope,
  FaFacebookF,
  FaFeatherAlt,
  FaInstagram,
  FaLayerGroup,
  FaLock,
  FaStar,
  FaWhatsapp
} from "react-icons/fa";
import { SettingsProvider, useSettings } from "../context/SettingsContext";
import { useBooks } from "../hooks/useBooks";
import { fadeUp, staggerContainer } from "../components/motion";
import { getBookCover } from "../utils/bookImages";
import { isNewBook } from "../utils/isNewBook";
import { buildContactMailto, formatWhatsAppForLink } from "../utils/contactFormatters";
import heroImage1 from "../assets/landing/image1.webp";
import heroImage2 from "../assets/landing/image2.webp";
import heroImage3 from "../assets/landing/image3.webp";
import "./landing.css";

const revealViewport = { once: true, amount: 0.2 };

const LandingBookCard = ({ book }) => (
  <motion.article className="lp-book-card" variants={fadeUp}>
    <Link to={`/books/${book._id}`} className="lp-book-link" aria-label={`View details for ${book.title}`}>
      <div className="lp-book-cover">
        <img src={getBookCover(book)} alt={book.title} loading="lazy" />
        <span className="lp-book-category">{book.category}</span>
        {isNewBook(book) && <span className="lp-book-new">New</span>}
      </div>
      <div className="lp-book-info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <span className="lp-book-rating" aria-label={`Rated ${Number(book.rating).toFixed(1)} out of 5`}>
          <FaStar aria-hidden="true" /> {Number(book.rating).toFixed(1)}
        </span>
      </div>
    </Link>
  </motion.article>
);

const SocialLinks = ({ settings, className }) => {
  const links = [
    { key: "facebook", href: settings.facebook, label: "Facebook", icon: <FaFacebookF /> },
    { key: "instagram", href: settings.instagram, label: "Instagram", icon: <FaInstagram /> },
    {
      key: "whatsapp",
      href: settings.whatsappNumber ? `https://wa.me/${formatWhatsAppForLink(settings.whatsappNumber)}` : "",
      label: "WhatsApp",
      icon: <FaWhatsapp />
    },
    // Shared compose flow (also used by the main site's Quick Contact ribbon).
    { key: "email", href: buildContactMailto(settings), label: "Email", icon: <FaEnvelope /> }
  ].filter((link) => link.href);

  if (!links.length) return null;

  return (
    <div className={className}>
      {links.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target={link.key === "email" ? undefined : "_blank"}
          rel="noreferrer"
          aria-label={link.label}
          title={link.label}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

// Local hero collage assets — bundled by Vite, independent of catalogue data.
const HERO_IMAGES = [heroImage1, heroImage2, heroImage3];

const HeroFloatingBooks = () => {
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x1 = useTransform(mx, [-1, 1], [-14, 14]);
  const y1 = useTransform(my, [-1, 1], [-10, 10]);
  const x2 = useTransform(mx, [-1, 1], [10, -10]);
  const y2 = useTransform(my, [-1, 1], [12, -12]);
  const x3 = useTransform(mx, [-1, 1], [-6, 6]);
  const y3 = useTransform(my, [-1, 1], [8, -8]);
  const offsets = [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    { x: x3, y: y3 }
  ];

  const handleMouseMove = (e) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  return (
    <div className="lp-hero-visual" onMouseMove={handleMouseMove} aria-hidden="true">
      {HERO_IMAGES.map((src, index) => (
        <motion.div
          key={src}
          className={`lp-float-card lp-float-${index + 1}`}
          style={reduceMotion ? undefined : offsets[index]}
        >
          <img src={src} alt="" decoding="async" />
        </motion.div>
      ))}
    </div>
  );
};

const LandingContent = () => {
  const settings = useSettings();
  const { books, loading } = useBooks();

  const featuredBooks = useMemo(() => books.filter((book) => book.isFeatured).slice(0, 4), [books]);
  // Latest Books = newest four; server sorts createdAt desc by default,
  // so a newly added book automatically pushes the oldest out.
  const latestBooks = useMemo(() => books.slice(0, 4), [books]);
  const categoryCount = useMemo(() => new Set(books.map((book) => book.category)).size, [books]);
  const bestSellerCount = useMemo(() => books.filter((book) => book.isBestSeller).length, [books]);

  const highlights = [
    {
      icon: <FaLayerGroup />,
      title: "Complete Learning Range",
      body:
        categoryCount > 0
          ? `A curated catalogue spanning ${categoryCount} categories — from Pre-School foundations to Higher Secondary board preparation.`
          : "A curated catalogue spanning Pre-School foundations to Higher Secondary board preparation."
    },
    {
      icon: <FaFeatherAlt />,
      title: "Crafted by Educators",
      body: "Every title is developed with teachers, curriculum planners, and subject specialists for classroom-ready quality."
    },
    {
      icon: <FaWhatsapp />,
      title: "Direct Enquiries",
      body: "Reach us instantly on WhatsApp for any book — availability, pricing, and bulk orders answered personally."
    }
  ];

  return (
    <div className="lp">
      {/* Decorative layered background */}
      <div className="lp-bg" aria-hidden="true">
        <span className="lp-blob lp-blob-1" />
        <span className="lp-blob lp-blob-2" />
        <span className="lp-blob lp-blob-3" />
      </div>

      <header className="lp-nav">
        <span className="lp-nav-brand">
          <FaBookOpen aria-hidden="true" /> {settings.publicationName}
        </span>
        <div className="lp-nav-right">
          <SocialLinks settings={settings} className="lp-nav-social" />
          <Link to="/admin/login" className="lp-nav-admin">
            <FaLock aria-hidden="true" /> Admin Login
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="lp-hero" aria-labelledby="lp-hero-title">
          <motion.div
            className="lp-hero-copy"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.p className="lp-kicker" variants={fadeUp}>
              <FaBookOpen aria-hidden="true" /> {settings.tagline}
            </motion.p>
            <motion.h1 id="lp-hero-title" variants={fadeUp}>
              {settings.publicationName}
            </motion.h1>
            <motion.p className="lp-hero-sub" variants={fadeUp}>
              An educational publishing house crafting thoughtful books for early learners and
              secondary-level students — built with teachers, trusted by schools.
            </motion.p>
            <motion.div className="lp-hero-actions" variants={fadeUp}>
              <Link to="/home" className="lp-btn lp-btn-primary">
                Explore <FaArrowRight aria-hidden="true" />
              </Link>
              <Link to="/books" className="lp-btn lp-btn-ghost">
                Browse Books
              </Link>
            </motion.div>
          </motion.div>
          <HeroFloatingBooks />
        </section>

        {/* Publication introduction */}
        <motion.section
          className="lp-section lp-intro"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          aria-labelledby="lp-intro-title"
        >
          <p className="lp-section-kicker">The Publication</p>
          <h2 id="lp-intro-title">Inspiring minds, shaping futures</h2>
          <p className="lp-section-sub">
            {settings.publicationName} publishes academic resources developed with curriculum planners
            and subject specialists — helping students, guardians, and schools find the right book for
            every stage of learning.
          </p>
        </motion.section>

        {/* Featured books */}
        {featuredBooks.length > 0 && (
          <section className="lp-section" aria-labelledby="lp-featured-title">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
            >
              <p className="lp-section-kicker">Handpicked</p>
              <h2 id="lp-featured-title">Featured Books</h2>
            </motion.div>
            <motion.div
              className="lp-book-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
            >
              {featuredBooks.map((book) => (
                <LandingBookCard key={book._id} book={book} />
              ))}
            </motion.div>
          </section>
        )}

        {/* Latest books */}
        {latestBooks.length > 0 && (
          <section className="lp-section" aria-labelledby="lp-latest-title">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
            >
              <p className="lp-section-kicker">Fresh off the press</p>
              <h2 id="lp-latest-title">Latest Books</h2>
            </motion.div>
            <motion.div
              className="lp-book-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
            >
              {latestBooks.map((book) => (
                <LandingBookCard key={book._id} book={book} />
              ))}
            </motion.div>
            <motion.div
              className="lp-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
            >
              <Link to="/books" className="lp-btn lp-btn-ghost">
                View the full catalogue <FaArrowRight aria-hidden="true" />
              </Link>
            </motion.div>
          </section>
        )}

        {/* About + stats */}
        <motion.section
          className="lp-section lp-about"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          aria-labelledby="lp-about-title"
        >
          <div className="lp-about-card">
            <div>
              <p className="lp-section-kicker">About the Publication</p>
              <h2 id="lp-about-title">Publishing excellence, one book at a time</h2>
              <p className="lp-section-sub">
                Our editorial team works with teachers, curriculum planners, and subject specialists to
                deliver high-quality academic resources for early learners through higher secondary.
              </p>
              <ul className="lp-contact-list">
                {settings.address && <li>{settings.address}</li>}
                {settings.phone && <li>{settings.phone}</li>}
                {settings.email && (
                  <li>
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </li>
                )}
              </ul>
            </div>
            {books.length > 0 && (
              <dl className="lp-stats">
                <div className="lp-stat">
                  <dt>Titles in catalogue</dt>
                  <dd>{books.length}</dd>
                </div>
                <div className="lp-stat">
                  <dt>Learning categories</dt>
                  <dd>{categoryCount}</dd>
                </div>
                {bestSellerCount > 0 && (
                  <div className="lp-stat">
                    <dt>Best sellers</dt>
                    <dd>{bestSellerCount}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </motion.section>

        {/* Why choose us */}
        <section className="lp-section" aria-labelledby="lp-why-title">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <p className="lp-section-kicker">Why Choose Us</p>
            <h2 id="lp-why-title">Built around learners</h2>
          </motion.div>
          <motion.div
            className="lp-highlight-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            {highlights.map((item) => (
              <motion.article key={item.title} className="lp-highlight-card" variants={fadeUp}>
                <span className="lp-highlight-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* CTA */}
        <motion.section
          className="lp-section lp-cta"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          aria-labelledby="lp-cta-title"
        >
          <div className="lp-cta-card">
            <h2 id="lp-cta-title">Find the right book for every stage</h2>
            <p>Step inside the full {settings.publicationName} experience.</p>
            <Link to="/home" className="lp-btn lp-btn-primary lp-btn-lg">
              Explore <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        </motion.section>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <p className="lp-footer-name">{settings.publicationName}</p>
            {settings.tagline && <p className="lp-footer-tagline">{settings.tagline}</p>}
          </div>
          <SocialLinks settings={settings} className="lp-footer-social" />
          <p className="lp-footer-note">
            © {new Date().getFullYear()} {settings.publicationName}. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Keeps layout stable while books load; sections simply appear when data arrives. */}
      {loading && <span className="lp-visually-hidden" role="status">Loading books…</span>}
    </div>
  );
};

const LandingPage = () => (
  <SettingsProvider>
    <LandingContent />
  </SettingsProvider>
);

export default LandingPage;
