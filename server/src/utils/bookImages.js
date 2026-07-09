const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

// Accepts an array of URLs or a string (newline and/or comma separated).
// Returns trimmed, deduplicated, valid URLs in original order.
export const parseImageList = (input) => {
  const raw = Array.isArray(input) ? input : String(input ?? "").split(/[\n,]+/);
  const seen = new Set();
  const images = [];
  raw.forEach((item) => {
    const url = String(item ?? "").trim();
    if (!url || seen.has(url) || !isValidUrl(url)) return;
    seen.add(url);
    images.push(url);
  });
  return images;
};

// Normalizes a create/update payload so `images` is always a clean array
// and `image` mirrors the first entry (kept for backward compatibility).
// Payloads that don't touch images (partial updates) pass through unchanged.
export const normalizeBookImagesInput = (body = {}) => {
  const payload = { ...body };
  if (payload.images === undefined && payload.image === undefined) {
    return payload;
  }
  const images = parseImageList(payload.images !== undefined ? payload.images : payload.image);
  payload.images = images;
  payload.image = images[0];
  return payload;
};

// Read-side normalizer: older documents only have `image`; fill `images`
// from it so every API response exposes a consistent images array.
export const withImages = (book) => {
  if (!book) return book;
  const plain = typeof book.toObject === "function" ? book.toObject() : book;
  const images =
    Array.isArray(plain.images) && plain.images.length > 0
      ? plain.images
      : [plain.image].filter(Boolean);
  return { ...plain, images, image: images[0] ?? plain.image };
};
