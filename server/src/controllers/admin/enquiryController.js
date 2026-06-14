import Enquiry from "../../models/Enquiry.js";
import { logActivity } from "../../utils/activityLogger.js";

export const getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json(enquiries);
  } catch (error) {
    return next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    await logActivity("Updated enquiry status", "Enquiry", enquiry._id.toString(), `Status: ${status}`);
    return res.status(200).json(enquiry);
  } catch (error) {
    return next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id).lean();
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    await logActivity("Deleted enquiry", "Enquiry", enquiry._id.toString(), enquiry.name);
    return res.status(200).json({ message: "Enquiry deleted" });
  } catch (error) {
    return next(error);
  }
};
