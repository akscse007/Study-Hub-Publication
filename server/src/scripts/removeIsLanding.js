import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Book from "../models/Book.js";

dotenv.config();

// One-time migration: the "Landing Page" flag (isLanding) was merged into
// "Featured" (isFeatured). Books previously flagged for the landing page are
// promoted to Featured so the landing page keeps showing the same books, then
// the legacy field is removed from every document.
const run = async () => {
  try {
    await connectDB();
    const promoted = await Book.collection.updateMany(
      { isLanding: true },
      { $set: { isFeatured: true } }
    );
    console.log(`Promoted ${promoted.modifiedCount} landing-page book(s) to Featured`);
    const cleaned = await Book.collection.updateMany(
      { isLanding: { $exists: true } },
      { $unset: { isLanding: "" } }
    );
    console.log(`Removed isLanding from ${cleaned.modifiedCount} document(s)`);
  } catch (error) {
    console.error("isLanding migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
