import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { witnessRing } from './lampPages/witnessRing.js';
import { zenavaRoom } from './lampPages/zenavaRoom.js';

export function hydrateNeutral(mesh) {
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(mesh.geom.positions);
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  if (mesh.geom.indices && mesh.geom.indices.length > 0) {
    geom.setIndex(mesh.geom.indices);
  }
  return geom;
}

const canvas = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);
const controls = new OrbitControls(camera, renderer.domElement);

function route() {
  const path = window.location.pathname;
  if (path.endsWith('/witnessRing')) {
    witnessRing(scene);
  } else if (path.endsWith('/zenavaRoom')) {
    zenavaRoom(scene);
  }
}

route();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
