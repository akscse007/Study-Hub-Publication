import express from "express";
import Enquiry from "../models/Enquiry.js";
import { asString } from "../utils/sanitize.js";
import { sendContactNotification } from "../utils/emailService.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    // Whitelist fields so clients can't set status or inject operators.
    const payload = {
      name: asString(req.body?.name, 120),
      phone: asString(req.body?.phone, 30),
      email: asString(req.body?.email, 200),
      message: asString(req.body?.message, 5000),
      bookInterestedIn: asString(req.body?.bookInterestedIn, 200)
    };
    if (!payload.name || !payload.phone || !payload.message) {
      return res.status(400).json({ message: "Name, phone, and message are required" });
    }
    const enquiry = await Enquiry.create(payload);

    try {
      await sendContactNotification({
        name: enquiry.name,
        email: enquiry.email || "Not provided",
        message: enquiry.message
      });
    } catch (emailError) {
      console.error("[Enquiry] Enquiry saved, but notification email failed:");
      console.error(emailError.stack);
    }

    return res.status(201).json(enquiry);
  } catch (error) {
    return next(error);
  }
});

export default router;
