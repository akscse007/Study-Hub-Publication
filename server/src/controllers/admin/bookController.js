import Book from "../../models/Book.js";
import { logActivity } from "../../utils/activityLogger.js";
import { normalizeBookImagesInput, withImages } from "../../utils/bookImages.js";
import { asString, escapeRegex } from "../../utils/sanitize.js";
import { broadcastNotification, notifySubscribersAboutBook } from "../notificationController.js";

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
    const book = await Book.create(payload);
    broadcastNotification("new-book", {
      title: "New book released",
      message: `"${book.title}" by ${book.author} is now available.`,
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
    const book = await Book.findByIdAndUpdate(req.params.id, payload, {
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
