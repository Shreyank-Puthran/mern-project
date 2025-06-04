import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

// Create Order
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingInfo, paymentInfo } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  // Extract product IDs
  const productIds = orderItems.map((item) => item.product);

  // Fetch all related products from DB
  const products = await Product.find({ _id: { $in: productIds } });

  // Validate and calculate totalPrice
  let totalPrice = 0;

  for (const item of orderItems) {
    const product = products.find(
      (p) => p._id.toString() === item.product.toString()
    );
    if (!product) {
      res.status(400);
      throw new Error(`Product not found: ${item.product}`);
    }

    totalPrice += product.price * item.quantity;
  }

  // Create order
  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingInfo,
    paymentInfo,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// Get Order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name price");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Ensure the user is authorized to view this order
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(401);
    throw new Error("Not authorized to view this order");
  }
  console.log("Logged-in User ID:", req.user._id);
  console.log("Order User ID:", order.user);
  res.json(order);
});

// Get Orders for a Specific User
// access: Private (User)
// const getUserOrders = asyncHandler(async (req, res) => {
//   // Ensure the user is requesting their own orders
//   if (req.user._id.toString() !== req.params.userId) {
//     res.status(401);
//     throw new Error("Not authorized to view these orders");
//   }

//   const orders = await Order.find({ user: req.params.userId })
//     .sort({ createdAt: -1 })
//     .populate("orderItems.product", "name price");

//   res.json(orders);
// });


// Based on token
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("orderItems.product", "name price imageUrls");

  res.json(orders);
});

// Get All Orders (Admin only)
// access: Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  // Check if the user is an admin
  if (req.user.role !== "admin") {
    res.status(401);
    throw new Error("Not authorized to view all orders");
  }

  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

// Update Order Status (Admin only)
// access: Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Validate the status
  const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check if the user is an admin
  if (req.user.role !== "admin") {
    res.status(401);
    throw new Error("Not authorized to update order status");
  }

  // Update the order status directly and save it
  order.orderStatus = status;
  await order.save();

  // Return the updated order
  res.json(order);
});

const processPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod } = req.body;

  // Validate if the order ID is provided
  if (!orderId || !paymentMethod) {
    res.status(400);
    throw new Error("Order ID and payment method are required");
  }

  // Find the order by ID
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Simulate a mock payment process (In a real-world scenario, you'll use a payment provider like Stripe)
  order.paymentInfo.method = paymentMethod;
  order.paymentInfo.status = "Paid"; // Simulating a successful payment
  order.paymentInfo.paymentId = `mock_payment_id_${orderId}`; // Mock payment ID

  // Save the updated order
  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

export {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  processPayment,
};
