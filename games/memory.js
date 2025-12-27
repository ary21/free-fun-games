/**
 * Memory Match Game Module
 */

let state = {
  level: 1,
  cards: [],
  flipped: [],
  matched: [],
  locked: false,
  score: 0,
  container: null,
  options: {},
};

const LEVELS = {
  1: { rows: 2, cols: 3, pairs: 3 }, // 6 cards
  2: { rows: 3, cols: 4, pairs: 6 }, // 12 cards
  3: { rows: 4, cols: 4, pairs: 8 }, // 16 cards
};

const EMOJIS = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
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
  state.flipped = [];
  state.matched = [];
  state.locked = false;

  // Generate Cards
  const config = LEVELS[level];
  const gameEmojis = EMOJIS.slice(0, config.pairs);
  const deck = [...gameEmojis, ...gameEmojis];
  shuffle(deck);

  state.cards = deck.map((emoji, index) => ({
    id: index,
    emoji: emoji,
    isFlipped: false,
    isMatched: false,
  }));

  render();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function render() {
  const config = LEVELS[state.level];

  let html = `
        <div class="memory-header">
            <h3>Level ${state.level}</h3>
            <span>Score: ${state.score}</span>
        </div>
        <div class="memory-grid" style="
            grid-template-columns: repeat(${config.cols}, 1fr);
            grid-template-rows: repeat(${config.rows}, 1fr);
        ">
            ${state.cards
              .map(
                (card) => `
                <div class="memory-card ${
                  card.isFlipped || card.isMatched ? "flipped" : ""
                }" data-id="${card.id}">
                    <div class="card-inner">
                        <div class="card-front">?</div>
                        <div class="card-back">${card.emoji}</div>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
        ${
          state.matched.length === state.cards.length
            ? `
            <div class="level-complete">
                <h2>Great Job! 🎉</h2>
                <button id="next-level-btn" class="primary-btn">
                    ${state.level < 3 ? "Next Level" : "Finish"}
                </button>
            </div>
        `
            : ""
        }
    `;

  state.container.innerHTML = html;

  // Attach events
  state.container.querySelectorAll(".memory-card").forEach((card) => {
    card.addEventListener("click", () =>
      handleCardClick(parseInt(card.dataset.id))
    );
  });

  if (state.matched.length === state.cards.length) {
    document.getElementById("next-level-btn").addEventListener("click", () => {
      if (state.level < 3) {
        startGame(state.level + 1);
      } else {
        state.options.onGameOver(state.score);
      }
    });
  }
}

function handleCardClick(id) {
  if (state.locked) return;
  const card = state.cards[id];

  if (card.isFlipped || card.isMatched) return;

  // Flip logic
  card.isFlipped = true;
  state.flipped.push(card);
  render(); // Or use DOM manipulation for better perf, but re-render is fine for this size

  // Animation via Anime.js (optional polish, using CSS transitions mainly)
  // animateFlip(id);

  playSound("flip");

  if (state.flipped.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  state.locked = true;
  const [card1, card2] = state.flipped;

  if (card1.emoji === card2.emoji) {
    // Match!
    card1.isMatched = true;
    card2.isMatched = true;
    state.matched.push(card1, card2);
    state.flipped = [];
    state.locked = false;
    state.score += 10;
    playSound("match");
    render();
  } else {
    // No Match
    setTimeout(() => {
      card1.isFlipped = false;
      card2.isFlipped = false;
      state.flipped = [];
      state.locked = false;
      render();
    }, 1000);
  }
}

function playSound(type) {
  if (!state.options.soundEnabled) return;
  // Placeholder for actual audio implementation
  // console.log('Playing sound:', type);
}
