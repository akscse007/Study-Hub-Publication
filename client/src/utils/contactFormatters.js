export const stripNonDigits = (value) => String(value || "").replace(/\D/g, "");

export const formatPhoneForTel = (phone) => String(phone || "").replace(/\s+/g, "");

export const formatWhatsAppForLink = (whatsappNumber) => stripNonDigits(whatsappNumber);

export const formatForDisplay = (value) => {
  if (!value) return "";
  const str = String(value);
  return str.startsWith("+") ? str : `+${str}`;
};

export const getGoogleMapsUrls = (address) => {
  const encoded = encodeURIComponent(address || "");
  const url = `https://www.google.com/maps?q=${encoded}`;
  return { mapsUrl: url, embedUrl: `${url}&output=embed` };
};
