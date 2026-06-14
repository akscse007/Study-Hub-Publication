import Book from "../../models/Book.js";
import { logActivity } from "../../utils/activityLogger.js";
import { broadcastNotification, notifySubscribersAboutBook } from "../notificationController.js";

export const getAdminBooks = async (req, res, next) => {
  try {
    const { search, category, stockStatus } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } }
      ];
    }

    if (category) query.category = category;

    if (stockStatus === "low") query.stock = { $gt: 0, $lte: 5 };
    else if (stockStatus === "out") query.stock = 0;

    const books = await Book.find(query).sort({ createdAt: -1 }).lean();
    return res.status(200).json(books);
  } catch (error) {
    return next(error);
  }
};

export const getAdminBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(book);
  } catch (error) {
    return next(error);
  }
};

export const createAdminBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    broadcastNotification("new-book", {
      title: "New book released",
      message: `"${book.title}" by ${book.author} is now available.`,
      bookId: book._id
    });
    broadcastNotification("books-updated", { reason: "new-book" });
    notifySubscribersAboutBook(book);
    await logActivity("Created book", "Book", book._id.toString(), book.title);
    return res.status(201).json(book);
  } catch (error) {
    return next(error);
  }
};

export const updateAdminBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!book) return res.status(404).json({ message: "Book not found" });
    await logActivity("Updated book", "Book", book._id.toString(), book.title);
    return res.status(200).json(book);
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
