import Puzzle from "../models/puzzle.model";
import User from "../models/user.model.js"

const storePuzzle = async (req, res) => {
    try {
        const { userId, puzzle, solution, difficulty } = req.body;

        if(!userId || !puzzle || !solution || !difficulty){
            return res.status(400).json({
                success: false,
                message: "userId, puzzle, solution and difficulty are all required."
            });
        }

        const user = await User.findbyId(userId);
    
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found."
            })
        }

        const stored = await Puzzle.create({
            puzzle,
            solution,
            difficulty,
            userId,
        })

        return res.status(201).json({
            success: true,
            puzzleId: stored._id,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    storePuzzle
}