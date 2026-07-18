const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

// Parses textarea input (one URL per line and/or comma separated) into a
// trimmed, deduplicated list of valid URLs.
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

// Returns every cover image for a book, falling back to the legacy
// single `image` field for older documents.
export const getBookImages = (book) => {
  if (!book) return [];
  if (Array.isArray(book.images) && book.images.length > 0) return book.images;
  return [book.image].filter(Boolean);
};

export const getBookCover = (book) => getBookImages(book)[0];

const isCloudinaryImageUrl = (url) =>
  typeof url === "string" && url.includes("res.cloudinary.com") && url.includes("/image/upload/");

// Rewrites a Cloudinary delivery URL into an optimized on-the-fly variant:
// fit within `width` (c_limit: never crops, never upscales past the original),
// auto quality, auto format. The stored URL is untouched — this runs at render
// time only. Non-Cloudinary URLs pass through.
export const optimizeCloudinaryUrl = (url, width = 400) => {
  if (!isCloudinaryImageUrl(url)) return url;
  const marker = "/image/upload/";
  const insertAt = url.indexOf(marker) + marker.length;
  return `${url.slice(0, insertAt)}c_limit,w_${width},q_auto,f_auto/${url.slice(insertAt)}`;
};

const COVER_WIDTHS = [250, 350, 400, 600];

// Card widths across breakpoints: 1-col mobile → 6-col desktop grid (~180-240px).
const CARD_SIZES = "(max-width: 520px) 92vw, (max-width: 760px) 46vw, (max-width: 1100px) 25vw, 240px";

// Builds responsive <img> props ({ src, srcSet, sizes }) for a cover URL so the
// browser downloads only the width it needs. Non-Cloudinary URLs get plain
// { src } and behave exactly as before.
export const getCoverImageProps = (url, sizes = CARD_SIZES) => {
  if (!isCloudinaryImageUrl(url)) return { src: url };
  return {
    src: optimizeCloudinaryUrl(url, 400),
    srcSet: COVER_WIDTHS.map((w) => `${optimizeCloudinaryUrl(url, w)} ${w}w`).join(", "),
    sizes,
  };
};
