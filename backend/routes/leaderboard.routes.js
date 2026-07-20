import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
    submitScore,
    getGlobalLeaderboard,
    getDifficultyLeaderboard,
    getMyHistory,
    getMyStats,
    getMyRank
} from "../controllers/Leaderboard.controller.js";

const router = express.Router();
router.post("/submit", protect, submitScore);
router.get("/", protect, getGlobalLeaderboard);
router.get("/me", protect, getMyHistory);
router.get('/me/stats', protect, getMyStats);
router.get("/rank/me", protect, getMyRank);
router.get("/:difficulty", protect, getDifficultyLeaderboard);

export default router;