import express from "express";
import {
  addPlayer,
  getPlayers,
  getSinglePlayer,
  updatePlayer,
  removePlayer,
} from "../controllers/playerController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../multerCloudinary.js";

const router = express.Router();

router.post("/add-player", protect, admin, upload.single("image"), addPlayer); // Admin-only route
router.get("/", getPlayers);
router.get("/get-player/:playerId", getSinglePlayer);
router.patch("/update-player/:playerId", protect, admin, upload.single("image"), updatePlayer); // Admin-only route
router.delete("/remove-player/:playerId", protect, admin,  removePlayer); // Admin-only route

export default router;
