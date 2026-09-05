import { useMemo } from 'react';
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
  void main() {
    float h = normalize(vWorldPos).y * 0.5 + 0.5;
    vec3 col = mix(uBottom, uMid, smoothstep(0.0, 0.5, h));
    col = mix(col, uTop, smoothstep(0.5, 1.0, h));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function SkyDome() {
  const uniforms = useMemo(() => ({
    uBottom: { value: new THREE.Color('#2a1a0a') },
    uMid:    { value: new THREE.Color('#C9A227') },
    uTop:    { value: new THREE.Color('#F0C75E') },
  }), []);
  return (
    <mesh>
      <sphereGeometry args={[50, 32, 32]} />
      <shaderMaterial side={THREE.BackSide} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}
