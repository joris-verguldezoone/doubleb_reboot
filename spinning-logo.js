import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let mediaQueriesX, mediaQueriesY, camera;

if (window.innerWidth <= 768) {
  mediaQueriesX = 120;
  mediaQueriesY = 160;
  camera = new THREE.PerspectiveCamera(110, mediaQueriesX / mediaQueriesY, 0.1, 1000);
} else {
  mediaQueriesX = 276;
  mediaQueriesY = 160;
  camera = new THREE.PerspectiveCamera(85, mediaQueriesX / mediaQueriesY, 0.1, 1000);
}

const initialCameraPos = new THREE.Vector3(0, 0, 18);
camera.position.copy(initialCameraPos);

let isInteracting = false;
let lastInteractionTime = Date.now();
const resetDelay = 3000; 
const lerpSpeed = 0.05;

let autoSpinSpeed = 0.015; 
let currentSpinSpeed = 0.02;

const scene = new THREE.Scene();
scene.background = null;

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 15, 100);
scene.add(pointLight);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(mediaQueriesX, mediaQueriesY);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMappingExposure = 1.4;
let domTarget = document.getElementById('webgl-container');
domTarget.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false; 
controls.enablePan = false;
controls.minDistance = 18;
controls.maxDistance = 18;

controls.addEventListener('start', () => {
  isInteracting = true;
  currentSpinSpeed = 0;
});

controls.addEventListener('end', () => {
  isInteracting = false;
  lastInteractionTime = Date.now();
});

let model;
const loader = new GLTFLoader();
loader.load('./public/gltf/BB2.gltf', (gltf) => {
  model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  scene.add(model);
}, undefined, (error) => {
  console.error('Erreur:', error);
});

function animate() {
  requestAnimationFrame(animate);
  const now = Date.now();

  pointLight.position.copy(camera.position);

  if (model) {
    if (!isInteracting && (now - lastInteractionTime > resetDelay)) {

      camera.position.lerp(initialCameraPos, lerpSpeed);
      controls.target.lerp(new THREE.Vector3(0, 0, 0), lerpSpeed);

      if (camera.position.distanceTo(initialCameraPos) < 0.1) {
        currentSpinSpeed += (autoSpinSpeed - currentSpinSpeed) * lerpSpeed;
      }
    } else if (isInteracting) {
        currentSpinSpeed = 0;
    }

    model.rotation.y += currentSpinSpeed;
  }

  controls.update(); 
  renderer.render(scene, camera);
}

animate();

const heroSection = document.querySelector('.gallery-right');
const webglContainer = document.getElementById('webgl-container');

window.addEventListener('scroll', () => {
  if (!heroSection) return;
  const sectionBottom = heroSection.getBoundingClientRect().bottom;
  webglContainer.style.display = (sectionBottom <= window.innerHeight / 2) ? 'none' : 'block';
});