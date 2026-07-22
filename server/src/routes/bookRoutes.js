import express from "express";
import { getBookById, getBooks } from "../controllers/bookController.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";
import { asString } from "../utils/sanitize.js";

const router = express.Router();

const publicBookSearchLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  message: "Too many book searches. Please try again shortly."
});

const limitPublicBookSearch = (req, res, next) => {
  const search = asString(req.query.search).trim();
  if (!search) return next();
  return publicBookSearchLimiter(req, res, next);
};

router.get("/", limitPublicBookSearch, getBooks);
router.get("/:id", getBookById);

export default router;

