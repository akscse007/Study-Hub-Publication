import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Book from "../models/Book.js";

dotenv.config();

// One-time migration: ISBN became optional, so the old non-sparse unique
// index (which treats missing ISBNs as duplicate nulls) must be replaced
// with the sparse unique index declared in the Book schema.
const run = async () => {
  try {
    await connectDB();
    const collection = Book.collection;
    const indexes = await collection.indexes();
    const old = indexes.find((idx) => idx.name === "isbn_1" && !idx.sparse);
    if (old) {
      await collection.dropIndex("isbn_1");
      console.log("Dropped old non-sparse isbn_1 index");
    } else {
      console.log("No non-sparse isbn_1 index found — nothing to drop");
    }
    await Book.syncIndexes();
    console.log("Indexes synced:", (await collection.indexes()).map((idx) => idx.name).join(", "));
  } catch (error) {
    console.error("Index migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
