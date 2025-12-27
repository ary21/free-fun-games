# Kid-Friendly Mini-Game Hub 🎮

A collection of **12** interactive, educational mini-games and 3D scenes designed for children aged 4-10. Features logic puzzles, memory training, sorting activities, and immersive 3D environments.

## Features ✨

- **9 Interactive Games**:
  1.  **Memory Match**: Flip cards to find pairs.
  2.  **Pattern Sequence**: Follow the lights (Simon).
  3.  **Sorting**: Sort animals, fruits, and vehicles.
  4.  **Puzzle**: Classic sliding tile puzzle.
  5.  **Maze**: Find the path to the flag.
  6.  **Counting**: Math and counting questions.
  7.  **Shapes**: Match objects to their shadows.
  8.  **Colors**: Mix paints to create new colors.
  9.  **Quick Logic**: Tap items based on changing rules (Reflex).
- **3 Interactive 3D Scenes**:
  1.  **Space**: Solar System explorer.
  2.  **Ocean**: Underwater scene with swimming fish.
  3.  **Forest**: Nature scene with interactive trees.
- **Kid-Friendly UI**: Large buttons, bright colors, simple icons (emojis), and no text-heavy instructions.
- **Offline Capable**: Works purely in the browser with no backend requirements.
- **Parental Controls**: Settings to toggle sound/music and reset progress.
- **Privacy First**: No external tracking or analytics. Progress is saved locally on your device.

## Setup & Run 🚀

This project is a static web application. You don't need to install complex dependencies to run it.

1.  **Open the Folder**: Navigate to this folder on your computer.
2.  **Launch**: Double-click `index.html` to open it in your web browser (Chrome, Firefox, Safari, Edge).
    - _Note: For the 3D scenes, some browsers might block texture loading if opened directly. If you see blank screens, try running a local server._

### Running with a Local Server (Recommended)

If you have Python installed (Mac/Linux usually do):

```bash
# Run this in your terminal inside the project folder
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Tech Stack 🛠️

- **Core**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules).
- **Animations**: [Anime.js](https://animejs.com/)
- **Audio**: [Howler.js](https://howlerjs.com/)
- **Interactions**: [Interact.js](https://interactjs.io/)
- **3D Graphics**: [Three.js](https://threejs.org/)

## Privacy Note 🔒

This application does **not** collect, store, or transmit any personal data. Game progress is stored solely in your browser's "Local Storage". You can clear this data at any time via the Parental Settings panel (Gear icon).
