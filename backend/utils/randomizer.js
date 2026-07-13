function findAll(board, value) {
    const cells = [];

    for (let r=0; r<9; r++){
        for(let c=0; c<9; c++){
            if(board[r][c] === value)
                cells.push([r, c]);
        }
    }

    return cells;
}

export function swapNumbers(board){
    const a = Math.floor(Math.random() * 9) + 1;
    let b = Math.floor(Math.random() * 9) + 1;

    while (a === b)
        b = Math.floor(Math.random() * 9) + 1;

    const first = findAll(board, a);
    const second = findAll(board, b);

    first.forEach(([r,c]) => board[r][c] = b);
    second.forEach(([r,c]) => board[r][c] = a);

    return board;
}

export function swapRows(board){
    const band = Math.floor(Math.random() * 3);
    const row1 = band * 3 + Math.floor(Math.random() * 3);
    let row2 = band * 3 + Math.floor(Math.random() * 3);

    while(row1 === row2)
        row2 = band * 3 + Math.floor(Math.random() * 3);

    [board[row1], board[row2]] = [board[row2], board[row1]];

    return board;
}

export function swapColumns(board){
    const stack = Math.floor(Math.random() * 3);
    const col1 = stack * 3 + Math.floor(Math.random() * 3);
    let col2 = stack * 3 + Math.floor(Math.random() * 3);

    while (col1 === col2)
        col2 = stack * 3 + Math.floor(Math.random() * 3);

    for (let r=0; r<9; r++){
        [board[r][col1], board[r][col2]] = [board[r][col2], board[r][col1]];
    }

    return board;
}


export function randomize(board){
    for(let i = 0; i < 20; i++){
        const choice = Math.floor(Math.random() * 3);

        if(choice === 0){
            swapRows(board);
        }

        else if (choice === 1)
            swapColumns(board);
        else
            swapNumbers(board);
    }

    return board;
}