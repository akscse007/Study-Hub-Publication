import express from "express";
import { listLandingImages, getLandingImage } from "../controllers/landingImageController.js";

const router = express.Router();

router.get("/", listLandingImages);
router.get("/:slot", getLandingImage);

export default router;
