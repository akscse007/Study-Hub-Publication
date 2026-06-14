import Announcement from "../../models/Announcement.js";
import { logActivity } from "../../utils/activityLogger.js";

export const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json(announcements);
  } catch (error) {
    return next(error);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.create(req.body);
    await logActivity("Created announcement", "Announcement", announcement._id.toString(), announcement.title);
    return res.status(201).json(announcement);
  } catch (error) {
    return next(error);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });
    await logActivity("Updated announcement", "Announcement", announcement._id.toString(), announcement.title);
    return res.status(200).json(announcement);
  } catch (error) {
    return next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id).lean();
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });
    await logActivity("Deleted announcement", "Announcement", announcement._id.toString(), announcement.title);
    return res.status(200).json({ message: "Announcement deleted" });
  } catch (error) {
    return next(error);
  }
};
