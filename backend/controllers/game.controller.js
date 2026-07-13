// generatePuzzle
// startgamesession (when player presses start game)
// submitsolution (when a player is done and submits solution)
import { createPuzzle } from "../utils/createPuzzle.js";
import { getTemplate } from "../utils/template.js";

const startGame = async(req, res) => {
    try {
        const { difficulty="easy"} = req.query;

        const solvedBoard = getTemplate();
        const puzzle = createPuzzle(solvedBoard, difficulty);

        res.status(200).json({
            success: true,
            puzzle,
            difficulty
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export{
    startGame
}