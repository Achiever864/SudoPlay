import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String
    },

    isGuest: {
        type: Boolean,
        default: true
    },

    avatar: {
        type: String,
        default: ""
    },

    guestId: {
        type: String,
        unique: true
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