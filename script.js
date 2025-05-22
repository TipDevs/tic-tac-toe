(function gameBoard() {
    const board = ['', '', '', '', '', '', '', '', ''];
    const getGameBoard = () => [...board];
    const updateBoard = (index, mark) => {
        if (index >= 0 && index < 9 && board[index] === '') {
            board[index] = mark;
        }
    }
    const clearBoard = () => board = ['', '', '', '', '', '', '', '', ''];
    return { getGameBoard, updateBoard, clearBoard };
})();