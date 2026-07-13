import { generateSolvedBoard } from "./sudoku.js";
import { randomize } from "./randomizer.js";

let templateBoard = null;

export function initializeTemplate() {
    if(!templateBoard) {
        templateBoard = randomize(generateSolvedBoard());
        console.log('Sudoku template generated');
    }
}

export function getTemplate(){
    return templateBoard.map(row => [...row]);
}

