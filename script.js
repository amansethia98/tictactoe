document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const statusText = document.getElementById('status');
    let currentPlayer = 'X';
    let nextBoardIndex = null;
    let gameWon = false;

    const largeBoards = [];

    // Initialize the boards
    for (let i = 0; i < 9; i++) {
        const smallBoard = {
            cells: Array(9).fill(null),
            element: null,
            wonBy: null
        };
        largeBoards.push(smallBoard);
    }

    // Create the game board
    function createGameBoard() {
        const largeBoardElement = document.createElement('div');
        largeBoardElement.className = 'large-board';

        largeBoards.forEach((board, boardIndex) => {
            const smallBoardElement = document.createElement('div');
            smallBoardElement.className = 'small-board';
            smallBoardElement.dataset.boardIndex = boardIndex;
            board.element = smallBoardElement;

            board.cells.forEach((cell, cellIndex) => {
                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                cellElement.dataset.boardIndex = boardIndex;
                cellElement.dataset.cellIndex = cellIndex;

                cellElement.addEventListener('click', handleCellClick);

                smallBoardElement.appendChild(cellElement);
            });

            largeBoardElement.appendChild(smallBoardElement);
        });

        gameBoard.appendChild(largeBoardElement);
    }

    // Handle cell click
    function handleCellClick(event) {
        const cellElement = event.target;
        const boardIndex = parseInt(cellElement.dataset.boardIndex);
        const cellIndex = parseInt(cellElement.dataset.cellIndex);
        const board = largeBoards[boardIndex];

        // Check if move is valid
        if (gameWon || board.cells[cellIndex] || (nextBoardIndex !== null && nextBoardIndex !== boardIndex)) {
            return;
        }

        // Update board state
        board.cells[cellIndex] = currentPlayer;
        cellElement.textContent = currentPlayer;
        cellElement.classList.add(currentPlayer);

        // Check for small board win
        if (!board.wonBy && checkWin(board.cells, currentPlayer)) {
            board.wonBy = currentPlayer;
            board.element.classList.add(`won${currentPlayer}`);

            // Check for large board win
            if (checkWin(largeBoards.map(b => b.wonBy), currentPlayer)) {
                gameWon = true;
                statusText.textContent = `Player ${currentPlayer} wins the game! 🎉`;
                updateBoardAvailability();
                return;
            }
        }

        // Check for draw in small board
        if (!board.wonBy && board.cells.every(cell => cell)) {
            board.wonBy = 'D';
            board.element.classList.add('draw');
        }

        // Set next board
        nextBoardIndex = cellIndex;

        // Update status
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Current Player: ${currentPlayer}`;

        // Update board availability
        updateBoardAvailability();
    }

    // Check for win
    function checkWin(cells, player) {
        if (!cells) return false;

        const winningCombinations = [
            [0,1,2], [3,4,5], [6,7,8], // rows
            [0,3,6], [1,4,7], [2,5,8], // columns
            [0,4,8], [2,4,6]           // diagonals
        ];

        return winningCombinations.some(combination =>
            combination.every(index => cells[index] === player)
        );
    }

    // Update board availability by overlaying unavailable boards
    function updateBoardAvailability() {
        largeBoards.forEach((board, boardIndex) => {
            if (gameWon) {
                board.element.classList.remove('unavailable');
                return;
            }

            if (nextBoardIndex === null || nextBoardIndex === boardIndex || largeBoards[nextBoardIndex].wonBy) {
                // All boards are available
                board.element.classList.remove('unavailable');
            } else {
                board.element.classList.add('unavailable');
            }
        });
    }

    createGameBoard();
    updateBoardAvailability();
});
