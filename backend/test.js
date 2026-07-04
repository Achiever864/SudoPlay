import { generateSolvedBoard } from "./utils/sudoku.js";

const board = generateSolvedBoard();

console.table(board);