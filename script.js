(function gameBoard() {
    const board = ['', '', '', '', '', '', '', '', ''];
    const getGameBoard = () => [...board];
    const updateBoard = (index, mark) => {
        if (index >= 0 && index < 9 && board[index] === '') {
            board[index] = mark;
        }
    }
    const displayBoard = () => {
        console.log('\n');
        console.log(`${board[0]} | ${board[1]} | ${board[2]}`);
        console.log('...........');
        console.log(`${board[3]} | ${board[4]} | ${board[5]}`);
        console.log('...........');
        console.log(`${board[6]} | ${board[7]} | ${board[8]}`);
        console.log('\n');
    }
    const clearBoard = () => board = ['', '', '', '', '', '', '', '', ''];
    return { getGameBoard, updateBoard, clearBoard };
})();

function createPlayer(name, marker) {
    const getName = () => name;
    const getMarker = () => marker;
    return { getName, getMarker };
}

(function gameController() {
    let player1;
    let player2;
    let currentPlayer;
    let gameOver;

    const winningCombo = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],//row combo
        [0, 3, 6], [1, 4, 7], [2, 5, 8],//column combo
        [0, 4, 8], [2, 4, 6] //diagonal combo
    ];
    const checkWin = (boardToCheck, playerMarker) => {
        return winningCombo.some(combo => {
            return combo.every(index => boardToCheck[index] === playerMarker);
        });
    };
    const checkDraw = (boardToCheck => !boardToCheck.includes(''));
    const switchPlayer = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1
    };

    const getPlayerMove = () => {
        let move;
        let isValidMove = false;
        while (!isValidMove) {
            const moveInput = prompt(`${currentPlayer.name}, enter your move (1-9)`);
            move = parseInt(moveInput, 10) - 1;
            if (isNaN(move) || move < 0 || move > 8 || gameBoard.getGameBoard()[move] !== '') {
                console.log('Invalid move.')
            }
            else {
                isValidMove = true;
            }
            return move;
        }
    };
    const startGame = (player1Name, player2Name) => {
        player1 = createPlayer(player1Name, 'X');
        player2 = createPlayer(player2Name, 'O');
        currentPlayer = player1;
        gameOver = false;
        gameBoard.clearBoard();
        while (!gameOver) {
            gameBoard.displayBoard();
            const move = getPlayerMove();
            const moveSuccessful = gameBoard.updateBoard(move, currentPlayer.getMarker());
            if (moveSuccessful) {
                const currentBoard = gameBoard.getGameBoard();
                if (checkWin(currentBoard, currentPlayer.getMarker())) {
                    gameBoard.displayBoard();
                    console.log(`${currentPlayer.getName()} won`);
                }
                else if (checkDraw(currentBoard)) {
                    gameBoard.displayBoard();
                    console.log(`No winner this time!!!`);
                    gameOver = true;
                }
                else {
                    switchPlayer();
                }
            }
        }
        console.log(`Game over!`);
    };
    return { startGame };
})();