import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price imageUrls stock"
  );

  if (!cart) {
    return res.json({ items: [] });
  }

  res.json({ items: cart.items });
});

const saveCart = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error("Cart items must be an array");
  }

  // Validate products exist
  const productIds = items.map((item) => item.product);
  const existingProducts = await Product.find({ _id: { $in: productIds } });

  if (existingProducts.length !== productIds.length) {
    res.status(400);
    throw new Error("One or more products are invalid");
  }

  // Either update or create the user's cart
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items },
    { new: true, upsert: true }
  );

  res.status(200).json(cart);
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

export { getCart, saveCart, clearCart };
