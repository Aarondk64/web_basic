        const rows = 10;
        const cols = 10;
        const mineCount = 10;

let board = [];
let minePositions = [];

const boardElement = document.getElementById('board');
boardElement.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

function createBoard() {
  board = [];

  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleClick);
      boardElement.appendChild(cell);
      rowArray.push({ element: cell, mine: false, revealed: false });
    }
    board.push(rowArray);
  }

  placeMines();
}

function placeMines() {
  let placed = 0;
  while (placed < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
      minePositions.push([r, c]);
    }
  }
}

function handleClick(e) {
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  revealCell(row, col);
}

function revealCell(row, col) {
  const cell = board[row][col];
  if (cell.revealed) return;

  cell.revealed = true;
  cell.element.classList.add('revealed');

  if (cell.mine) {
    cell.element.textContent = '💣';
    alert('Boom! Du hast verloren!');
    revealAll();
    return;
  }

  const minesAround = countMinesAround(row, col);
  if (minesAround > 0) {
    cell.element.textContent = minesAround;
  } else {
    // Flood fill (leere Zellen aufdecken)
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        const newRow = row + r;
        const newCol = col + c;
        if (isValid(newRow, newCol)) {
          revealCell(newRow, newCol);
        }
      }
    }
  }
}

function countMinesAround(row, col) {
  let count = 0;
  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      const newRow = row + r;
      const newCol = col + c;
      if (isValid(newRow, newCol) && board[newRow][newCol].mine) {
        count++;
      }
    }
  }
  return count;
}

function isValid(row, col) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

function revealAll() {
  for (const [r, c] of minePositions) {
    const cell = board[r][c];
    cell.element.textContent = '💣';
    cell.element.classList.add('revealed');
  }
}

// Starte das Spiel
createBoard();