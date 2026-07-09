import Book from "../../models/Book.js";

export const getInventory = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ stock: 1 }).lean();
    const lowStock = books.filter((b) => b.stock > 0 && b.stock <= 5);
    const outOfStock = books.filter((b) => b.stock === 0);

    return res.status(200).json({ books, lowStock, outOfStock });
  } catch (error) {
    return next(error);
  }
};
