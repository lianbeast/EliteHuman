import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ZoneBand from '../three/ZoneBand.jsx';

// Noise-displaced cloud plane — camera settles above it at summit.
const CLOUD_VERT = `
  uniform float uTime;
  varying float vH;
  void main() {
    vec3 p = position;
    p.z += sin(p.x * 0.4 + uTime * 0.15) * 0.3 + sin(p.y * 0.5 + uTime * 0.1) * 0.2;
    vH = p.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }`;
const CLOUD_FRAG = `
  varying float vH;
  void main() {
    vec3 col = mix(vec3(0.75, 0.72, 0.66), vec3(0.94, 0.90, 0.80), smoothstep(-0.4, 0.4, vH));
    gl_FragColor = vec4(col, 0.92);
  }`;

function CloudLayer() {
  const mat = useRef();
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame(({ clock }) => { if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime; });
  return (
    <mesh position={[0, 3.2, -4]} rotation={[-Math.PI / 2.55, 0, 0]}>
      <planeGeometry args={[40, 24, 48, 32]} />
      <shaderMaterial ref={mat} vertexShader={CLOUD_VERT} fragmentShader={CLOUD_FRAG} uniforms={uniforms} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function SummitWorld() {
  return (
    <group>
      <ambientLight intensity={0.8} color="#F0C75E" />
      <pointLight position={[0, 9, -2]} intensity={1.5} color="#F0C75E" />
      <CloudLayer />
    </group>
  );
}

export default function Summit() {
  return <ZoneBand band={3}><SummitWorld /></ZoneBand>;
}
