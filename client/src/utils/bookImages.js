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
