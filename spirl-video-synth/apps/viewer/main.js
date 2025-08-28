import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const fileInput = document.getElementById('file');
const badge = document.getElementById('badge');
let scan;

function loadScan(data){
  scan = data;
  badge.textContent = `rails: ${scan.rails.length}`;
}

fileInput.addEventListener('change', e => {
  const file = fileInput.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => loadScan(JSON.parse(ev.target.result));
  reader.readAsText(file);
});

const stored = localStorage.getItem('scan.json');
if(stored) loadScan(JSON.parse(stored));

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 100;

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
