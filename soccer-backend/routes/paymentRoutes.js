import express from "express";
import { processMockPayment } from "../controllers/paymentController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to process the mock payment
router.post("/payment", protect, processMockPayment);

export default router;
