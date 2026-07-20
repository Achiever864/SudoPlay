import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ""
    },
    totalScore: {
        type: Number,
        default: 0
    },
    gamesPlayed: {
        type: Number,
        default: 0
    },
    gamesCompleted: {
        type: Number,
        default: 0
    },
    highestScore: {
        type: Number,
        default: 0
    },
    bestTimes: {
        easy: {
            type: Number,
            default: null
        },
        medium: {
            type: Number,
            default: null
        },
        hard: {
            type: Number,
            default: null
        },
        expert: {
            type: Number,
            default: null
        }
    },
    currentStreak: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
});

export default mongoose.model("User", userSchema);