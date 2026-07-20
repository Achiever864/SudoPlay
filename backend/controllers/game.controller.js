import { createPuzzle } from "../utils/createPuzzle.js";
import { getTemplate } from "../utils/template.js";
import Puzzle from "../models/puzzle.model.js";

const startGame = async (req, res) => {
    try {
        const { difficulty = "easy" } = req.query;
        
        const userId = req.user?._id;
        
        if (!userId) {   
            return res.status(401).json({
                success: false,
                message: "No active session, a guest or registered user is required to start a game.",
            });
        }

        const solvedBoard = getTemplate();
        const solution = structuredClone(solvedBoard);
        const puzzle = createPuzzle(solvedBoard, difficulty);

        const stored = await Puzzle.create({
            puzzle,
            solution,
            difficulty,
            userId,
        });

        res.status(200).json({
            success: true,
            puzzleId: stored._id,
            puzzle,
            solvedBoard: solution,
            difficulty,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { startGame };