import express from "express";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  toggleAdminUserStatus
} from "../../controllers/admin/adminUserController.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", requireRole("subadmin"), getAdminUsers);
router.post("/", requireRole("subadmin"), createAdminUser);
router.put("/:id", requireRole("subadmin"), updateAdminUser);
router.delete("/:id", requireRole("subadmin"), deleteAdminUser);
router.patch("/:id/toggle-status", requireRole("subadmin"), toggleAdminUserStatus);

export default router;
