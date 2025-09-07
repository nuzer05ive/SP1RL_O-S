import * as THREE from 'three';
import { buildFromFold, PHI } from '@vishnu/core';

export function witnessRing(scene) {
  const [mesh] = buildFromFold({ kind: 'cycloid', hinge: 1 });
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(mesh.geom.positions);
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const colors = [];
  const count = mesh.geom.positions.length / 3;
  for (let i = 0; i < count; i++) {
    const hue = ((i + 1) * PHI) % 1;
    const c = new THREE.Color().setHSL(hue, 1, 0.5);
    colors.push(c.r, c.g, c.b);
  }
  geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geom.setIndex(mesh.geom.indices);
  const material = new THREE.LineBasicMaterial({ vertexColors: true });
  const ring = new THREE.LineLoop(geom, material);
  scene.add(ring);

  // W9 indicator at center
  const centerGeom = new THREE.BufferGeometry();
  centerGeom.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
  const centerMat = new THREE.PointsMaterial({ color: 0xff0000, size: 0.1 });
  const center = new THREE.Points(centerGeom, centerMat);
  scene.add(center);

  // drift ring
  const driftGeom = new THREE.CircleGeometry(1.1, 32);
  driftGeom.setIndex(null);
  const driftMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const drift = new THREE.LineLoop(driftGeom, driftMat);
  scene.add(drift);

  return mesh;
}
