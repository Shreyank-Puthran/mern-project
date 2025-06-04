import express from "express";
import User from "../models/userModel.js";
import {
  login,
  register,
  adminLogin,
  deleteUser,
} from "../controllers/authController.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Request Password Reset - Sends a reset token to the user’s email
router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a password reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Save reset token and expiration date to the user model
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send email with the reset link
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    await nodemailer
      .createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 587,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      })
      .sendMail({
        from: '"Soccer App" <no-reply@soccerapp.com>',
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
      });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({
      message: "Error sending password reset email",
      error: err.message,
    });
  }
});

// Reset Password - User resets the password using the token from the reset email
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Hash the new password before saving it
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined; // Remove reset token after use
    user.resetTokenExpires = undefined; // Remove expiration time
    await user.save();

    res.status(200).json({ message: "Password successfully reset" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error resetting password", error: err.message });
  }
});

// Email verification route - To verify user email after registration
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error verifying email", error: err.message });
  }
});

router.post("/register", register);
router.post("/login", login);
router.delete("/delete-user/:userId", protect, admin, deleteUser);
router.post("/admin-login", adminLogin);

export default router;
