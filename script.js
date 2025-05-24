const gameBoard = (function () {
    let board = ['', '', '', '', '', '', '', '', ''];
    const getGameBoard = () => [...board];
    const updateBoard = (index, mark) => {
        if (index >= 0 && index < 9 && board[index] === '') {
            board[index] = mark;
            return true;
        }
        return false;
    };
    const clearBoard = () => board = ['', '', '', '', '', '', '', '', ''];
    return { getGameBoard, updateBoard, clearBoard };
})();

function createPlayer(name, marker) {
    const getName = () => name;
    const getMarker = () => marker;
    return { getName, getMarker };
}

const gameController = (function () {
    let player1;
    let player2;
    let currentPlayer;
    let gameOver = false;

    const winningCombo = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const checkWin = (boardToCheck, playerMarker) => {
        return winningCombo.some(combo =>
            combo.every(index => boardToCheck[index] === playerMarker)
        );
    };

    const checkDraw = (boardToCheck) => !boardToCheck.includes('');

    const switchPlayer = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    };

    const startGame = (player1Name, player2Name) => {
        player1 = createPlayer(player1Name, 'X');
        player2 = createPlayer(player2Name, 'O');
        currentPlayer = player1;
        gameOver = false;
        gameBoard.clearBoard();
        getDom.form.style.display = 'none';
        getDom.gameDisplay.style.display = 'grid';
        getDom.gameTiles.forEach(tiles => tiles.textContent = '');
    };

    const handleTileClick = (index, tile) => {
        if (tile.textContent !== '' || gameOver) return;
        tile.textContent = currentPlayer.getMarker();
        const moveAccepted = gameBoard.updateBoard(index, currentPlayer.getMarker());
        if (!moveAccepted) return;

        const currentBoardState = gameBoard.getGameBoard();
        if (checkWin(currentBoardState, currentPlayer.getMarker())) {
            alert(`${currentPlayer.getName()} won`);
            gameOver = true;
            resetGame();
        } else if (checkDraw(currentBoardState)) {
            alert(`No winner this time!`);
            gameOver = true;
            resetGame();
        } else {
            switchPlayer();
        }
    };

    const resetGame = () => {
        getDom.gameTiles.forEach(tile => tile.textContent = '');
        getDom.gameDisplay.style.display = 'none';
        getDom.form.style.display = 'flex';
    };

    return { startGame, handleTileClick };
})();

const getDom = (() => {
    const form = document.querySelector('form');
    const firstPlayer = document.querySelector('#Player1');
    const secondPlayer = document.querySelector('#Player2');
    const gameDisplay = document.querySelector('.game_container');
    const gameTiles = document.querySelectorAll('.game_tiles');
    return { firstPlayer, secondPlayer, form, gameDisplay, gameTiles };
})();

function init() {
    getDom.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const player1GameName = getDom.firstPlayer.value;
        const player2GameName = getDom.secondPlayer.value;
        if (player1GameName.trim() !== '' && player2GameName.trim() !== '') {
            gameController.startGame(player1GameName, player2GameName);
            getDom.firstPlayer.value = '';
            getDom.secondPlayer.value = '';
        } else {
            alert("Please enter both players' names.");
        }
    });

    getDom.gameTiles.forEach((tile, index) => {
        tile.addEventListener('click', () => {
            gameController.handleTileClick(index, tile);
        });
    });
}

init();
