import express from "express";

import {
    submitScore,
    getGlobalLeaderboard,
    getDifficultyLeaderboard,
    getMyHistory,
    getMyStats,
    getMyRank
} from "../controllers/Leaderboard.controller.js";

const router = express.Router();
router.post("/", submitScore);
router.get("/", getGlobalLeaderboard);
router.get("/me", getMyHistory);
router.get('/me/stats', getMyStats);
router.get("/rank/me", getMyRank);
router.get("/:difficulty", getDifficultyLeaderboard);

export default router;