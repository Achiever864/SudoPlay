import mongoose from "mongoose";

const { Schema } = mongoose;

const boardValidator = {
    validator: function (board) {
        return (
            Array.isArray(board) &&
            board.length === 9 &&
            board.every(
                (row) =>
                    Array.isArray(row) &&
                    row.length === 9 &&
                    row.every((cell) => Number.isInteger(cell) && cell >= 0 && cell <= 9)
            )
        );
    },
    message: "Board must be a 9x9 grid of integers between 0 and 9",
};

const puzzleSchema = new Schema(
    {
        puzzle: {
            type: [[Number]],
            required: true,
            validate: boardValidator,
        },
        
        solution: {
            type: [[Number]],
            required: true,
            validate: boardValidator,
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard", "expert"],
            required: true,
        },

        solvedAt: {
            type: Date,
            default: null,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

puzzleSchema.index({ userId: 1, createdAt: -1 });

puzzleSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

const Puzzle = mongoose.model("Puzzle", puzzleSchema);

export default Puzzle;