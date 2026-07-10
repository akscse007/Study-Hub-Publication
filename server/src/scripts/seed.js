import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Book from "../models/Book.js";
import seedBooks from "../data/seedBooks.js";

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();
    await Book.deleteMany({});
    // create() (not insertMany) so the bookId auto-increment pre-save hook runs.
    await Book.create(seedBooks);
    console.log("Books seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

runSeed();

