import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, trim: true, unique: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    category: {
      type: String,
      required: true,
      enum: ["Pre School", "Nursery", "General Course", "Madhyamik", "H.S."]
    },
    image: { type: String, required: true },
    // Multiple cover images; `image` mirrors images[0] for backward compatibility.
    images: { type: [String], default: undefined },
    isBestSeller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    searchCount: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
