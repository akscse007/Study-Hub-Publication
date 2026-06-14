import Settings from "../models/Settings.js";

const defaultSettings = {
  publicationName: "Study-Hub Publication",
  tagline: "Inspiring learners across West Bengal",
  address: "123 College Street, Kolkata — 700073",
  phone: "+91 00000 00000",
  email: "hello@studyhubpublication.com",
  facebook: "https://facebook.com",
  whatsappNumber: "919876543210"
};

export const getPublicSettings = async (req, res, next) => {
  try {
    const record = await Settings.findOne({ key: "publication" }).lean();
    return res.status(200).json(record?.value || defaultSettings);
  } catch (error) {
    return next(error);
  }
};
