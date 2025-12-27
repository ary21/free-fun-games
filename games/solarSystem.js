/**
 * Interactive 3D Solar System Module
 * Uses Three.js
 */

let state = {
  container: null,
  options: {},
  scene: null,
  camera: null,
  renderer: null,
  planets: [],
  animationId: null,
  raycaster: new THREE.Raycaster(),
  mouse: new THREE.Vector2(),
  isDragging: false,
  previousMousePosition: { x: 0, y: 0 },
};

const PLANET_DATA = [
  {
    name: "Sun",
    color: 0xffff00,
    size: 4,
    distance: 0,
    speed: 0,
    desc: "The Sun is a star at the center of the Solar System. It is hot!",
  },
  {
    name: "Mercury",
    color: 0xaaaaaa,
    size: 0.8,
    distance: 6,
    speed: 0.04,
    desc: "Mercury is the smallest planet and closest to the Sun.",
  },
  {
    name: "Venus",
    color: 0xffcc00,
    size: 1.2,
    distance: 9,
    speed: 0.015,
    desc: "Venus is the hottest planet in our solar system.",
  },
  {
    name: "Earth",
    color: 0x2233ff,
    size: 1.3,
    distance: 13,
    speed: 0.01,
    desc: "Earth is our home! It is the only planet with life (so far).",
  },
  {
    name: "Mars",
    color: 0xff3300,
    size: 1.0,
    distance: 17,
    speed: 0.008,
    desc: "Mars is known as the Red Planet. Robots actully drive there!",
  },
  {
    name: "Jupiter",
    color: 0xffaa88,
    size: 2.5,
    distance: 24,
    speed: 0.004,
    desc: "Jupiter is the largest planet. It is a Gas Giant.",
  },
  {
    name: "Saturn",
    color: 0xffddaa,
    size: 2.2,
    distance: 32,
    speed: 0.003,
    desc: "Saturn has beautiful rings made of ice and rock.",
  },
  {
    name: "Uranus",
    color: 0x66ccff,
    size: 1.8,
    distance: 40,
    speed: 0.002,
    desc: "Uranus spins on its side. It is an Ice Giant.",
  },
  {
    name: "Neptune",
    color: 0x3333ff,
    size: 1.8,
    distance: 48,
    speed: 0.001,
    desc: "Neptune is very far away, cold, and windy.",
  },
];

export function init(container, options) {
  state.container = container;
  state.options = options;
  startScene();
}

function startScene() {
  state.container.innerHTML = `
        <div class="space-game">
            <div id="canvas-container"></div>
            <div id="planet-info" class="planet-info hidden">
                <h2 id="p-name"></h2>
                <p id="p-desc"></p>
                <button id="close-info">Close</button>
            </div>
            <div class="space-controls">
                Drag to rotate view | Click planets for facts
            </div>
        </div>
    `;

  const canvasContainer = document.getElementById("canvas-container");
  const width = canvasContainer.clientWidth;
  const height = canvasContainer.clientHeight;

  // SCENE
  state.scene = new THREE.Scene();
  state.scene.background = new THREE.Color(0x000011);

  // CAMERA
  state.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  state.camera.position.z = 60;
  state.camera.position.y = 20;
  state.camera.lookAt(0, 0, 0);

  // RENDERER
  state.renderer = new THREE.WebGLRenderer({ antialias: true });
  state.renderer.setSize(width, height);
  canvasContainer.appendChild(state.renderer.domElement);

  // LIGHTS
  const ambientLight = new THREE.AmbientLight(0x333333);
  state.scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 2, 100);
  pointLight.position.set(0, 0, 0);
  state.scene.add(pointLight);

  // MESHES
  state.planets = [];
  PLANET_DATA.forEach((data) => {
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: data.color,
      roughness: 0.7,
      emissive: data.name === "Sun" ? 0xffff00 : 0x000000,
      emissiveIntensity: data.name === "Sun" ? 0.5 : 0,
    });
    const mesh = new THREE.Mesh(geometry, material);

    // Rings for Saturn
    if (data.name === "Saturn") {
      const ringGeo = new THREE.RingGeometry(3, 5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xaaddff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      mesh.add(ring);
    }

    mesh.userData = data; // store data for interaction

    // Pivot point for orbit
    const pivot = new THREE.Object3D();
    pivot.rotation.y = Math.random() * Math.PI * 2; // Random start angle
    pivot.add(mesh);
    state.scene.add(pivot);
    mesh.position.x = data.distance;

    state.planets.push({ mesh, pivot, data });
  });

  // Stars
  addStars();

  // Event Listeners
  window.addEventListener("resize", onWindowResize, false);

  // Interaction
  state.renderer.domElement.addEventListener("pointerdown", onPointerDown);
  state.renderer.domElement.addEventListener("pointermove", onPointerMove);
  state.renderer.domElement.addEventListener("pointerup", onPointerUp);

  // Info box
  document.getElementById("close-info").addEventListener("click", () => {
    document.getElementById("planet-info").classList.add("hidden");
  });

  animate();
}

function addStars() {
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1000;
  const posArray = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 200;
  }

  starGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
  const starMat = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff });
  const starMesh = new THREE.Points(starGeo, starMat);
  state.scene.add(starMesh);
}

function animate() {
  state.animationId = requestAnimationFrame(animate);

  // Rotate Planets
  state.planets.forEach((p) => {
    p.pivot.rotation.y += p.data.speed;
    p.mesh.rotation.y += 0.01; // Self rotation
  });

  state.renderer.render(state.scene, state.camera);
}

function onWindowResize() {
  if (!state.container || !state.camera) return;
  const canvasContainer = document.getElementById("canvas-container");
  const width = canvasContainer.clientWidth;
  const height = canvasContainer.clientHeight;

  state.camera.aspect = width / height;
  state.camera.updateProjectionMatrix();
  state.renderer.setSize(width, height);
}

// Simple Orbit interaction
function onPointerDown(e) {
  state.isDragging = true;
  state.previousMousePosition = { x: e.clientX, y: e.clientY };

  // Check click for raycasting
  const rect = state.renderer.domElement.getBoundingClientRect();
  state.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  state.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  state.raycaster.setFromCamera(state.mouse, state.camera);
  // Flat map of planet meshes
  const meshes = state.planets.map((p) => p.mesh);
  const intersects = state.raycaster.intersectObjects(meshes);

  if (intersects.length > 0) {
    showInfo(intersects[0].object.userData);
  }
}

function onPointerMove(e) {
  if (state.isDragging) {
    const deltaMove = {
      x: e.clientX - state.previousMousePosition.x,
      y: e.clientY - state.previousMousePosition.y,
    };

    const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        0, // toRad(deltaMove.y * 1),
        toRadians(deltaMove.x * 0.5),
        0,
        "XYZ"
      )
    );

    // Rotate scene/camera grouping (simplification: rotate camera parent or pivot)
    // Here we just rotate scene for simplicity in this MVP
    state.scene.rotation.y += toRadians(deltaMove.x * 0.5);

    state.previousMousePosition = { x: e.clientX, y: e.clientY };
  }
}

function onPointerUp() {
  state.isDragging = false;
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function showInfo(data) {
  const info = document.getElementById("planet-info");
  document.getElementById("p-name").textContent = data.name;
  document.getElementById("p-desc").textContent = data.desc;
  info.classList.remove("hidden");
  info.style.borderColor = "#" + data.color.toString(16).padStart(6, "0");
}
