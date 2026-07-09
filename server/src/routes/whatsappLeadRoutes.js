import express from "express";
import WhatsAppLead from "../models/WhatsAppLead.js";
import { asString } from "../utils/sanitize.js";

const router = express.Router();

router.post("/", express.text({ type: "text/plain" }), async (req, res, next) => {
  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ message: "Invalid request body" });
      }
    }
    // Whitelist fields so clients can't set status or inject operators.
    const lead = await WhatsAppLead.create({
      phone: asString(body?.phone, 30),
      whatsappNumberUsed: asString(body?.whatsappNumberUsed, 30),
      bookEnquired: asString(body?.bookEnquired, 200),
      bookId: asString(body?.bookId, 50),
      message: asString(body?.message, 2000),
      source: asString(body?.source, 100),
      userName: asString(body?.userName, 120),
      userEmail: asString(body?.userEmail, 200),
      userPhone: asString(body?.userPhone, 30)
    });
    return res.status(201).json(lead);
  } catch (error) {
    return next(error);
  }
});

export default router;
