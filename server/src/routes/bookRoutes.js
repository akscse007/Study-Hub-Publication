import express from "express";
import { getBookById, getBooks } from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);

export default router;

