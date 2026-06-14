import express from "express";
import WhatsAppLead from "../models/WhatsAppLead.js";

const router = express.Router();

router.post("/", express.text({ type: "text/plain" }), async (req, res, next) => {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const lead = await WhatsAppLead.create(body);
    return res.status(201).json(lead);
  } catch (error) {
    return next(error);
  }
});

export default router;
