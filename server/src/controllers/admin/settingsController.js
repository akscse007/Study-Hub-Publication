import Settings from "../../models/Settings.js";
import { logActivity } from "../../utils/activityLogger.js";

const defaultSettings = {
  publicationName: "Study-Hub Publication",
  tagline: "Inspiring learners across West Bengal",
  address: "123 College Street, Kolkata — 700073",
  phone: "+91 00000 00000",
  email: "hello@studyhubpublication.com",
  facebook: "https://facebook.com",
  instagram: "",
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

const ALLOWED_KEYS = Object.keys(defaultSettings);

export const updateSettings = async (req, res, next) => {
  try {
    // Whitelist known keys so the publicly-served settings blob can't hold arbitrary data.
    const value = {};
    ALLOWED_KEYS.forEach((key) => {
      if (typeof req.body?.[key] === "string") {
        value[key] = req.body[key].slice(0, 500);
      }
    });
    const record = await Settings.findOneAndUpdate(
      { key: "publication" },
      { key: "publication", value },
      { upsert: true, new: true }
    ).lean();
    await logActivity("Updated settings", "Settings", "publication", "Publication settings updated");
    return res.status(200).json(record.value);
  } catch (error) {
    return next(error);
  }
};
