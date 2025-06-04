import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// Mock Payment Processing Logic
const processMockPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod } = req.body;

  // Find the order by ID
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Update payment info (simulate the payment process)
  order.paymentInfo.method = paymentMethod;
  order.paymentInfo.status = 'Paid'; // Simulating a successful payment
  order.paymentInfo.paymentId = `mock_payment_id_${orderId}`; // Mock payment ID

  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

export { processMockPayment };
