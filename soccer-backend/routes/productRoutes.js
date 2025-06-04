import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  addReviewToProduct,
  getReviewsForProduct,
  getAllReviews,
  updateProductReview,
  deleteProductReview,
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../multerCloudinary.js";

const router = express.Router();

// Product routes
router.get("/", getAllProducts);
router.post("/create-product", protect, admin, upload.array('images', 5), createProduct);

router.get("/get-product/:id", getProductById);
router.patch("/update-product/:id", protect, admin, upload.array('images', 5), updateProduct);
router.delete("/delete-product/:id", protect, admin, deleteProduct);

// Review routes
router.post("/:productId/reviews", protect, addReviewToProduct);
router.get("/reviews", getAllReviews);
router.patch("/:productId/reviews/:reviewId", protect, updateProductReview);
router.delete("/:productId/reviews/:reviewId", protect, deleteProductReview);
router.get("/:productId/reviews", getReviewsForProduct);

export default router;
