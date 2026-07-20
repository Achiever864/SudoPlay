import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard", "expert"],
            required: true,
            index: true,
        },

        timeTaken: {
            type: Number,
            required: true
        },

        score: {
            type: Number,
            required: true,
            index: true,
        },

        mistakes: {
            type: Number,
            default: 0
        },

        hintsUsed: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

leaderboardSchema.index({
    difficulty: 1,
    score: -1,
    timeTaken: 1
});

export default mongoose.model("Leaderboard", leaderboardSchema);