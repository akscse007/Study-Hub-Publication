import { useState } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { fadeUp, viewportConfig } from "../components/motion";
import { useSettings } from "../context/SettingsContext";
import { formatWhatsAppForLink, formatForDisplay, getGoogleMapsUrls } from "../utils/contactFormatters";
import { contactApi } from "../services/api";

const ContactPage = () => {
  const settings = useSettings();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const { embedUrl } = getGoogleMapsUrls(settings.address);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await contactApi.submitContact(form);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <motion.section
      className="section"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container contact-page-grid">
        <article className="contact-card">
          <h1>Contact Us</h1>
          <p>
            <FaPhoneAlt /> {settings.phone}
          </p>
          <p>
            <FaWhatsapp /> {formatForDisplay(settings.whatsappNumber)}
          </p>
          <p>
            <FaEnvelope /> {settings.email}
          </p>
          <p>
            <FaMapMarkerAlt /> {settings.address}
          </p>
          <a href={`https://wa.me/${formatWhatsAppForLink(settings.whatsappNumber)}`} className="chip-link" target="_blank" rel="noreferrer">
            WhatsApp Support
          </a>
          <div className="map-card">
            <iframe
              title={`${settings.publicationName} map`}
              src={embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </article>

        <article className="contact-card">
          <h2>Need Help?</h2>
          <form onSubmit={onSubmit} className="contact-form">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="5"
              required
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            />

            <button type="submit" className="btn-primary" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>
            {submitted ? <p className="success-text">Thank you. We will contact you shortly.</p> : null}
            {error ? <p className="error-text">{error}</p> : null}
          </form>
        </article>
      </div>
    </motion.section>
  );
};

export default ContactPage;
