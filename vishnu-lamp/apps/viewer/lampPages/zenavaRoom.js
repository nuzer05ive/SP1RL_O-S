import * as THREE from 'three';
import neutral from '../../fixtures/zenava/neutral_mesh.json' assert { type: 'json' };
import { vertexSource as skinVertex, fragmentSource as skinFragment } from '../shaders/skin.js';
import { vertexSource as shimmerVertex, fragmentSource as shimmerFragment } from '../shaders/shimmer.js';
import { vertexSource as sackVertex, fragmentSource as sackFragment } from '../shaders/yellowSack.js';

export function zenavaRoom(scene) {
  const meshes = neutral.meshes || [];
  const shaders = [
    { v: skinVertex, f: skinFragment },
    { v: shimmerVertex, f: shimmerFragment },
    { v: sackVertex, f: sackFragment },
  ];
  meshes.forEach((m, i) => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(m.geom.positions), 3)
    );
    geom.setIndex(m.geom.indices);
    const sh = shaders[i % shaders.length];
    const material = new THREE.ShaderMaterial({
      vertexShader: sh.v,
      fragmentShader: sh.f,
    });
    const mesh = new THREE.Mesh(geom, material);
    scene.add(mesh);
  });
  return meshes;
}
