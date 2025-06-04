import express from "express";
import {
  addTeam,
  getAllTeams,
  getSingleTeam,
  updateTeam,
  removeTeam,
  addPlayerToTeam,
} from "../controllers/teamController.js";
import upload from "../multerCloudinary.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-team", protect, admin, upload.single("logo"), addTeam);

router.get("/", getAllTeams);

router.get("/get-single-team/:teamId", getSingleTeam);

router.patch(
  "/update-team/:teamId",
  protect,
  admin,
  upload.single("logo"),
  updateTeam
);

router.delete("/remove-team/:teamId", protect, admin, removeTeam);

router.patch("/add-player/:teamId", protect, admin, addPlayerToTeam);

export default router;
