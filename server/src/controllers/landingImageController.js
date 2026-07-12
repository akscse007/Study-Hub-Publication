import LandingImage from "../models/LandingImage.js";

const parseSlot = (raw) => {
  const slot = Number(raw);
  return [1, 2, 3].includes(slot) ? slot : null;
};

// Metadata only — the client uses updatedAt as a cache-busting version.
export const listLandingImages = async (req, res, next) => {
  try {
    const images = await LandingImage.find({}, "slot updatedAt").sort({ slot: 1 }).lean();
    return res.status(200).json(images.map(({ slot, updatedAt }) => ({ slot, updatedAt })));
  } catch (error) {
    return next(error);
  }
};

export const getLandingImage = async (req, res, next) => {
  try {
    const slot = parseSlot(req.params.slot);
    if (!slot) {
      return res.status(400).json({ message: "Slot must be 1, 2 or 3" });
    }
    const image = await LandingImage.findOne({ slot });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.set("Content-Type", image.contentType || "image/webp");
    // URLs carry a ?v= cache-buster, so a long client cache is safe.
    res.set("Cache-Control", "public, max-age=86400");
    return res.status(200).send(image.data);
  } catch (error) {
    return next(error);
  }
};
