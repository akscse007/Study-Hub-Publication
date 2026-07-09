import mongoose from "mongoose";

const whatsAppLeadSchema = new mongoose.Schema(
  {
    phone: { type: String, trim: true },
    whatsappNumberUsed: { type: String, trim: true },
    bookEnquired: { type: String, trim: true },
    bookId: { type: String, trim: true },
    message: { type: String, trim: true },
    source: { type: String, trim: true },
    userName: { type: String, trim: true },
    userEmail: { type: String, trim: true },
    userPhone: { type: String, trim: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Follow-up", "Closed"],
      default: "New"
    }
  },
  { timestamps: true }
);

const WhatsAppLead = mongoose.model("WhatsAppLead", whatsAppLeadSchema);

export default WhatsAppLead;
