/**
 * Logic Blocks (Sliding Puzzle) Game Module
 */

let state = {
  level: 1, // 1=3x3, 2=4x4
  gridSize: 3,
  tiles: [], // 1D array representing grid
  emptyIndex: 8, // Index of empty space
  moves: 0,
  container: null,
  options: {},
};

export function init(container, options) {
  state.container = container;
  state.options = options;
  state.level = 1;
  startGame(state.level);
}

function startGame(level) {
  state.level = level;
  state.gridSize = level === 1 ? 3 : 4;
  state.moves = 0;

  // Generate Solvable Board
  // Start with solved state and shuffle backwards to ensure solvability
  const totalTiles = state.gridSize * state.gridSize;
  state.tiles = Array.from({ length: totalTiles }, (_, i) => i + 1);
  state.tiles[totalTiles - 1] = null; // Empty slot
  state.emptyIndex = totalTiles - 1;

  shuffleBoard();
  render();
}

function shuffleBoard() {
  // Perform N random valid moves to shuffle
  const shuffleSteps = 100 * state.level;
  for (let i = 0; i < shuffleSteps; i++) {
    const neighbors = getNeighbors(state.emptyIndex);
    const randomNeighbor =
      neighbors[Math.floor(Math.random() * neighbors.length)];
    swap(state.emptyIndex, randomNeighbor, false);
  }
}

function getNeighbors(index) {
  const neighbors = [];
  const size = state.gridSize;
  const row = Math.floor(index / size);
  const col = index % size;

  if (row > 0) neighbors.push(index - size); // Up
  if (row < size - 1) neighbors.push(index + size); // Down
  if (col > 0) neighbors.push(index - 1); // Left
  if (col < size - 1) neighbors.push(index + 1); // Right

  return neighbors;
}

function swap(index1, index2, animate = true) {
  [state.tiles[index1], state.tiles[index2]] = [
    state.tiles[index2],
    state.tiles[index1],
  ];
  state.emptyIndex = index2;
  if (animate) {
    state.moves++;
    // We re-render full grid for simplicity, could optimize animation later
    render();
    checkWin();
  }
}

function render() {
  const size = state.gridSize;
  state.container.innerHTML = `
        <div class="sliding-game">
            <div class="sliding-header">
                <div>Level ${state.level}</div>
                <div>Moves: ${state.moves}</div>
            </div>
            
            <div class="sliding-grid" style="
                grid-template-columns: repeat(${size}, 1fr);
                grid-template-rows: repeat(${size}, 1fr);
            ">
                ${state.tiles
                  .map((tile, index) => {
                    if (tile === null)
                      return `<div class="sliding-tile empty"></div>`;
                    return `
                        <div class="sliding-tile" onclick="window.handleSlideClick(${index})">
                            ${tile}
                        </div>
                    `;
                  })
                  .join("")}
            </div>
            
             <div class="sliding-controls">
                <button id="reset-slide-btn" class="primary-btn">Reset</button>
             </div>
        </div>
    `;

  // Hacky binding for inline onclick, better to addEventListener
  window.handleSlideClick = handleTileClick;

  document
    .getElementById("reset-slide-btn")
    .addEventListener("click", () => startGame(state.level));
}

function handleTileClick(index) {
  const neighbors = getNeighbors(state.emptyIndex);
  if (neighbors.includes(index)) {
    swap(state.emptyIndex, index);
    playSound("slide");
  } else {
    // Shake animation for invalid move
  }
}

function checkWin() {
  const totalTiles = state.gridSize * state.gridSize;
  for (let i = 0; i < totalTiles - 1; i++) {
    if (state.tiles[i] !== i + 1) return;
  }

  // Win!
  setTimeout(() => {
    alert("Solved!");
    if (state.level < 2) {
      startGame(state.level + 1);
    } else {
      state.options.onGameOver(500 - state.moves); // Bonus for fewer moves
    }
  }, 200);
}

function playSound(type) {
  if (!state.options.soundEnabled) return;
}
