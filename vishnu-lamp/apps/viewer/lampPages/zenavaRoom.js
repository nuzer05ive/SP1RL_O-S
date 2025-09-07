import * as THREE from 'three';
import fallbackNeutral from '../../fixtures/zenava/neutral_mesh.json' assert { type: 'json' };

async function loadNeutral(path) {
  if (!path) return fallbackNeutral;
  try {
    const res = await fetch(path);
    return await res.json();
  } catch {
    return fallbackNeutral;
  }
}

export async function zenavaRoom(scene, meshPath) {
  const neutral = await loadNeutral(meshPath);
  const meshes = neutral.meshes || [];
  const shaders = [];
  meshes.forEach((m) => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(m.geom.positions), 3)
    );
    geom.setIndex(m.geom.indices);
    const material = new THREE.MeshBasicMaterial({ color: 0xdddddd });
    const mesh = new THREE.Mesh(geom, material);
    scene.add(mesh);
  });
  return meshes;
}
