export const stripNonDigits = (value) => String(value || "").replace(/\D/g, "");

export const formatPhoneForTel = (phone) => String(phone || "").replace(/\s+/g, "");

export const formatWhatsAppForLink = (whatsappNumber) => stripNonDigits(whatsappNumber);

export const formatForDisplay = (value) => {
  if (!value) return "";
  const str = String(value);
  return str.startsWith("+") ? str : `+${str}`;
};

// Shared compose-email link (landing page + main site): opens the visitor's
// default mail client addressed to the admin-configured publication email,
// with the subject prefilled. Returns "" when no email is configured so
// callers can hide the button instead of rendering a broken mailto.
export const buildContactMailto = (settings) => {
  if (!settings?.email) return "";
  const subject = encodeURIComponent(`Enquiry — ${settings.publicationName || "Publication"}`);
  return `mailto:${settings.email}?subject=${subject}`;
};

export const getGoogleMapsUrls = (address) => {
  const encoded = encodeURIComponent(address || "");
  const url = `https://www.google.com/maps?q=${encoded}`;
  return { mapsUrl: url, embedUrl: `${url}&output=embed` };
};
