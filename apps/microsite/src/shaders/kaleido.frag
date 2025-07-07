varying vec2 vUv;
uniform float uFrame, uPhi, uC;
vec3 hsv(vec3 c){vec4 K=vec4(1.,2./3.,1./3.,3.);vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);}
void main(){vec2 p=(vUv-0.5);float a=atan(p.y,p.x)+uFrame*uC;float r=length(p);vec3 col=hsv(vec3(fract(a/3.14159*uPhi),1.,smoothstep(0.8,0.,r)));gl_FragColor=vec4(col,1.);}
