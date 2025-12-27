/**
 * Main Application Logic
 * Handles routing, global state, and game management.
 */

// Global State
const state = {
  games: [],
  settings: {
    sound: true,
    music: true,
  },
  activeGame: null,
};

// --- Storage Management ---
const STORAGE_KEY = "kidsGameProgress";

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    state.settings = { ...state.settings, ...parsed.settings };
    // We will merge game progress when we load specific games,
    // or keep a central progress object here.
    state.progress = parsed.progress || {};
  } else {
    state.progress = {};
  }
}

function saveState() {
  const data = {
    settings: state.settings,
    progress: state.progress,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// --- Game Registry ---
// We will register games here. Each game module should export a setup function.
function registerGame(id, title, icon, color, initFunction) {
  state.games.push({ id, title, icon, color, initFunction });
}

// --- UI Management ---

function renderGameGrid() {
  const grid = document.getElementById("games-grid");
  grid.innerHTML = "";

  state.games.forEach((game) => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.style.borderColor = game.color; // Subtle border hint
    card.innerHTML = `
            <div class="game-icon">${game.icon}</div>
            <div class="game-title">${game.title}</div>
        `;
    card.addEventListener("click", () => loadGame(game));
    grid.appendChild(card);
  });
}

function loadGame(game) {
  // 1. Switch View
  document.getElementById("home-view").classList.remove("active");
  document.getElementById("home-view").classList.add("hidden");

  const gameView = document.getElementById("game-view");
  gameView.classList.remove("hidden");
  gameView.classList.add("active");

  // 2. Clear previous game container
  const container = document.getElementById("game-container");
  container.innerHTML = "";

  // 3. Initialize Game
  state.activeGame = game;
  if (game.initFunction) {
    game.initFunction(container, {
      soundEnabled: state.settings.sound,
      onGameOver: (score) => handleGameOver(game.id, score),
    });
  }
}

function goHome() {
  // 1. Cleanup Active Game (if needed)
  // We might need a cleanup method in the game interface later.

  // 2. Switch View
  document.getElementById("game-view").classList.remove("active");
  document.getElementById("game-view").classList.add("hidden");

  const homeView = document.getElementById("home-view");
  homeView.classList.remove("hidden");
  homeView.classList.add("active");

  state.activeGame = null;
  document.getElementById("game-container").innerHTML = "";
}

function handleGameOver(gameId, score) {
  // Save progress
  if (!state.progress[gameId]) {
    state.progress[gameId] = { bestScore: 0, lastPlayed: Date.now() };
  }

  // Update best score logic (depends on game type, assumign higher is better for now)
  if (score > state.progress[gameId].bestScore) {
    state.progress[gameId].bestScore = score;
  }
  state.progress[gameId].lastPlayed = Date.now();
  saveState();

  // Show simple alert or modal (can be upgraded later)
  alert(`Good Job! Score: ${score}`);
  goHome();
}

// --- Settings & Modal ---
function initSettings() {
  const modal = document.getElementById("settings-modal");
  const btn = document.getElementById("settings-btn");
  const closeBtn = modal.querySelector('button[value="close"]');
  const soundToggle = document.getElementById("sound-toggle");
  const musicToggle = document.getElementById("music-toggle");
  const resetBtn = document.getElementById("reset-progress-btn");

  // Load initial values
  soundToggle.checked = state.settings.sound;
  musicToggle.checked = state.settings.music;

  // Events
  btn.addEventListener("click", () => modal.showModal());
  closeBtn.addEventListener("click", () => modal.close());

  soundToggle.addEventListener("change", (e) => {
    state.settings.sound = e.target.checked;
    saveState();
    // Notify active game if needed? Global audio manager handles this eventually.
  });

  musicToggle.addEventListener("change", (e) => {
    state.settings.music = e.target.checked;
    saveState();
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all game progress?")) {
      state.progress = {};
      saveState();
      alert("Progress reset!");
    }
  });

  // Also close on click outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
}

// Game Modules
import * as MemoryGame from "./games/memory.js";
import * as SimonGame from "./games/simon.js";
import * as SortingGame from "./games/sorting.js";
import * as SlidingGame from "./games/sliding.js";
import * as MazeGame from "./games/maze.js";
import * as CountingGame from "./games/counting.js";
import * as ShapeGame from "./games/shapeMatcher.js";
import * as ColorGame from "./games/colorMixer.js";
import * as QuickGame from "./games/quickLogic.js";
import * as SolarGame from "./games/solarSystem.js";
import * as OceanGame from "./games/ocean.js";
import * as ForestGame from "./games/forest.js";

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  initSettings();

  // Global Navigation
  document.getElementById("back-home-btn").addEventListener("click", goHome);

  // Register Games
  registerGame("memory", "Memory", "🎴", "#FF6B6B", MemoryGame.init);
  registerGame("simon", "Pattern", "💡", "#4ECDC4", SimonGame.init);
  registerGame("sorting", "Sorting", "🧺", "#FFEEAD", SortingGame.init);
  registerGame("logic", "Puzzle", "🧩", "#96CEB4", SlidingGame.init);
  registerGame("maze", "Maze", "🗺️", "#D4A5A5", MazeGame.init);
  registerGame("counting", "Math", "1️⃣", "#9FA8DA", CountingGame.init);
  registerGame("shapes", "Shapes", "📐", "#FFD93D", ShapeGame.init);
  registerGame("color", "Colors", "🎨", "#FF6B6B", ColorGame.init);
  registerGame("quick", "Reflex", "⚡", "#6C5CE7", QuickGame.init);

  // 3D Scenes
  registerGame("space", "Space", "🪐", "#2D3436", SolarGame.init);
  registerGame("ocean", "Ocean", "🐠", "#0984e3", OceanGame.init);
  registerGame("forest", "Forest", "🌲", "#00b894", ForestGame.init);

  renderGameGrid();
});
