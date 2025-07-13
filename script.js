class Player {
    constructor(name, marker) {
        this.name = name;
        this.marker = marker;
    }
    getName() {
        return this.name;
    }
    getMarker() {
        return this.marker;
    }
}

class GameBoard {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
    }
    getBoard() {
        return [...this.board]
    }
    updateBoard(index, marker) {
        if (index >= 0 && index < 9 && this.board[index] === '') {
            this.board[index] = marker;
            return true;
        }
        return false;
    }
    clearBoard() {
        this.board = ['', '', '', '', '', '', '', '', ''];
    }
}

const UIHandler = (function () {
    const form = document.querySelector('form');
    const firstPlayer = document.querySelector('#Player1');
    const secondPlayer = document.querySelector('#Player2');
    const gameDisplay = document.querySelector('.game_container');
    const gameTiles = document.querySelectorAll('.game_tiles');

    const updateTiles = (index, marker) => {
        gameTiles[index].textContent = marker;
    };
    const resetTiles = () => {
        gameTiles.forEach(tile => tile.textContent = "");
    };
    const toggleGameDisplay = (show) => {
        form.style.display = show ? "none" : "flex";
        gameDisplay.style.display = show ? "grid" : "none";
        console.log(form, gameDisplay);

    };
    const showWinner = (playerName) => {
        alert(`${playerName} won the game!`);
    };
    const showDraw = () => {
        alert(`It's a draw!`);
    };

    // PubSub subscriptions
    PubSub.subscribe("tile.updated", (msg, data) => {
        updateTiles(data.index, data.marker);
    });
    PubSub.subscribe("game.won", (msg, playerName) => {
        showWinner(playerName);
        toggleGameDisplay(false);
    });
    PubSub.subscribe("game.draw", () => {
        showDraw();
        toggleGameDisplay(false);
    });

    return {
        form, firstPlayer, secondPlayer, gameTiles, resetTiles, toggleGameDisplay
    };
})();


class GameLogic {
    constructor(board) {
        this.board = board;
        this.player1;
        this.player2;
        this.currentPlayer;
        this.gameOver = false;
        this.winningCombo = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
    }

    startGame(player1Name, player2Name) {
        this.player1 = new Player(player1Name, "X");
        this.player2 = new Player(player2Name, "O");
        this.currentPlayer = this.player1;
        this.gameOver = false;
        this.board.clearBoard();
        UIHandler.resetTiles();
        UIHandler.toggleGameDisplay(true);
    }

    switchPlayer() {
        this.currentPlayer = (this.currentPlayer === this.player1) ? this.player2 : this.player1;
    }

    checkWin() {
        return this.winningCombo.some(combo =>
            combo.every(index => this.board.getBoard()[index] === this.currentPlayer.getMarker())
        );
    }

    checkDraw() {
        return !this.board.getBoard().includes('');
    }

    handleTileClick(index) {
        if (this.board.getBoard()[index] !== "" || this.gameOver) return;

        this.board.updateBoard(index, this.currentPlayer.getMarker());
        PubSub.publish("tile.updated", { index, marker: this.currentPlayer.getMarker() });

        if (this.checkWin()) {
            PubSub.publish("game.won", this.currentPlayer.getName());
            this.gameOver = true;
        } else if (this.checkDraw()) {
            PubSub.publish("game.draw");
            this.gameOver = true;
        } else {
            this.switchPlayer();
        }
    }
}


function init() {
    const board = new GameBoard();
    const game = new GameLogic(board);

    UIHandler.form.addEventListener("submit", (event) => {
        event.preventDefault();
        const player1Name = UIHandler.firstPlayer.value.trim();
        const player2Name = UIHandler.secondPlayer.value.trim();
        if (player1Name && player2Name) {
            game.startGame(player1Name, player2Name);
            UIHandler.firstPlayer.value = "";
            UIHandler.secondPlayer.value = "";
        } else {
            alert("Please enter both player names!");
        }
    });

    UIHandler.gameTiles.forEach((tile, index) => {
        tile.addEventListener("click", () => {
            game.handleTileClick(index);
        });
    });
}

init();
