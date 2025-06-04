
import express from "express";
import { sendEmail } from "../emailService.js";

const router = express.Router();

router.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      "test@example.com",
      "Test Email",
      "This is a plain text test email",
      "<h1>This is a test email</h1>"
    );
    res.send("Test email sent successfully!");
  } catch (error) {
    console.error("Email send failed:", error);
    res.status(500).send("Failed to send test email.");
  }
});

export default router;
