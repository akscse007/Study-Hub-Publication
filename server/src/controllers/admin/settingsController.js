import Settings from "../../models/Settings.js";
import { logActivity } from "../../utils/activityLogger.js";

const defaultSettings = {
  publicationName: "Study-Hub Publication",
  tagline: "Inspiring learners across West Bengal",
  address: "123 College Street, Kolkata — 700073",
  phone: "+91 00000 00000",
  email: "hello@studyhubpublication.com",
  facebook: "https://facebook.com",
  whatsappNumber: "919876543210"
};

export const getSettings = async (req, res, next) => {
  try {
    const record = await Settings.findOne({ key: "publication" }).lean();
    return res.status(200).json(record?.value || defaultSettings);
  } catch (error) {
    return next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const record = await Settings.findOneAndUpdate(
      { key: "publication" },
      { key: "publication", value: req.body },
      { upsert: true, new: true }
    ).lean();
    await logActivity("Updated settings", "Settings", "publication", "Publication settings updated");
    return res.status(200).json(record.value);
  } catch (error) {
    return next(error);
  }
};
