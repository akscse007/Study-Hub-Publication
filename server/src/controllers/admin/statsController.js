import Book from "../../models/Book.js";
import Enquiry from "../../models/Enquiry.js";
import WhatsAppLead from "../../models/WhatsAppLead.js";
import Announcement from "../../models/Announcement.js";
import ActivityLog from "../../models/ActivityLog.js";

export const getStats = async (req, res, next) => {
  try {
    const [totalBooks, totalEnquiries, totalWhatsAppContacts, totalAnnouncements, recentActivity] =
      await Promise.all([
        Book.countDocuments(),
        Enquiry.countDocuments(),
        WhatsAppLead.countDocuments(),
        Announcement.countDocuments(),
        ActivityLog.find().sort({ createdAt: -1 }).limit(8).lean()
      ]);

    const lowStock = await Book.countDocuments({ stock: { $gt: 0, $lte: 5 } });
    const outOfStock = await Book.countDocuments({ stock: 0 });
    const newEnquiries = await Enquiry.countDocuments({ status: "New" });

    return res.status(200).json({
      totalBooks,
      totalEnquiries,
      totalWhatsAppContacts,
      totalAnnouncements,
      lowStock,
      outOfStock,
      newEnquiries,
      recentActivity
    });
  } catch (error) {
    return next(error);
  }
};
