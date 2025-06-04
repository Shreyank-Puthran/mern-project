import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const addReviewToProduct = async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if the user has already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    // Create a new review with name and email
    const review = {
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      rating: Number(rating),
      comment,
    };

    // Add the review to the product
    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    // Recalculate the average rating
    product.averageRating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add review", error: err.message });
  }
};


const getReviewsForProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).select("reviews");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product.reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const allReviews = await Product.aggregate([
      // unwind the reviews array
      { $unwind: "$reviews" },
      // project the fields you want
      {
        $project: {
          _id: "$reviews._id",
          productId: "$_id",
          productName: "$name",
          user: "$reviews.user",
          name: "$reviews.name",
          rating: "$reviews.rating",
          comment: "$reviews.comment",
          createdAt: "$reviews.createdAt",
        },
      },
    ]);

    res.status(200).json(allReviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch all reviews", error: err.message });
  }
};



const updateProductReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Find the review by the user
    const review = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Update the review
    if(rating) review.rating = rating;
    if(comment) review.comment = comment;
    review.createdAt = Date.now();

    // Recalculate the average rating
    product.averageRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(200).json({ message: "Review updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update review", error: err.message });
  }
};


const deleteProductReview = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Filter out the review by the user
    const reviews = product.reviews.filter(
      (rev) => rev.user.toString() !== req.user._id.toString()
    );

    // Ensure that only the user who wrote the review or admin can delete it
    if (reviews.length === product.reviews.length) {
      return res.status(403).json({ message: "You cannot delete this review" });
    }

    product.reviews = reviews;
    product.numReviews = reviews.length;

    // Recalculate the average rating
    product.averageRating = reviews.length
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

    await product.save();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete review", error: err.message });
  }
};

export { addReviewToProduct,getReviewsForProduct, getAllReviews, updateProductReview, deleteProductReview };
