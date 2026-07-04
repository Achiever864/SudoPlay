import { generateSolvedBoard } from "./sudoku.js";

let templateBoard = null;

export function initializeTemplate() {
    if(!templateBoard) {
        templateBoard = generateSolvedBoard();
        console.log('Sudoku template generated');
    }
}

export function getTemplate(){
    return templateBoard.map(row => [...row]);
}

