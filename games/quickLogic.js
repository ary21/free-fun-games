/**
 * Quick Logic Reflex Game
 * Whack-a-mole but with changing rules.
 */

let state = {
  score: 0,
  time: 30,
  activeItems: [],
  timerId: null,
  spawnId: null,
  currentRule: null,
  container: null,
  options: {},
};

const ITEMS = [
  { type: "fruit", color: "red", icon: "🍎" },
  { type: "fruit", color: "yellow", icon: "🍌" },
  { type: "animal", color: "gray", icon: "🐭" },
  { type: "animal", color: "green", icon: "🐸" },
  { type: "vehicle", color: "red", icon: "🚗" },
  { type: "vehicle", color: "blue", icon: "✈️" },
];

const RULES = [
  { text: "Tap Red Items! 🔴", filter: (i) => i.color === "red" },
  { text: "Tap Animals! 🐾", filter: (i) => i.type === "animal" },
  { text: "Tap Fruits! 🍎", filter: (i) => i.type === "fruit" },
];

export function init(container, options) {
  state.container = container;
  state.options = options;
  state.score = 0;
  state.time = 30;

  clearInterval(state.timerId);
  clearInterval(state.spawnId);

  startGame();
}

function startGame() {
  state.currentRule = RULES[Math.floor(Math.random() * RULES.length)];

  renderInfo();
  state.container.innerHTML += `<div class="reflex-grid"></div>`;

  state.timerId = setInterval(() => {
    state.time--;
    updateInfo();
    if (state.time <= 0) endGame();
  }, 1000);

  state.spawnId = setInterval(spawnItem, 800);
}

function renderInfo() {
  state.container.innerHTML = `
        <div class="reflex-game">
            <div class="reflex-header">
                <div class="rule-box">${state.currentRule.text}</div>
                <div class="stats-box">Time: <span id="r-time">${state.time}</span> | Score: <span id="r-score">${state.score}</span></div>
            </div>
        </div>
    `;
}

function updateInfo() {
  document.getElementById("r-time").textContent = state.time;
  document.getElementById("r-score").textContent = state.score;
}

function spawnItem() {
  const grid = state.container.querySelector(".reflex-grid");
  if (!grid) return;

  if (grid.children.length > 8) {
    // Remove oldest
    grid.removeChild(grid.firstChild);
  }

  const itemData = ITEMS[Math.floor(Math.random() * ITEMS.length)];
  const el = document.createElement("div");
  el.className = "reflex-item";
  el.textContent = itemData.icon;
  el.onclick = () => handleClick(itemData, el);

  // Random position or just grid flow? Let's do grid flow for simplicity but animate in
  grid.appendChild(el);

  anime({
    targets: el,
    scale: [0, 1],
    duration: 300,
  });

  // Auto remove after 2s
  setTimeout(() => {
    if (el.parentNode) {
      anime({
        targets: el,
        scale: 0,
        duration: 200,
        complete: () => {
          if (el.parentNode) el.remove();
        },
      });
    }
  }, 2000);
}

function handleClick(item, el) {
  if (state.currentRule.filter(item)) {
    // Correct
    state.score += 5;
    el.style.backgroundColor = "#96CEB4"; // Greenish
    el.textContent = "+5";
  } else {
    // Wrong
    state.score -= 2;
    el.style.backgroundColor = "#FF6B6B"; // Redish
    el.textContent = "-2";
    state.container.querySelector(".reflex-header").classList.add("shake");
    setTimeout(
      () =>
        state.container
          .querySelector(".reflex-header")
          .classList.remove("shake"),
      400
    );
  }
  updateInfo();

  // Remove immediately
  setTimeout(() => el.remove(), 200);
}

function endGame() {
  clearInterval(state.timerId);
  clearInterval(state.spawnId);

  state.container.innerHTML = `
        <div class="game-over">
            <h2>Time's Up!</h2>
            <p>Score: ${state.score}</p>
            <button class="primary-btn" onclick="document.dispatchEvent(new CustomEvent('nav-home'))">Menu</button>
        </div>
    `;
  // We need a way to go home or replay.
  // Hack: add event listener to main doc or pass callback differently.
  // For now we rely on the global back button or this custom implementation
  state.container.querySelector("button").addEventListener("click", () => {
    // Trigger game over callback
    state.options.onGameOver(state.score);
  });
}
