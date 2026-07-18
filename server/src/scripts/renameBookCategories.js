import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Book from "../models/Book.js";

dotenv.config();

// One-time migration: rename the two legacy book category values only.
// Run "Nursery" first so old "Pre School" documents do not get renamed twice.
const run = async () => {
  try {
    await connectDB();
    const primary = await Book.collection.updateMany(
      { category: "Nursery" },
      { $set: { category: "Primary" } }
    );
    console.log(`Renamed ${primary.modifiedCount} Nursery book(s) to Primary`);

    const nursery = await Book.collection.updateMany(
      { category: "Pre School" },
      { $set: { category: "Nursery" } }
    );
    console.log(`Renamed ${nursery.modifiedCount} Pre School book(s) to Nursery`);
  } catch (error) {
    console.error("Category rename migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
