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
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
  }
`;
