import express from "express";
import { startGame } from "../controllers/game.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const gameRoute = express.Router();

gameRoute.get("/start", protect, startGame);

export default gameRoute;