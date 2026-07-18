import mongoose from "mongoose";
import Counter from "./Counter.js";

const bookSchema = new mongoose.Schema(
  {
    // Internal auto-increment id; never exposed in the UI, never replaces _id.
    bookId: { type: Number, index: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, trim: true },
    description: { type: String, trim: true },
    // Optional; sparse unique so multiple books may omit it.
    isbn: { type: String, trim: true, index: { unique: true, sparse: true } },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Nursery", "Primary", "General Course", "Madhyamik", "H.S."]
    },
    image: { type: String, required: true },
    // Multiple cover images; `image` mirrors images[0] for backward compatibility.
    images: { type: [String], default: undefined },
    isBestSeller: { type: Boolean, default: false },
    // Featured flag: controls the landing page Featured Books section.
    isFeatured: { type: Boolean, default: false },
    searchCount: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

bookSchema.pre("save", async function assignBookId() {
  if (!this.isNew || this.bookId != null) return;
  const counter = await Counter.findByIdAndUpdate(
    "bookId",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  this.bookId = counter.seq;
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
