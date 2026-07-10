import Settings from "../models/Settings.js";

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

export const getPublicSettings = async (req, res, next) => {
  try {
    const record = await Settings.findOne({ key: "publication" }).lean();
    // Merge so newly introduced keys (youtube, readers) always exist in the payload.
    return res.status(200).json({ ...defaultSettings, ...record?.value });
  } catch (error) {
    return next(error);
  }
};
