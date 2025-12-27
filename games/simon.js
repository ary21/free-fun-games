/**
 * Pattern Sequence (Simon) Game Module
 */

let state = {
  sequence: [],
  playerSequence: [],
  level: 1,
  isPlayingSequence: false,
  container: null,
  options: {},
};

const COLORS = ["green", "red", "yellow", "blue"];

export function init(container, options) {
  state.container = container;
  state.options = options;
  state.level = 1;
  startGame();
}

function startGame() {
  state.sequence = [];
  state.playerSequence = [];
  state.isPlayingSequence = false;

  render();
  nextRound();
}

function render() {
  state.container.innerHTML = `
        <div class="simon-game">
            <div class="simon-status">Level: ${state.level}</div>
            <div class="simon-board">
                <button class="simon-btn green" data-color="green"></button>
                <button class="simon-btn red" data-color="red"></button>
                <button class="simon-btn yellow" data-color="yellow"></button>
                <button class="simon-btn blue" data-color="blue"></button>
                <div class="simon-center">
                    <span id="simon-message">Observe!</span>
                </div>
            </div>
        </div>
    `;

  // Attach events
  const buttons = state.container.querySelectorAll(".simon-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", handleInput);
    // Touch support optimization
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault(); // Prevent double fire
      handleInput(e);
    });
  });
}

function nextRound() {
  state.playerSequence = [];
  state.isPlayingSequence = true;
  updateMessage("Watch closely...");

  // Add new random color
  const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  state.sequence.push(randomColor);

  // Play sequence
  setTimeout(() => {
    playSequence();
  }, 1000);
}

async function playSequence() {
  for (let i = 0; i < state.sequence.length; i++) {
    await activateButton(state.sequence[i]);
    await delay(300); // Pause between notes
  }
  state.isPlayingSequence = false;
  updateMessage("Your turn!");
}

function handleInput(e) {
  if (state.isPlayingSequence) return;

  const color = e.target.dataset.color;

  // Animate click immediately
  anime({
    targets: e.target,
    scale: [0.9, 1],
    duration: 200,
    easing: "easeOutQuad",
  });
  playSound(color);

  // Check logic
  const currentIndex = state.playerSequence.length;
  state.playerSequence.push(color);

  if (color !== state.sequence[currentIndex]) {
    // Game Over
    gameOver();
    return;
  }

  if (state.playerSequence.length === state.sequence.length) {
    // Round Complete
    state.level++;
    updateMessage("Good!");
    setTimeout(nextRound, 1000);
  }
}

function gameOver() {
  updateMessage("Game Over!");
  state.container.querySelector(".simon-board").classList.add("shake");
  // Sound fail
  // playSound('fail');

  setTimeout(() => {
    if (state.options.onGameOver) {
      state.options.onGameOver(state.level); // Score is essentially the level reached
    }
  }, 1500);
}

function activateButton(color) {
  return new Promise((resolve) => {
    const btn = state.container.querySelector(`.simon-btn.${color}`);

    // Visual
    btn.classList.add("active");
    playSound(color);

    setTimeout(() => {
      btn.classList.remove("active");
      resolve();
    }, 500); // 500ms light up
  });
}

function updateMessage(msg) {
  const el = state.container.querySelector("#simon-message");
  if (el) el.textContent = msg;

  // Update score/level display too depending on design
  const status = state.container.querySelector(".simon-status");
  if (status) status.textContent = `Level: ${state.sequence.length}`;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function playSound(color) {
  if (!state.options.soundEnabled) return;
  // Map colors to frequencies or placeholder sounds
  // console.log('Playing:', color);
}
