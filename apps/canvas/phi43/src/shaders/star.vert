// star.vert
uniform float uNode;
uniform float uC;
uniform float uPhi;
attribute float aIndex;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
