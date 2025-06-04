import express from "express";
import {
  addNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";
import upload from "../multerCloudinary.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/add-news", protect, admin, upload.single("image"), addNews);
router.get("/", getAllNews);
router.get("/get-news/:id", getNewsById);
router.patch("/update-news/:id", protect, admin, upload.single("image"), updateNews);
router.delete("/delete-news/:id", protect, admin, deleteNews);

export default router;
