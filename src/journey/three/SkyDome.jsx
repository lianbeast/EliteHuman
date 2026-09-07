import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VERT = `
  varying vec3 vWorldPos;
  void main() {
    vWorldPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const FRAG = `
  varying vec3 vWorldPos;
  uniform vec3 uBottom;
  uniform vec3 uMid;
  uniform vec3 uTop;
  uniform float uTime;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
  }
  void main() {
    float h = normalize(vWorldPos).y * 0.5 + 0.5;
    vec3 col = mix(uBottom, uMid, smoothstep(0.0, 0.5, h));
    col = mix(col, uTop, smoothstep(0.5, 1.0, h));
    // aurora bands: horizontal noise ribbons drifting, fading with altitude
    float band = noise(vec2(vWorldPos.x * 0.05 + uTime * 0.02, h * 3.0));
    float band2 = noise(vec2(vWorldPos.x * 0.03 - uTime * 0.015, h * 2.0 + 5.0));
    col += (uTop - uMid) * 0.18 * smoothstep(0.45, 0.75, h) * (band * 0.6 + band2 * 0.4);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function SkyDome() {
  const mat = useRef();
  const uniforms = useMemo(() => ({
    uBottom: { value: new THREE.Color('#2a1a0a') },
    uMid:    { value: new THREE.Color('#C9A227') },
    uTop:    { value: new THREE.Color('#F0C75E') },
    uTime:   { value: 0 },
  }), []);
  useFrame(({ clock }) => { if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime; });
  return (
    <mesh>
      <sphereGeometry args={[50, 32, 32]} />
      <shaderMaterial ref={mat} side={THREE.BackSide} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}
