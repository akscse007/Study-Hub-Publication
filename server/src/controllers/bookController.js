import Book from "../models/Book.js";
import { broadcastNotification } from "./notificationController.js";

export const getBooks = async (req, res, next) => {
  try {
    const { category, search, bestSeller, sortBy, limit } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (bestSeller === "true") {
      query.isBestSeller = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } }
      ];
    }

    const sort = {};
    if (sortBy === "mostSearched") {
      sort.searchCount = -1;
    } else {
      sort.createdAt = -1;
    }

    const normalizedLimit = Number(limit) > 0 ? Math.min(Number(limit), 100) : 0;
    let dataQuery = Book.find(query).select("-isbn").sort(sort);
    if (normalizedLimit) {
      dataQuery = dataQuery.limit(normalizedLimit);
    }

    const books = await dataQuery;

    if (search && books.length) {
      const bookIds = books.map((book) => book._id);
      await Book.updateMany({ _id: { $in: bookIds } }, { $inc: { searchCount: 1 } });
      books.forEach((book) => {
        book.searchCount += 1;
      });
      broadcastNotification("books-updated", { reason: "search" });
    }

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).select("-isbn");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json(book);
  } catch (error) {
    return next(error);
  }
};

