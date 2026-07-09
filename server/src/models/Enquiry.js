import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    bookInterestedIn: { type: String, trim: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Follow-up", "Closed"],
      default: "New"
    }
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;
