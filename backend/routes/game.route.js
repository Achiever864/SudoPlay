import express from "express";
import { startGame } from "../controllers/game.controller.js";

const gameRoute = express.Router();

gameRoute.get("/start", startGame);

export default gameRoute;