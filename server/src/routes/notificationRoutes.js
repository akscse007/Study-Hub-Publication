import express from "express";
import { subscribeToNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/stream", subscribeToNotifications);

export default router;
