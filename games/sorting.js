/**
 * Sorting / Classify Game Module
 * Uses interact.js for drag and drop.
 */

let state = {
  level: 1,
  score: 0,
  items: [],
  buckets: [],
  completed: 0,
  container: null,
  options: {},
};

const CATEGORIES = {
  animals: {
    label: "Animals 🐾",
    items: ["🐶", "🐱", "🐮", "🐷", "🦁", "🐯", "🐼", "🐨"],
  },
  fruits: {
    label: "Fruits 🍎",
    items: ["🍎", "🍌", "🍇", "🍉", "🍓", "🍑", "🍍", "🥭"],
  },
  vehicles: {
    label: "Vehicles 🚗",
    items: ["🚗", "🚕", "🚌", "🚓", "🚑", "🚒", "✈️", "🚀"],
  },
  shapes: { label: "Shapes 🔶", items: ["🔴", "🔵", "🔶", "⬛", "❤️", "⭐"] }, // Simplified shapes as emojis
};

const LEVELS = [
  { buckets: ["animals", "fruits"], itemCount: 6 },
  { buckets: ["vehicles", "animals", "fruits"], itemCount: 9 },
  { buckets: ["shapes", "vehicles", "fruits"], itemCount: 12 },
];

export function init(container, options) {
  state.container = container;
  state.options = options;
  state.level = 1;
  state.score = 0;

  // Cleanup previous interact listeners if needed?
  //Interact.js is global, might need careful cleanup.
  // For this simple app, we just re-init or unset.

  startGame(state.level);
}

function startGame(level) {
  // Reset State
  state.level = level;
  state.completed = 0;

  const config = LEVELS[level - 1] || LEVELS[LEVELS.length - 1];
  state.buckets = config.buckets;

  // Generate Items
  state.items = [];
  const itemsPerBucket = Math.ceil(config.itemCount / state.buckets.length);

  state.buckets.forEach((cat) => {
    const pool = CATEGORIES[cat].items;
    // simplistic random pick
    for (let i = 0; i < itemsPerBucket; i++) {
      const item = pool[Math.floor(Math.random() * pool.length)];
      state.items.push({
        id: Math.random().toString(36).substr(2, 9),
        category: cat,
        content: item,
      });
    }
  });

  // Shuffle items
  state.items.sort(() => Math.random() - 0.5);

  render();
  setupInteractions();
}

function render() {
  state.container.innerHTML = `
        <div class="sorting-game">
            <div class="sorting-header">Level ${state.level}</div>
            
            <div class="drop-zones">
                ${state.buckets
                  .map(
                    (cat) => `
                    <div class="drop-zone" data-category="${cat}">
                        <div class="zone-label">${CATEGORIES[cat].label}</div>
                    </div>
                `
                  )
                  .join("")}
            </div>

            <div class="draggable-area">
                ${state.items
                  .map(
                    (item) => `
                    <div class="draggable-item" data-category="${item.category}" id="${item.id}">
                        ${item.content}
                    </div>
                `
                  )
                  .join("")}
            </div>
            
            <div id="sort-msg" class="sort-message"></div>
        </div>
    `;
}

function setupInteractions() {
  // Draggable
  interact(".draggable-item").draggable({
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

  // Drop Zones
  interact(".drop-zone").dropzone({
    accept: ".draggable-item",
    overlap: 0.5,

    ondragenter: function (event) {
      var draggableElement = event.relatedTarget;
      var dropzoneElement = event.target;
      dropzoneElement.classList.add("drop-active");
      draggableElement.classList.add("can-drop");
    },
    ondragleave: function (event) {
      event.target.classList.remove("drop-active");
      event.relatedTarget.classList.remove("can-drop");
    },
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

function handleDrop(item, zone) {
  const itemCat = item.dataset.category;
  const zoneCat = zone.dataset.category;

  if (itemCat === zoneCat) {
    // Correct!
    makeCorrect(item);
    zone.classList.remove("drop-active");
    state.completed++;
    checkCompletion();
  } else {
    // Incorrect
    makeIncorrect(item);
    zone.classList.remove("drop-active");
  }
}

function makeCorrect(item) {
  item.classList.add("sorted");
  // Disable dragging
  interact(item).unset();
  // Visual feedback matches
  item.textContent += " ✅";
  playFeedback(true);
}

function makeIncorrect(item) {
  item.classList.add("shake");
  playFeedback(false);
  setTimeout(() => {
    item.classList.remove("shake");
    // Reset position logic could be added here to snap back
    // For now, it stays where dropped but gives visual error
    resetPosition(item);
  }, 500);
}

function resetPosition(item) {
  item.style.transform = "translate(0px, 0px)";
  item.setAttribute("data-x", 0);
  item.setAttribute("data-y", 0);
}

function checkCompletion() {
  if (state.completed >= state.items.length) {
    // Level Complete
    const msg = document.getElementById("sort-msg");
    msg.textContent = "Awesome! 🎉";

    setTimeout(() => {
      if (state.level < LEVELS.length) {
        startGame(state.level + 1);
      } else {
        state.options.onGameOver(state.score + 100);
      }
    }, 1500);
  }
}

function playFeedback(isCorrect) {
  if (!state.options.soundEnabled) return;
  // console.log(isCorrect ? 'Ding!' : 'Buzz!');
}
