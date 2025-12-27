/**
 * Maze Mini Game Module
 * Simple grid-based maze with DFS generation.
 */

let state = {
  level: 1,
  cols: 10,
  rows: 10,
  grid: [], // 2D array: 1 = wall, 0 = path
  player: { x: 0, y: 0 },
  goal: { x: 0, y: 0 },
  container: null,
  options: {},
};

export function init(container, options) {
  state.container = container;
  state.options = options;
  state.level = 1;
  // Remove global key listeners if any from previous runs to avoid leaks
  document.removeEventListener("keydown", handleKey);
  startGame(state.level);
}

function startGame(level) {
  state.level = level;
  // Difficulty: Increase size
  state.cols = 8 + level * 2;
  state.rows = 8 + level * 2;

  state.grid = generateMaze(state.cols, state.rows);
  state.player = { x: 1, y: 1 }; // Start near top-left
  state.goal = { x: state.cols - 2, y: state.rows - 2 }; // Goal near bottom-right

  render();

  // Attach controls
  document.addEventListener("keydown", handleKey);

  // Touch controls (D-Pad)
  const dpad = state.container.querySelectorAll(".dpad-btn");
  dpad.forEach((btn) => {
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      move(btn.dataset.dir);
    });
    btn.addEventListener("click", (e) => {
      move(btn.dataset.dir);
    });
  });
}

function generateMaze(cols, rows) {
  // Fill with walls
  const grid = Array(rows)
    .fill()
    .map(() => Array(cols).fill(1));

  // DFS for maze generation
  const stack = [];
  const start = { x: 1, y: 1 };
  grid[start.y][start.x] = 0;
  stack.push(start);

  const dirs = [
    { x: 0, y: -2 }, // Up
    { x: 0, y: 2 }, // Down
    { x: -2, y: 0 }, // Left
    { x: 2, y: 0 }, // Right
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = [];

    dirs.forEach((d) => {
      const nx = current.x + d.x;
      const ny = current.y + d.y;
      if (
        nx > 0 &&
        nx < cols - 1 &&
        ny > 0 &&
        ny < rows - 1 &&
        grid[ny][nx] === 1
      ) {
        neighbors.push({ nx, ny, dx: d.x / 2, dy: d.y / 2 });
      }
    });

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      // Carve path
      grid[next.ny][next.nx] = 0;
      grid[current.y + next.dy][current.x + next.dx] = 0; // Wall between
      stack.push({ x: next.nx, y: next.ny });
    } else {
      stack.pop();
    }
  }

  // Ensure goal is reachable (DFS guarantees spanning tree, but ensure box isn't blocked accidentally by even sizes)
  grid[rows - 2][cols - 2] = 0;

  return grid;
}

function handleKey(e) {
  if (state.options.isPaused) return;
  if (e.key === "ArrowUp") move("up");
  if (e.key === "ArrowDown") move("down");
  if (e.key === "ArrowLeft") move("left");
  if (e.key === "ArrowRight") move("right");
}

function move(dir) {
  let nx = state.player.x;
  let ny = state.player.y;

  if (dir === "up") ny--;
  if (dir === "down") ny++;
  if (dir === "left") nx--;
  if (dir === "right") nx++;

  // Check bounds & wall
  if (state.grid[ny] && state.grid[ny][nx] === 0) {
    state.player.x = nx;
    state.player.y = ny;
    updatePlayerPos();
    checkWin();
  }
}

function render() {
  const cellSize = Math.min(300 / state.cols, 20); // Responsive cell size

  state.container.innerHTML = `
        <div class="maze-game">
            <div class="maze-header">Level ${state.level}</div>
            
            <div class="maze-board" style="
                width: ${state.cols * cellSize}px; 
                height: ${state.rows * cellSize}px;
                grid-template-columns: repeat(${state.cols}, 1fr);
            ">
                ${state.grid
                  .flat()
                  .map((cell, i) => {
                    const x = i % state.cols;
                    const y = Math.floor(i / state.cols);
                    const isPlayer =
                      x === state.player.x && y === state.player.y;
                    const isGoal = x === state.goal.x && y === state.goal.y;

                    let className = "maze-cell";
                    if (cell === 1) className += " wall";
                    if (isPlayer) className += " player";
                    if (isGoal) className += " goal";

                    return `<div class="${className}" style="width:${cellSize}px; height:${cellSize}px;"></div>`;
                  })
                  .join("")}
            </div>

            <div class="maze-controls">
                <div class="dpad-row">
                    <button class="dpad-btn" data-dir="up">⬆️</button>
                </div>
                <div class="dpad-row">
                    <button class="dpad-btn" data-dir="left">⬅️</button>
                    <button class="dpad-btn" data-dir="down">⬇️</button>
                    <button class="dpad-btn" data-dir="right">➡️</button>
                </div>
            </div>
        </div>
    `;
}

// Optimized render: only update player class
function updatePlayerPos() {
  const cells = state.container.querySelectorAll(".maze-cell");
  // Clear old player
  const oldPlayer = state.container.querySelector(".maze-cell.player");
  if (oldPlayer) oldPlayer.classList.remove("player");

  // Set new player
  const index = state.player.y * state.cols + state.player.x;
  cells[index].classList.add("player");
}

function checkWin() {
  if (state.player.x === state.goal.x && state.player.y === state.goal.y) {
    setTimeout(() => {
      alert("Maze Escaped!");
      if (state.level < 3) {
        startGame(state.level + 1);
      } else {
        // Clean up listener before exit
        document.removeEventListener("keydown", handleKey);
        state.options.onGameOver(100 * state.level);
      }
    }, 100);
  }
}
