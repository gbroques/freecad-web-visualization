/* eslint-env browser */
import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import Stats from '/jsm/libs/stats.module.js';
import { OBJLoader } from '/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '/jsm/loaders/MTLLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

let cube = null;

loadMtl('cube.mtl').then((materialCreator) => {
  materialCreator.preload();
  Object.values(materialCreator.materials).forEach((material) => {
    material.opacity = 1;
  });
  loadObj('cube.obj', materialCreator).then((object) => {
    object.position.set(-5, 0, 0);
    scene.add(object);
    cube = object;
  });
}).catch(console.error);

const fieldOfView = 45;
const aspectRatio = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  near,
  far,
);
camera.position.set(0, 10, 40);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5, 50);
pointLight.position.set(0, 10, 20);
scene.add(pointLight);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}, false);

const stats = Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);
  if (cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  controls.update();
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();

function loadMtl(name) {
  return new Promise((resolve, reject) => {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(name, resolve, handleProgress, reject);
  });
}

function loadObj(name, materials) {
  return new Promise((resolve, reject) => {
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(name, resolve, handleProgress, reject);
  });
}

function handleProgress(xhr) {
  const url = new URL(xhr.target.responseURL);
  const filename = url.pathname.slice(1);
  const progressPercentage = (xhr.loaded / xhr.total) * 100;
  console.log(`index.js: ${filename} ${progressPercentage}% loaded.`);
}
