import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";
import { getStats } from "../../controllers/admin/statsController.js";
import {
  getAdminBooks,
  getAdminBookById,
  createAdminBook,
  updateAdminBook,
  deleteAdminBook
} from "../../controllers/admin/bookController.js";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from "../../controllers/admin/announcementController.js";
import {
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry
} from "../../controllers/admin/enquiryController.js";
import {
  getWhatsAppLeads,
  updateWhatsAppLeadStatus,
  deleteWhatsAppLead
} from "../../controllers/admin/whatsappLeadController.js";
import { getInventory } from "../../controllers/admin/inventoryController.js";
import { getActivityLogs } from "../../controllers/admin/activityLogController.js";
import { getSettings, updateSettings, updateReaders } from "../../controllers/admin/settingsController.js";
import { uploadLandingImage } from "../../controllers/admin/landingImageController.js";
import {
  getAdminSellers,
  createAdminSeller,
  updateAdminSeller,
  deleteAdminSeller
} from "../../controllers/admin/sellerController.js";
import adminUserRoutes from "./adminUserRoutes.js";

const router = express.Router();

router.use(authenticate);

router.get("/stats", getStats);

router.get("/books", getAdminBooks);
router.get("/books/:id", getAdminBookById);
router.post("/books", createAdminBook);
router.put("/books/:id", updateAdminBook);
router.delete("/books/:id", deleteAdminBook);

router.get("/announcements", getAnnouncements);
router.post("/announcements", createAnnouncement);
router.put("/announcements/:id", updateAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

router.get("/sellers", getAdminSellers);
router.post("/sellers", createAdminSeller);
router.put("/sellers/:id", updateAdminSeller);
router.delete("/sellers/:id", deleteAdminSeller);

router.get("/enquiries", getEnquiries);
router.patch("/enquiries/:id/status", updateEnquiryStatus);
router.delete("/enquiries/:id", deleteEnquiry);

router.get("/whatsapp-leads", getWhatsAppLeads);
router.patch("/whatsapp-leads/:id/status", updateWhatsAppLeadStatus);
router.delete("/whatsapp-leads/:id", deleteWhatsAppLead);

router.get("/inventory", getInventory);

router.get("/activity-logs", getActivityLogs);

router.get("/settings", getSettings);
router.put("/settings", requireRole("superadmin"), updateSettings);
router.put("/readers", updateReaders);
router.put("/landing-images/:slot", uploadLandingImage);

router.use("/users", adminUserRoutes);

export default router;
