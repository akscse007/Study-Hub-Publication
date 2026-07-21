import Settings from "../models/Settings.js";

const defaultSettings = {
  publicationName: "Study-Hub Publication",
  tagline: "Success and Nothing Less",
  address: "15, Shyamacharan Dey Street, Kolkata - 700073",
  phone: "+91 8910464335",
  email: "studyhubpublication@gmail.com",
  facebook: "https://www.facebook.com/share/1bsC3xYt6S/",
  instagram: "",
  youtube: "",
  whatsappNumber: "+91 8697220830",
  readers: "1 Lakh+"
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
