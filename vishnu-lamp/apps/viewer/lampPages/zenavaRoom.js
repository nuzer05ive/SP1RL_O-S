import * as THREE from 'three';
import { buildFromFold } from '@vishnu/core';
import { vertexSource as skinVertex, fragmentSource as skinFragment } from '../shaders/skin.js';

export function zenavaRoom(scene) {
  const [mesh] = buildFromFold({ kind: 'mobius', hinge: 1 });
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(mesh.geom.positions);
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geom.setIndex(mesh.geom.indices);
  const material = new THREE.ShaderMaterial({
    vertexShader: skinVertex,
    fragmentShader: skinFragment,
  });
  const m = new THREE.Mesh(geom, material);
  scene.add(m);
  return mesh;
}
