import express from "express";
import { listSellers, parseSearchCoords } from "../utils/sellers.js";

const router = express.Router();

// Public: seller directory; ?lat=&lng= orders results by geographic proximity.
router.get("/", async (req, res, next) => {
  try {
    const sellers = await listSellers(parseSearchCoords(req.query));
    return res.status(200).json(sellers);
  } catch (error) {
    return next(error);
  }
});

export default router;
