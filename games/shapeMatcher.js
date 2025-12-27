/**
 * Shape Matcher Game Module
 * Match objects to their silhouettes.
 */

let state = {
  level: 1,
  score: 0,
  items: [],
  completed: 0,
  container: null,
  options: {},
};

const SHAPES = [
  { id: "star", content: "⭐", color: "#ffd700" },
  { id: "heart", content: "❤️", color: "#ff0000" },
  { id: "circle", content: "🔵", color: "#0000ff" },
  { id: "square", content: "🟩", color: "#008000" },
  { id: "triangle", content: "🔺", color: "#ffa500" },
  { id: "diamond", content: "🔷", color: "#00ffff" },
  { id: "moon", content: "🌙", color: "#c0c0c0" },
  { id: "sun", content: "☀️", color: "#ffff00" },
];

export function init(container, options) {
  state.container = container;
  state.options = options;
  state.level = 1;
  state.score = 0;
  startGame(state.level);
}

function startGame(level) {
  state.level = level;
  state.completed = 0;

  // Pick N shapes
  const count = 3 + level; // Level 1=4, Level 2=5...
  const pool = [...SHAPES].sort(() => 0.5 - Math.random()).slice(0, count);

  state.items = pool;

  render();
  setupInteractions();
}

function render() {
  state.container.innerHTML = `
        <div class="shape-game">
            <div class="game-header">Level ${state.level}</div>
            <div class="shape-play-area">
                <div class="shapes-source">
                    ${state.items
                      .map(
                        (item) => `
                        <div class="draggable-shape" data-id="${item.id}">
                            ${item.content}
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <div class="shapes-target">
                     ${[...state.items]
                       .sort(() => 0.5 - Math.random())
                       .map(
                         (item) => `
                        <div class="shape-shadow" data-id="${item.id}">
                            ${item.content}
                        </div>
                    `
                       )
                       .join("")}
                </div>
            </div>
            <div id="shape-msg" class="center-msg"></div>
        </div>
    `;
}

function setupInteractions() {
  interact(".draggable-shape").draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: true,
      }),
    ],
    autoScroll: true,
    listeners: { move: dragMoveListener },
  });

  interact(".shape-shadow").dropzone({
    accept: ".draggable-shape",
    overlap: 0.5,
    ondrop: function (event) {
      handleDrop(event.relatedTarget, event.target);
    },
  });
}

function dragMoveListener(event) {
  var target = event.target;
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  target.style.transform = "translate(" + x + "px, " + y + "px)";
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

function handleDrop(dragged, target) {
  if (dragged.dataset.id === target.dataset.id) {
    // Correct
    dragged.classList.add("matched");
    target.classList.add("filled");
    // Snap to target visually (simple hide drag, show target filled)
    dragged.style.display = "none";

    state.completed++;
    if (state.completed === state.items.length) {
      document.getElementById("shape-msg").textContent = "Perfect! ✨";
      setTimeout(() => {
        if (state.level < 3) startGame(state.level + 1);
        else state.options.onGameOver(state.score + 100);
      }, 1500);
    }
  } else {
    // Wrong
    anime({
      targets: dragged,
      translateX: 0,
      translateY: 0,
      duration: 500,
    });
    dragged.setAttribute("data-x", 0);
    dragged.setAttribute("data-y", 0);
  }
}
