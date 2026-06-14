import Book from "../../models/Book.js";
import Settings from "../../models/Settings.js";
import { logActivity } from "../../utils/activityLogger.js";

export const getContent = async (req, res, next) => {
  try {
    const [featuredBooks, homepageSettings] = await Promise.all([
      Book.find({ isFeatured: true }).limit(8).lean(),
      Settings.findOne({ key: "homepage" }).lean()
    ]);

    return res.status(200).json({
      featuredBooks,
      homepage: homepageSettings?.value || {}
    });
  } catch (error) {
    return next(error);
  }
};

export const updateContent = async (req, res, next) => {
  try {
    const { featuredBookIds, homepage } = req.body;

    if (Array.isArray(featuredBookIds)) {
      await Book.updateMany({}, { isFeatured: false });
      await Book.updateMany({ _id: { $in: featuredBookIds } }, { isFeatured: true });
    }

    if (homepage) {
      await Settings.findOneAndUpdate(
        { key: "homepage" },
        { key: "homepage", value: homepage },
        { upsert: true, new: true }
      );
    }

    await logActivity("Updated content", "Content", "homepage", "Homepage content updated");
    return res.status(200).json({ message: "Content updated" });
  } catch (error) {
    return next(error);
  }
};
