export const vertexSource = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentSource = `
  varying vec2 vUv;
  void main() {
    float n = sin(vUv.x * 10.0) * sin(vUv.y * 10.0);
    gl_FragColor = vec4(vec3(n * 0.5 + 0.5), 1.0);
  }
`;
