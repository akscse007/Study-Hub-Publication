// Coerces any query/body value to a bounded plain string.
// Blocks NoSQL operator injection (objects/arrays) and oversized inputs.
export const asString = (value, maxLength = 200) => {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLength);
};

// Escapes regex metacharacters so user input can be used safely inside $regex.
export const escapeRegex = (value) => asString(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
