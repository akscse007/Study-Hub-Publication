import multer from "multer";
import sharp from "sharp";
import LandingImage from "../../models/LandingImage.js";
import { logActivity } from "../../utils/activityLogger.js";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
    return cb(new Error("Only JPG, JPEG, PNG or WEBP images are allowed"));
  }
}).single("image");

// PUT /api/admin/landing-images/:slot — accepts JPG/JPEG/PNG/WEBP, converts to
// optimized WEBP and upserts the slot document (the previous image is replaced
// in the same write, so no stale files accumulate).
export const uploadLandingImage = (req, res, next) => {
  const slot = Number(req.params.slot);
  if (![1, 2, 3].includes(slot)) {
    return res.status(400).json({ message: "Slot must be 1, 2 or 3" });
  }
  upload(req, res, async (err) => {
    if (err) {
      const message =
        err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
          ? "Image must be smaller than 10 MB"
          : err.message;
      return res.status(400).json({ message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    let webpBuffer;
    try {
      webpBuffer = await sharp(req.file.buffer)
        .rotate() // respect EXIF orientation
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    } catch {
      return res.status(400).json({ message: "Uploaded file is not a valid image" });
    }

    try {
      const record = await LandingImage.findOneAndUpdate(
        { slot },
        { slot, data: webpBuffer, contentType: "image/webp" },
        { upsert: true, new: true }
      );
      await logActivity(
        "Updated landing image",
        "LandingImage",
        String(slot),
        `Landing page hero image ${slot} replaced`
      );
      return res.status(200).json({ slot, updatedAt: record.updatedAt });
    } catch (error) {
      return next(error);
    }
  });
};
