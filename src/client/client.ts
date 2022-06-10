import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';
import { GUI } from 'dat.gui';

// Enter FPS mode
const enterButton = document.querySelector(
  '.enter-button'
) as HTMLButtonElement;
enterButton.addEventListener('click', enterControls);
function enterControls() {
  controls.lock();
}

// create keyboard controls
document.addEventListener('keydown', onWASD);
function onWASD(event: KeyboardEvent) {
  switch (event.code) {
    case 'KeyW':
      controls.moveForward(2);
      break;
    case 'KeyA':
      controls.moveRight(-2);
      break;
    case 'KeyS':
      controls.moveForward(-2);
      break;
    case 'KeyD':
      controls.moveRight(2);
      break;
  }
}

// createCamera
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 10;
camera.position.y = 2;

// createControls
const controls = new PointerLockControls(camera);

// createScene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x408efb);

// createLight
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(100, 100, 100);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);

// createTexture
const threeTone = new THREE.TextureLoader().load(
  'assets/images/three-tone.jpg'
);
threeTone.minFilter = THREE.NearestFilter;
threeTone.magFilter = THREE.NearestFilter;

// createFloor
const floorGeometry = new THREE.PlaneBufferGeometry(100, 100);
floorGeometry.rotateX(-Math.PI / 2);
const floorMaterial = new THREE.MeshToonMaterial({
  color: 0x0c8142,
  gradientMap: threeTone,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

//createTree
const tree = new THREE.Group();

const treeStemGeometry = new THREE.CylinderBufferGeometry(1, 1, 7);
const treeStemMaterial = new THREE.MeshToonMaterial({
  color: 0x81592f,
  gradientMap: threeTone,
});
const treeStem = new THREE.Mesh(treeStemGeometry, treeStemMaterial);
treeStem.geometry.computeBoundingBox();
treeStem.position.y =
  ((treeStem.geometry.boundingBox as THREE.Box3).max.y -
    (treeStem.geometry.boundingBox as THREE.Box3).min.y) /
  2;

const treeFoliageGeometry = new THREE.DodecahedronBufferGeometry(5);
const treeFoliageMaterial = new THREE.MeshToonMaterial({
  color: 0x0c8142,
  gradientMap: threeTone,
});
const treeFoliage = new THREE.Mesh(treeFoliageGeometry, treeFoliageMaterial);
treeFoliage.position.y = 10;

tree.add(treeStem, treeFoliage);

tree.position.z = -3;
tree.position.x = 3;

//createShadows
sunLight.castShadow = true;
sunLight.shadow.camera.top = 100;
sunLight.shadow.camera.bottom = -100;
sunLight.shadow.camera.left = 100;
sunLight.shadow.camera.right = -100;
sunLight.shadow.camera.far = 250;
sunLight.shadow.camera.near = 0;
sunLight.shadow.mapSize.set(4096, 4096);
floor.receiveShadow = true;
treeStem.castShadow = true;
treeFoliage.castShadow = true;

//Create helpers
const axesHelper = new THREE.AxesHelper(5);
const sunLightHelper = new THREE.CameraHelper(sunLight.shadow.camera);

// Add to scene
scene.add(axesHelper);
scene.add(sunLightHelper);

scene.add(sunLight);
scene.add(ambientLight);
scene.add(floor);
scene.add(tree);

// createRenderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
const rendererOutlined = new OutlineEffect(renderer);
document.body.appendChild(rendererOutlined.domElement);

// createGUI
const gui = new GUI();
const sunLightFolder = gui.addFolder('Sun Light');
sunLightFolder.add(sunLight.position, 'x', -100, 100, 1);
sunLightFolder.add(sunLight.position, 'y', -100, 100, 1);
sunLightFolder.add(sunLight.position, 'z', -100, 100, 1);
sunLightFolder.add(sunLight, 'intensity', 0, 1, 0.1);
sunLightFolder.open();
const ambientFolder = gui.addFolder('Ambient Light');
ambientFolder.add(ambientLight, 'intensity', 0, 1, 0.1);
ambientFolder.open();
const treeFolder = gui.addFolder('Tree');
treeFolder.add(tree.position, 'x', -100, 100, 1);
treeFolder.add(tree.position, 'y', -100, 100, 1);
treeFolder.add(tree.position, 'z', -100, 100, 1);
treeFolder.open();

function animate() {
  requestAnimationFrame(animate);
  rendererOutlined.render(scene, camera);
}

animate();
