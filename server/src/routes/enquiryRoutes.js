import express from "express";
import Enquiry from "../models/Enquiry.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    return res.status(201).json(enquiry);
  } catch (error) {
    return next(error);
  }
});

export default router;
