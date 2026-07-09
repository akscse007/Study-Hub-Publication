import express from "express";
import { subscribeToNotifications, addSubscriber } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/stream", subscribeToNotifications);
router.post("/subscribe", addSubscriber);

export default router;
