import WhatsAppLead from "../../models/WhatsAppLead.js";
import { logActivity } from "../../utils/activityLogger.js";

export const getWhatsAppLeads = async (req, res, next) => {
  try {
    const leads = await WhatsAppLead.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json(leads);
  } catch (error) {
    return next(error);
  }
};

export const updateWhatsAppLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const lead = await WhatsAppLead.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    await logActivity("Updated WhatsApp lead status", "WhatsAppLead", lead._id.toString(), `Status: ${status}`);
    return res.status(200).json(lead);
  } catch (error) {
    return next(error);
  }
};

export const deleteWhatsAppLead = async (req, res, next) => {
  try {
    const lead = await WhatsAppLead.findByIdAndDelete(req.params.id).lean();
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    await logActivity("Deleted WhatsApp lead", "WhatsAppLead", lead._id.toString(), lead.phone);
    return res.status(200).json({ message: "Lead deleted" });
  } catch (error) {
    return next(error);
  }
};
