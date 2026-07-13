import Leaderboard from "../models/Leaderboard.model.js";

const submitScore = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            puzzleId,
            difficulty,
            timeTaken,
            mistakes,
            hintsUsed,
            score
        } = req.body;

        if (
            !puzzleId ||
            !difficulty ||
            timeTaken == null ||
            score == null
        ){
            return res.status(400).json({
                success: false,
                message: "Missing required fields."
            });
        }

        const leaderboardEntry = await Leaderboard.create({
            user: userId,
            puzzleId,
            difficulty,
            timeTaken,
            mistakes,
            hintsUsed,
            score,
            completed: true
        });

        return res.status(201).json({
            success: true,
            leaderboardEntry
        });
    } catch (error){
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getGlobalLeaderboard = async (req, res) => {
    try{
        const leaderboard = await Leaderboard.find()
            .sort({
                score: -1,
                timeTaken: 1
            })
            .limit(100)
            .populate("user", "username avatar");
        
        res.json({
            success: true,
            leaderboard
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getDifficultyLeaderboard = async (req, res) => {
    try {
        const { difficulty } = req.params;

        const leaderboard = await Leaderboard.find({
            difficulty
        })
        .sort({
            score: -1,
            timeTaken: 1
        })
        .limit(100)
        .populate("user", "username avatar");

        res.json({
            success: true,
            leaderboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyHistory = async(req, res) => {
    try {
        const history = await Leaderboard.find({
            user: req.user.id
        })
        .sort({
            createdAt: -1
        });

        res.json({
            success: true,
            history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyStats = async(req, res) => {
    try {
        const stats = await Leaderboard.aggregate([
            {
                $match: {
                    user: req.user._id
                }
            },

            {
                $group: {
                    _id: null,
                    gamesPlayed: {
                        $sum: 1
                    },
                    totalScore: {
                        $sum: "$score"
                    },
                    averageScore: {
                        $avg: "$score"
                    },
                    bestScore: {
                        $max: "$score"
                    },
                    fastestTime: {
                        $min: "$timeTaken"
                    }
                }
            }
        ]);

        res.json({
            success: true,
            stats: stats[0] || {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyRank = async(req, res) => {
    try{
        const ranking = await Leaderboard.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalScore: {
                        $sum: "$score"
                    }
                }
            },

            {
                $sort: {
                    totalScore: -1
                }
            }
        ]);

        const rank = ranking.findIndex(player =>
            player._id.toString() === req.user.id
        );

        res.json({
            success: true,
            rank: rank+1,
            totalPlayers: ranking.length
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    getDifficultyLeaderboard,
    getMyHistory,
    getGlobalLeaderboard,
    getMyStats,
    getMyRank,
    submitScore
}