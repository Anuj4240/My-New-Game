const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status p');
const restartBtn = document.querySelector('.restart-btn');
const modeSelect = document.getElementById('mode');
const difficultySelect = document.getElementById('difficulty');
let currentPlayer = 'X';  // X starts first
let gameOver = false;
let gameMode = '1player'; // Default to 1 Player Mode
let difficulty = 'easy';  // Default difficulty is easy
let board = ['', '', '', '', '', '', '', '', ''];

// Winning combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Handle player move
const handlePlayerMove = (index) => {
  if (board[index] === '' && !gameOver) {
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer);  // Add the class for styling
    checkWinner();
    if (!gameOver) {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  // Switch player
      updateStatus();
      if (gameMode === '1player' && currentPlayer === 'O' && !gameOver) {
        setTimeout(() => handleComputerMove(), 500); // Delay for computer move
      }
    }
  }
};

// Check for winner
const checkWinner = () => {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameOver = true;
      setTimeout(() => alert(`${currentPlayer} wins!`), 100);
      setTimeout(restartGame, 2000); // Restart after 2 seconds
      return;
    }
  }
  if (board.every(cell => cell !== '')) {
    gameOver = true;
    setTimeout(() => alert("It's a draw!"), 100);
    setTimeout(restartGame, 2000); // Restart after 2 seconds
  }
};

// Update game status
const updateStatus = () => {
  if (!gameOver) {
    statusText.textContent = `${currentPlayer}'s turn`;
  }
};

// AI move with difficulty
const handleComputerMove = () => {
  let availableMoves = [];
  board.forEach((cell, index) => {
    if (cell === '') availableMoves.push(index);
  });

  let bestMove = -1;
  
  if (difficulty === 'easy') {
    bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  } else if (difficulty === 'normal') {
    bestMove = getBestMove(availableMoves);
  } else if (difficulty === 'hard') {
    bestMove = getBestMove(availableMoves, true);
  }

  handlePlayerMove(bestMove);
};

// Get best move based on difficulty (Normal and Hard)
const getBestMove = (availableMoves, hard = false) => {
  let move = null;
  
  // Try to win or block the opponent
  for (let moveIndex of availableMoves) {
    const tempBoard = [...board];
    tempBoard[moveIndex] = 'O';
    if (checkTempWinner(tempBoard, 'O')) {
      return moveIndex;
    }
    tempBoard[moveIndex] = 'X';
    if (checkTempWinner(tempBoard, 'X')) {
      return moveIndex;
    }
  }

  // For hard level, make the best possible move
  if (hard) {
    let bestScore = -Infinity;
    availableMoves.forEach(moveIndex => {
      const tempBoard = [...board];
      tempBoard[moveIndex] = 'O';
      const score = minimax(tempBoard, false);
      if (score > bestScore) {
        bestScore = score;
        move = moveIndex;
      }
    });
  } else {
    move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  return move;
};

// Minimax algorithm for best move (used for Hard level)
const minimax = (board, isMaximizing) => {
  const availableMoves = board.reduce((acc, val, index) => {
    if (val === '') acc.push(index);
    return acc;
  }, []);

  if (checkTempWinner(board, 'O')) return 10;
  if (checkTempWinner(board, 'X')) return -10;
  if (availableMoves.length === 0) return 0;

  let bestScore = isMaximizing ? -Infinity : Infinity;

  availableMoves.forEach(moveIndex => {
    const tempBoard = [...board];
    tempBoard[moveIndex] = isMaximizing ? 'O' : 'X';
    const score = minimax(tempBoard, !isMaximizing);
    bestScore = isMaximizing ? Math.max(bestScore, score) : Math.min(bestScore, score);
  });

  return bestScore;
};

// Helper function to check if a player wins based on the temporary board
const checkTempWinner = (tempBoard, player) => {
  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return tempBoard[a] === player && tempBoard[b] === player && tempBoard[c] === player;
  });
};

// Restart game
const restartGame = () => {
  board.fill('');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X', 'O');  // Remove the X or O class
  });
  gameOver = false;
  currentPlayer = 'X';
  updateStatus();
};

// Mode and difficulty change handlers
modeSelect.addEventListener('change', (e) => {
  gameMode = e.target.value;
  restartGame();
});

difficultySelect.addEventListener('change', (e) => {
  difficulty = e.target.value;
});

// Add event listeners to cells
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.getAttribute('data-index');
    handlePlayerMove(index);
  });
});


