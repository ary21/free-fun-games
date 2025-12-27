# Kid-Friendly Mini-Game Hub 🎮

A collection of interactive, educational mini-games designed for children aged 4-10. Features logic puzzles, memory training, sorting activities, and a 3D solar system explorer.

## Features ✨

- **6 Interactive Games**: Memory Match, Pattern Sequence, Sorting, Logic Blocks, Maze, and Counting.
- **3D Space Explorer**: An interactive 3D solar system scene using Three.js.
- **Kid-Friendly UI**: Large buttons, bright colors, simple icons (emojis), and no text-heavy instructions.
- **Offline Capable**: Works purely in the browser with no backend requirements.
- **Parental Controls**: Settings to toggle sound/music and reset progress.
- **Privacy First**: No external tracking or analytics. Progress is saved locally on your device.

## Setup & Run 🚀

This project is a static web application. You don't need to install complex dependencies to run it.

1.  **Open the Folder**: Navigate to this folder on your computer.
2.  **Launch**: Double-click `index.html` to open it in your web browser (Chrome, Firefox, Safari, Edge).
    - _Note: For the 3D Solar System game, some browsers might block local texture loading if you simply open the file. If you see issues, try running a local server._

### Running with a Local Server (Recommended)

If you have Python installed (Mac/Linux usually do):

```bash
# Run this in your terminal inside the project folder
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## How to Play 🕹️

- **Memory Cards**: Find matching pairs of cards by flipping them over.
- **Pattern (Simon)**: Watch the sequence of lights and repeat it.
- **Sorting**: Drag the items into the correct category bucket (e.g., Animals vs Fruits).
- **Puzzle**: Slide the tiles to put the numbers in order (1, 2, 3...).
- **Maze**: Guide the blue dot to the checkered flag using arrow keys or on-screen buttons.
- **Counting**: Answer the math or counting question by tapping the correct number.
- **Space**: Drag to look around the solar system. Click/Tap on planets to learn fun facts!

## Credits & Technologies 🛠️

- **Core**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules).
- **Animations**: [Anime.js](https://animejs.com/)
- **Audio**: [Howler.js](https://howlerjs.com/)
- **Interactions**: [Interact.js](https://interactjs.io/)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Icons**: Standard System Emojis & CSS Shapes.
- **Fonts**: [Fredoka](https://fonts.google.com/specimen/Fredoka) (Google Fonts).

## Privacy Note 🔒

This application does **not** collect, store, or transmit any personal data. Game progress is stored solely in your browser's "Local Storage". You can clear this data at any time via the Parental Settings panel (Gear icon).
