// Rainbow Roll — phi-tilted hue shifting shader
uniform float time, ortho_shift;
varying vec2 vUv;
void main() {
    float phi = 1.61803398875;
    float theta = atan(vUv.y-0.5, vUv.x-0.5);
    float hue = fract((theta/6.2831) + phi * time + ortho_shift);
    gl_FragColor = vec4(hsv2rgb(vec3(hue, 1.0, 1.0)), 1.0);
}
