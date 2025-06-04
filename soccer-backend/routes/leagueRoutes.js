import express from "express";
import {
  createLeague,
  getAllLeagues,
  getSingleLeague,
  updateLeague,
  updateTeamStats,
  removeLeague,
  addTeamToLeague,
} from "../controllers/leagueController.js";
import upload from "../multerCloudinary.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-league", protect, admin, upload.single("logo"), createLeague);
router.get("/", getAllLeagues);
router.get("/get-league/:leagueId", getSingleLeague);
router.patch(
  "/update-league/:leagueId",
  protect,
  admin,
  upload.single("logo"),
  updateLeague
);
router.patch(
  "/:leagueId/team/:teamId/update-stats",
  protect,
  admin,
  updateTeamStats
);
router.delete("/remove-league/:leagueId", protect, admin, removeLeague);
router.post("/add-team-to-league/:leagueId", protect, admin, addTeamToLeague);

export default router;
