import Settings from "../../models/Settings.js";
import { logActivity } from "../../utils/activityLogger.js";

const defaultSettings = {
  publicationName: "Study-Hub Publication",
  tagline: "Success and Nothing Less",
  address: "123 College Street, Kolkata — 700073",
  phone: "+91 00000 00000",
  email: "hello@studyhubpublication.com",
  facebook: "https://facebook.com",
  instagram: "",
  youtube: "",
  whatsappNumber: "919876543210",
  readers: ""
};

export const getSettings = async (req, res, next) => {
  try {
    const record = await Settings.findOne({ key: "publication" }).lean();
    // Merge so newly introduced keys (youtube, readers) always exist in the payload.
    return res.status(200).json({ ...defaultSettings, ...record?.value });
  } catch (error) {
    return next(error);
  }
};

const ALLOWED_KEYS = Object.keys(defaultSettings);

export const updateSettings = async (req, res, next) => {
  try {
    // Whitelist known keys so the publicly-served settings blob can't hold arbitrary data.
    // Merge over the stored value so keys saved elsewhere (e.g. readers) survive.
    const existing = await Settings.findOne({ key: "publication" }).lean();
    const value = { ...existing?.value };
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

// Total Readers is editable by any authenticated admin (Settings itself stays
// developer-only), so it gets its own narrow endpoint.
export const updateReaders = async (req, res, next) => {
  try {
    const readers = req.body?.readers;
    if (typeof readers !== "string" || readers.length > 50) {
      return res.status(400).json({ message: "Readers must be a string of at most 50 characters" });
    }
    const record = await Settings.findOneAndUpdate(
      { key: "publication" },
      { $set: { key: "publication", "value.readers": readers } },
      { upsert: true, new: true }
    ).lean();
    await logActivity("Updated settings", "Settings", "publication", "Total Readers updated");
    return res.status(200).json({ readers: record.value?.readers ?? "" });
  } catch (error) {
    return next(error);
  }
};
