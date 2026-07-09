import { formatWhatsAppForLink } from "./contactFormatters";
import { API_BASE_URL } from "../config";

export const buildWhatsAppUrl = ({ whatsappNumber, message }) => {
  return `https://wa.me/${formatWhatsAppForLink(whatsappNumber)}?text=${encodeURIComponent(message)}`;
};

export const trackWhatsAppLead = ({ whatsappNumber, book, source, user }) => {
  const message = `Hello I am interested in the book ${book.title}`;
  const lead = {
    bookEnquired: book.title,
    bookId: book._id,
    message,
    source,
    userName: user?.name || "",
    userEmail: user?.email || "",
    userPhone: user?.phone || ""
  };

  const payload = JSON.stringify(lead);

  try {
    const blob = new Blob([payload], { type: "text/plain" });
    const sent = navigator.sendBeacon(`${API_BASE_URL}/whatsapp-leads`, blob);
    if (!sent) throw new Error("sendBeacon failed");
  } catch {
    fetch(`${API_BASE_URL}/whatsapp-leads`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: payload,
      keepalive: true
    }).catch(() => {});
  }

  return buildWhatsAppUrl({ whatsappNumber, message });
};
