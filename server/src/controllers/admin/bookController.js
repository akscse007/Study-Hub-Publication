import Book from "../../models/Book.js";
import { logActivity } from "../../utils/activityLogger.js";
import { normalizeBookImagesInput, withImages } from "../../utils/bookImages.js";
import { asString, escapeRegex } from "../../utils/sanitize.js";
import { broadcastNotification, notifySubscribersAboutBook } from "../notificationController.js";

// Malformed numerics (NaN/null from older documents or buggy clients) otherwise
// surface as a Mongoose CastError → generic 500.
const invalidNumericField = (payload) =>
  ["rating", "price", "stock"].find((key) => payload[key] !== undefined && !Number.isFinite(Number(payload[key])));

export const getAdminBooks = async (req, res, next) => {
  try {
    const { search, category, stockStatus } = req.query;
    const query = {};

    const safeSearch = escapeRegex(search);
    if (safeSearch) {
      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { author: { $regex: safeSearch, $options: "i" } },
        { isbn: { $regex: safeSearch, $options: "i" } }
      ];
    }

    if (category) query.category = asString(category);

    if (stockStatus === "low") query.stock = { $gt: 0, $lte: 5 };
    else if (stockStatus === "out") query.stock = 0;

    const books = await Book.find(query).sort({ createdAt: -1 }).lean();
    return res.status(200).json(books.map(withImages));
  } catch (error) {
    return next(error);
  }
};

export const getAdminBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(withImages(book));
  } catch (error) {
    return next(error);
  }
};

export const createAdminBook = async (req, res, next) => {
  try {
    const payload = normalizeBookImagesInput(req.body);
    if (!payload.images?.length) {
      return res.status(400).json({ message: "At least one valid image URL is required" });
    }
    const badField = invalidNumericField(payload);
    if (badField) return res.status(400).json({ message: `Invalid numeric value for ${badField}` });
    // ISBN is optional; an empty string would collide on the sparse unique index.
    if (typeof payload.isbn === "string" && !payload.isbn.trim()) delete payload.isbn;
    // Author is optional; don't store empty strings.
    if (typeof payload.author === "string" && !payload.author.trim()) delete payload.author;
    const book = await Book.create(payload);
    broadcastNotification("new-book", {
      title: "New book released",
      message: `"${book.title}"${book.author ? ` by ${book.author}` : ""} is now available.`,
      bookId: book._id
    });
    broadcastNotification("books-updated", { reason: "new-book" });
    notifySubscribersAboutBook(book);
    await logActivity("Created book", "Book", book._id.toString(), book.title);
    return res.status(201).json(withImages(book));
  } catch (error) {
    return next(error);
  }
};

export const updateAdminBook = async (req, res, next) => {
  try {
    const payload = normalizeBookImagesInput(req.body);
    if ((payload.images !== undefined || payload.image !== undefined) && !payload.images?.length) {
      return res.status(400).json({ message: "At least one valid image URL is required" });
    }
    const badField = invalidNumericField(payload);
    if (badField) return res.status(400).json({ message: `Invalid numeric value for ${badField}` });
    // Clearing the optional ISBN must remove the field (sparse unique index),
    // not store an empty string.
    const update = { ...payload };
    if (typeof update.isbn === "string" && !update.isbn.trim()) {
      delete update.isbn;
      update.$unset = { ...update.$unset, isbn: 1 };
    }
    // Author is optional; clearing it removes the field instead of storing "".
    if (typeof update.author === "string" && !update.author.trim()) {
      delete update.author;
      update.$unset = { ...update.$unset, author: 1 };
    }
    const book = await Book.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    }).lean();
    if (!book) return res.status(404).json({ message: "Book not found" });
    await logActivity("Updated book", "Book", book._id.toString(), book.title);
    return res.status(200).json(withImages(book));
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id).lean();
    if (!book) return res.status(404).json({ message: "Book not found" });
    await logActivity("Deleted book", "Book", book._id.toString(), book.title);
    return res.status(200).json({ message: "Book deleted" });
  } catch (error) {
    return next(error);
  }
};
