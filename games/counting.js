/**
 * Counting & Pattern Fill Game Module
 * Simple math and logic questions.
 */

let state = {
  level: 1,
  score: 0,
  questionIndex: 0,
  questions: [],
  container: null,
  options: {},
};

export function init(container, options) {
  state.container = container;
  state.options = options;
  state.level = 1;
  state.score = 0;
  startGame(state.level);
}

function startGame(level) {
  state.level = level;
  state.questionIndex = 0;

  // Generate Questions
  // Level 1: Counting objects (1-5)
  // Level 2: Simple Math (Add/Sub up to 10)
  // Level 3: Pattern Fill (1, 2, ?, 4)
  state.questions = generateQuestions(level, 5); // 5 questions per level

  render();
}

function generateQuestions(level, count) {
  const qs = [];
  for (let i = 0; i < count; i++) {
    if (level === 1) {
      // Counting
      const num = Math.floor(Math.random() * 5) + 1;
      const emoji = ["🍎", "🍌", "🚗", "⭐", "🐶"][
        Math.floor(Math.random() * 5)
      ];
      qs.push({
        type: "counting",
        text: `How many ${emoji} are there?`,
        content: Array(num).fill(emoji).join(" "),
        answer: num,
        options: shuffle([num, num + 1, num - 1 || 1]),
      });
    } else if (level === 2) {
      // Math
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      qs.push({
        type: "math",
        text: `What is ${a} + ${b}?`,
        content: `${a} + ${b} = ?`,
        answer: a + b,
        options: shuffle([a + b, a + b + 1, a + b - 1]),
      });
    } else {
      // Pattern
      const start = Math.floor(Math.random() * 5) + 1;
      const step = Math.floor(Math.random() * 2) + 1;
      const arr = [start, start + step, start + step * 2, start + step * 3];
      const hiddenIdx = Math.floor(Math.random() * 4);
      const ans = arr[hiddenIdx];
      arr[hiddenIdx] = "?";

      qs.push({
        type: "pattern",
        text: "Complete the pattern:",
        content: arr.join("  "),
        answer: ans,
        options: shuffle([ans, ans + step, ans - step]),
      });
    }
  }
  return qs;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function render() {
  if (state.questionIndex >= state.questions.length) {
    // Level Complete
    state.container.innerHTML = `
            <div class="counting-game">
                <h2>Level Complete! 🌟</h2>
                <button id="next-math-btn" class="primary-btn">
                     ${state.level < 3 ? "Next Level" : "Finish"}
                </button>
            </div>
        `;
    document.getElementById("next-math-btn").addEventListener("click", () => {
      if (state.level < 3) {
        startGame(state.level + 1);
      } else {
        state.options.onGameOver(state.score);
      }
    });
    return;
  }

  const q = state.questions[state.questionIndex];

  state.container.innerHTML = `
        <div class="counting-game">
            <div class="counting-header">Level ${state.level} - Q${
    state.questionIndex + 1
  }</div>
            
            <div class="question-card">
                <div class="q-text">${q.text}</div>
                <div class="q-content">${q.content}</div>
                
                <div class="options-grid">
                    ${q.options
                      .map(
                        (opt) => `
                        <button class="option-btn" data-val="${opt}">${opt}</button>
                    `
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `;

  state.container.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      handleAnswer(parseInt(e.target.dataset.val), q.answer)
    );
  });
}

function handleAnswer(selected, correct) {
  if (selected === correct) {
    state.container
      .querySelector(`.option-btn[data-val="${selected}"]`)
      .classList.add("correct");
    state.score += 10;
    setTimeout(() => {
      state.questionIndex++;
      render();
    }, 1000);
  } else {
    state.container
      .querySelector(`.option-btn[data-val="${selected}"]`)
      .classList.add("wrong");
  }
}
