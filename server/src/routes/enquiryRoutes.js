import express from "express";
import Enquiry from "../models/Enquiry.js";
import { sendContactNotification } from "../utils/emailService.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const enquiry = await Enquiry.create(req.body);

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
