import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// Public: published announcements only, newest first.
router.get("/", async (req, res, next) => {
  try {
    const announcements = await Announcement.find({ isPublished: true })
      .select("title content createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(announcements);
  } catch (error) {
    return next(error);
  }
});

export default router;
