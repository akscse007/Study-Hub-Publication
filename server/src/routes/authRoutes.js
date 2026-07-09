import express from "express";
import { login, logout, me } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Brute-force protection: 10 login attempts per IP per 15 minutes.
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again in 15 minutes."
});

router.post("/login", loginLimiter, login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;
