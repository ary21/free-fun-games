/**
 * 3D Forest Explorer
 */

let state = {
  container: null,
  scene: null,
  camera: null,
  renderer: null,
  isInteracting: false,
  raycaster: new THREE.Raycaster(),
  mouse: new THREE.Vector2(),
};

export function init(container) {
  state.container = container;
  startScene();
}

function startScene() {
  state.container.innerHTML = `<div id="forest-canvas" style="width:100%; height:100%;"></div>`;
  const box = document.getElementById("forest-canvas");

  state.scene = new THREE.Scene();
  state.scene.background = new THREE.Color(0x87ceeb); // Sky Blue

  state.camera = new THREE.PerspectiveCamera(
    75,
    box.clientWidth / box.clientHeight,
    0.1,
    100
  );
  state.camera.position.set(0, 5, 20);
  state.camera.lookAt(0, 2, 0);

  state.renderer = new THREE.WebGLRenderer();
  state.renderer.setSize(box.clientWidth, box.clientHeight);
  box.appendChild(state.renderer.domElement);

  // Light
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  state.scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(-3, 10, -10);
  state.scene.add(dirLight);

  // Ground
  const groundGeo = new THREE.PlaneGeometry(100, 100);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  state.scene.add(ground);

  // Trees
  for (let i = 0; i < 30; i++) {
    const x = (Math.random() - 0.5) * 60;
    const z = (Math.random() - 0.5) * 60;
    if (Math.abs(x) < 2 && Math.abs(z) < 2) continue; // Clear center
    createTree(x, z);
  }

  box.addEventListener("click", onClick);

  animate();
}

function createTree(x, z) {
  const group = new THREE.Group();

  const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.5);
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 0.75;
  group.add(trunk);

  const leavesGeo = new THREE.ConeGeometry(1.5, 3, 8);
  const leavesMat = new THREE.MeshLambertMaterial({ color: 0x006400 });
  const leaves = new THREE.Mesh(leavesGeo, leavesMat);
  leaves.position.y = 2.5;
  group.add(leaves);

  // Tag for interaction
  group.userData = { type: "tree" };

  group.position.set(x, 0, z);
  state.scene.add(group);
}

function onClick(event) {
  // Simple raycast to shake a tree
  const rect = state.renderer.domElement.getBoundingClientRect();
  state.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  state.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  state.raycaster.setFromCamera(state.mouse, state.camera);
  const intersects = state.raycaster.intersectObjects(
    state.scene.children,
    true
  );

  if (intersects.length > 0) {
    // Find parent group
    let obj = intersects[0].object;
    while (obj.parent && obj.parent !== state.scene) {
      obj = obj.parent;
    }

    if (obj.userData.type === "tree") {
      shakeTree(obj);
    }
  }
}

function shakeTree(tree) {
  const startX = tree.position.x;
  // Simple shake tween logic (simulated)
  tree.rotation.z = 0.1;
  setTimeout(() => (tree.rotation.z = -0.1), 100);
  setTimeout(() => (tree.rotation.z = 0.05), 200);
  setTimeout(() => (tree.rotation.z = 0), 300);
}

function animate() {
  requestAnimationFrame(animate);
  state.renderer.render(state.scene, state.camera);
}
