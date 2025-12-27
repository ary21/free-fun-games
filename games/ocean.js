/**
 * 3D Ocean Explorer
 */

let state = {
  container: null,
  scene: null,
  camera: null,
  renderer: null,
  fish: [],
  bubbles: [],
  clock: new THREE.Clock(),
};

export function init(container) {
  state.container = container;
  startScene();
}

function startScene() {
  state.container.innerHTML = `<div id="ocean-canvas" style="width:100%; height:100%;"></div>`;
  const box = document.getElementById("ocean-canvas");

  state.scene = new THREE.Scene();
  state.scene.background = new THREE.Color(0x001e4d);
  state.scene.fog = new THREE.FogExp2(0x001e4d, 0.02);

  state.camera = new THREE.PerspectiveCamera(
    75,
    box.clientWidth / box.clientHeight,
    0.1,
    100
  );
  state.camera.position.z = 20;

  state.renderer = new THREE.WebGLRenderer();
  state.renderer.setSize(box.clientWidth, box.clientHeight);
  box.appendChild(state.renderer.domElement);

  // Lights
  const ambient = new THREE.AmbientLight(0x404040);
  state.scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(0, 50, 0);
  state.scene.add(dirLight);

  // Fish
  state.fish = [];
  for (let i = 0; i < 15; i++) {
    const fish = createFish();
    fish.position.set(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
    state.scene.add(fish);
    state.fish.push({
      mesh: fish,
      speed: 2 + Math.random() * 3,
      offset: Math.random() * 10,
    });
  }

  // Bubbles
  const bubbleGeo = new THREE.SphereGeometry(0.2, 8, 8);
  const bubbleMat = new THREE.MeshBasicMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.6,
  });
  state.bubbles = [];
  for (let i = 0; i < 30; i++) {
    const b = new THREE.Mesh(bubbleGeo, bubbleMat);
    b.position.set(
      (Math.random() - 0.5) * 40,
      -20 + Math.random() * 40,
      (Math.random() - 0.5) * 20
    );
    state.scene.add(b);
    state.bubbles.push(b);
  }

  animate();
}

function createFish() {
  const group = new THREE.Group();

  // Body
  const bodyGeo = new THREE.ConeGeometry(0.5, 2, 8);
  bodyGeo.rotateZ(Math.PI / 2);
  const bodyMat = new THREE.MeshLambertMaterial({
    color: Math.random() * 0xffffff,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // Tail
  const tailGeo = new THREE.ConeGeometry(0.3, 0.8, 8);
  tailGeo.rotateZ(-Math.PI / 2);
  const tail = new THREE.Mesh(tailGeo, bodyMat);
  tail.position.x = -1.2;
  group.add(tail);

  return group;
}

function animate() {
  requestAnimationFrame(animate);
  const time = state.clock.getElapsedTime();

  // Move Fish
  state.fish.forEach((f) => {
    f.mesh.position.x += f.speed * 0.03;
    f.mesh.position.y += Math.sin(time + f.offset) * 0.02;

    // Reset X
    if (f.mesh.position.x > 30) f.mesh.position.x = -30;
  });

  // Move Bubbles
  state.bubbles.forEach((b) => {
    b.position.y += 0.05;
    if (b.position.y > 20) b.position.y = -20;
  });

  state.camera.position.x = Math.sin(time * 0.2) * 2;
  state.camera.lookAt(0, 0, 0);

  state.renderer.render(state.scene, state.camera);
}
