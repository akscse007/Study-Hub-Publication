import mongoose from "mongoose";

// Named sequences for internal auto-increment ids (e.g. Book.bookId).
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
