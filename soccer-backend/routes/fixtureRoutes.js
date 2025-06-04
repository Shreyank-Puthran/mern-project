import express from "express";
import {
  createFixture,
  getAllFixtures,
  getFixturesById,
  updateFixture,
  deleteFixture,
} from "../controllers/fixtureController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-fixture", protect, admin, createFixture);
router.get("/", getAllFixtures);
router.get("/get-fixture/:id", getFixturesById);
router.patch("/update-fixture/:id", protect, admin, updateFixture);
router.delete("/delete-fixture/:id", protect, admin, deleteFixture);

export default router;
