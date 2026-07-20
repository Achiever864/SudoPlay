export function createPuzzle(board,difficulty){
    let cellsToRemove;

    switch(difficulty){
        case "easy": cellsToRemove =2; break;
        case "medium": cellsToRemove = 45; break;
        case "hard" : cellsToRemove = 55; break;
        case "expert" : cellsToRemove = 62; break;
    }

    while(cellsToRemove > 0){
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (board[row][col] !== 0){
            board[row][col] = 0;
            cellsToRemove--;
        }
    }

    return board;
}