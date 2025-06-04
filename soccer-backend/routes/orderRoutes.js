import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  processPayment
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/process-payment", protect, processPayment);

router.post("/create-order/", protect, createOrder);
router.get("/get-order/:id", protect, getOrderById);
router.get("/", protect, admin, getAllOrders);
// router.get("/get-user-order/:userId", protect, getUserOrders);
router.get("/get-user-order", protect, getUserOrders);
router.patch("/update-order/:id/status", protect, admin, updateOrderStatus);

export default router;
