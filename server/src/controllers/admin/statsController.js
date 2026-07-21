import Book from "../../models/Book.js";
import WhatsAppLead from "../../models/WhatsAppLead.js";
import Announcement from "../../models/Announcement.js";
import ActivityLog from "../../models/ActivityLog.js";

export const getStats = async (req, res, next) => {
  try {
    const [totalBooks, totalWhatsAppContacts, totalAnnouncements, recentActivity] =
      await Promise.all([
        Book.countDocuments(),
        WhatsAppLead.countDocuments(),
        Announcement.countDocuments(),
        ActivityLog.find().sort({ createdAt: -1 }).limit(8).lean()
      ]);

    const lowStock = await Book.countDocuments({ stock: { $gt: 0, $lte: 5 } });
    const outOfStock = await Book.countDocuments({ stock: 0 });

    return res.status(200).json({
      totalBooks,
      totalWhatsAppContacts,
      totalAnnouncements,
      lowStock,
      outOfStock,
      recentActivity
    });
  } catch (error) {
    return next(error);
  }
};
