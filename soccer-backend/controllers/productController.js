import Product from "../models/productModel.js";
import { extractPublicId } from "../utilities/cloudinaryUtil.js";
import cloudinary from "cloudinary";

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, sizes } = req.body;
    const imageUrls = req.files?.map((file) => file.path); // Get image URLs from the uploaded files

    if (!imageUrls || imageUrls.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one product image is required" });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      sizes,
      imageUrls, // Store multiple image URLs
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating product", error: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, sizes } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Handle image deletions for the existing product
    if (req.files) {
      // Delete old images from Cloudinary
      for (let imageUrl of product.imageUrls) {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
          await cloudinary.v2.uploader.destroy(publicId);
        }
      }

      // Update with new image URLs
      product.imageUrls = req.files.map((file) => file.path);
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;
    if (sizes) product.sizes = sizes;

    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating product", error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete all images associated with the product
    for (let imageUrl of product.imageUrls) {
      const publicId = extractPublicId(imageUrl);
      if (publicId) {
        await cloudinary.v2.uploader.destroy(publicId);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: err.message });
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
