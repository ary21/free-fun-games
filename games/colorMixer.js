/**
 * Color Mixer Game Module
 * Mix primary colors to make secondary colors.
 */

let state = {
  level: 1,
  targetColor: "",
  selected: [],
  container: null,
  options: {},
};

const RECIPES = [
  { result: "orange", mix: ["red", "yellow"], label: "Orange 🍊" },
  { result: "green", mix: ["blue", "yellow"], label: "Green 🍏" },
  { result: "purple", mix: ["red", "blue"], label: "Purple 🍇" },
  { result: "pink", mix: ["red", "white"], label: "Pink 🌸" },
  { result: "skyblue", mix: ["blue", "white"], label: "Sky Blue ☁️" },
];

const COLORS = {
  red: "#FF4444",
  blue: "#4444FF",
  yellow: "#FFFF44",
  white: "#FFFFFF",
};

const RESULT_COLORS = {
  orange: "#FFA500",
  green: "#44FF44",
  purple: "#800080",
  pink: "#FFC0CB",
  skyblue: "#87CEEB",
};

export function init(container, options) {
  state.container = container;
  state.options = options;
  state.level = 1;
  startGame();
}

function startGame() {
  state.selected = [];
  const recipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
  state.targetColor = recipe;

  render();
}

function render() {
  state.container.innerHTML = `
        <div class="mixer-game">
            <div class="game-header">Make: ${state.targetColor.label}</div>
            
            <div class="mixing-pot">
                <div class="pot-liquid" style="background-color: ${getMixColor()}"></div>
            </div>

            <div class="paint-tubes">
                ${Object.keys(COLORS)
                  .map(
                    (c) => `
                    <button class="paint-btn" data-color="${c}" style="background-color: ${COLORS[c]}"></button>
                `
                  )
                  .join("")}
            </div>
            
            <div class="mixer-controls">
                <button id="reset-mix">Clear</button>
                <button id="check-mix" class="primary-btn">Mix!</button>
            </div>
            <div id="mix-msg" class="center-msg"></div>
        </div>
    `;

  // Events
  state.container.querySelectorAll(".paint-btn").forEach((btn) => {
    btn.addEventListener("click", () => addColor(btn.dataset.color));
  });

  document.getElementById("reset-mix").addEventListener("click", () => {
    state.selected = [];
    updateLiquid();
  });

  document.getElementById("check-mix").addEventListener("click", checkMix);
}

function addColor(color) {
  if (state.selected.length < 2) {
    state.selected.push(color);
    updateLiquid();
  }
}

function getMixColor() {
  if (state.selected.length === 0) return "#eee";
  if (state.selected.length === 1) return COLORS[state.selected[0]];
  // Simple visual approximation or just gray until mixed?
  // Let's show split gradient for fun
  return `linear-gradient(to right, ${COLORS[state.selected[0]]}, ${
    COLORS[state.selected[1]]
  })`;
}

function updateLiquid() {
  const liquid = state.container.querySelector(".pot-liquid");
  liquid.style.background = getMixColor();
}

function checkMix() {
  const s = state.selected.sort();
  const t = state.targetColor.mix.sort();

  if (JSON.stringify(s) === JSON.stringify(t)) {
    // Success
    const liquid = state.container.querySelector(".pot-liquid");
    liquid.style.background = RESULT_COLORS[state.targetColor.result];
    document.getElementById("mix-msg").textContent = "Correct! 🌟";
    setTimeout(startGame, 1500);
  } else {
    document.getElementById("mix-msg").textContent = "Oops! Try again.";
    state.container.querySelector(".mixing-pot").classList.add("shake");
    setTimeout(() => {
      state.container.querySelector(".mixing-pot").classList.remove("shake");
      state.selected = [];
      updateLiquid();
    }, 1000);
  }
}
