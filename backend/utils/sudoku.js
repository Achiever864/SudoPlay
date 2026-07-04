export function createEmptyBoard() {
    return Array.from({ length: 9 }, () => 
        Array(9).fill(0)
    );
}

export function isValid(board, row, col, num) {
    //Row
    for(let i=0; i<9; i++) {
        if (board[row][i] === num) return false;
    }

    //column
    for (let i=0; i<9; i++) {
        if (board[i][col] === num) return false;
    }

    //3x3 Box
    const startRow = row - (row % 3);
    const startCol = row - (col % 3);

    for (let r=0; r<3; r++){
        for(let c=0; c<3; c++){
            if(board[startRow + r][startCol + c] === num)
                return false;
        }
    }

    return true;
}

export function shuffle(nums){
    for (let i=nums.length - 1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    return nums;
}

export function solve(board){
    for (let row=0; row<9; row++){
        for(let col=0; col<9; col++){
            if (board[row][col] === 0){
                const numbers = shuffle([1,2,3,4,5,6,7,8,9]);

                for(const num of numbers){
                    if (isValid(board,row,col,num)){
                        board[row][col] = num;

                        if(solve(board))
                            return true;

                        board[row][col] = 0;
                    }
                }

                return false;
            }
        }
    }

    return true;
}

export function generateSolvedBoard(){
    const board = createEmptyBoard();

    solve(board);
    return board;
}