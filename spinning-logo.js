import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let mediaQueriesX;
let mediaQueriesY;
let camera;

if (window.innerWidth <= 768) {
  console.log("Vous êtes sur un téléphone ou une tablette.");
  mediaQueriesX = 100;
  mediaQueriesY = 160;
  camera = new THREE.PerspectiveCamera(130, window.innerWidth / window.innerHeight, 0.1, 100);
} else {
  mediaQueriesX = 230;
  mediaQueriesY = 160;
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 80);
  console.log("Vous êtes sur un ordinateur de bureau.");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 5, 100);
scene.add(pointLight);

function mettreAJourPositionLumiere(camera) {
  const cameraX = camera.position.x;
  const cameraY = camera.position.y;
  const cameraZ = camera.position.z;
  pointLight.position.set(cameraX, cameraY, cameraZ + 10);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.toneMappingExposure = 1; 
let domTarget = document.getElementById('webgl-container');
domTarget.appendChild(renderer.domElement);
renderer.setSize(mediaQueriesX, mediaQueriesY);
renderer.setClearColor(0x000000, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minPolarAngle = controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 15;
controls.maxDistance = 15;
controls.update();

let model;
const loader = new GLTFLoader();

// ATTENTION: Assure-toi que ce chemin est accessible. 
// Même avec le CDN pour ThreeJS, le navigateur bloquera le chargement du .gltf 
// si tu n'utilises pas un petit serveur local (comme l'extension Live Server) à cause du CORS.
loader.load('./public/gltf/BB2.gltf', (gltf) => {
    console.log(gltf, 'modèle chargé');
    model = gltf.scene;
    scene.background = null;
    scene.add(model);
    renderer.render(scene, camera);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% chargé');
  },
  (error) => {
    console.error('Erreur de chargement du modèle GLTF', error);
  }
);

// J'ai ajouté 'z: 0' car tu l'appelais plus bas sans l'avoir défini
let modelRotation = { x: 1, y: 1, z: 0 };

domTarget.addEventListener('wheel', (event) => {
  if (!model) return; // Sécurité : on ne fait rien si le modèle n'est pas encore chargé

  const deltaRotation = event.deltaY * 0.01;
  modelRotation.y += deltaRotation;
  model.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
});

let mouseOverModel = false;

function animate() {
  requestAnimationFrame(animate);
  mettreAJourPositionLumiere(camera);
  
  // Sécurité : on vérifie que 'model' existe bien avant d'essayer de le tourner
  if (mouseOverModel && model) {
    model.rotation.y += 0.01;
  }
  
  renderer.render(scene, camera);
}

animate();