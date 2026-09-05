import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// GPU particles: positions static in buffer, all motion in vertex shader via uTime.
// One uniform write per frame — zero per-particle JS math.
const VERT = `
  attribute float seed;
  uniform float uTime;
  uniform vec3 uArea;
  uniform float uSize;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * 0.15 * (0.6 + seed * 0.8), uArea.y);
    p.x += sin(uTime * 0.4 + seed * 20.0) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (200.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`;
const FRAG = `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, uOpacity * smoothstep(0.5, 0.1, d));
  }`;

export default function Particles({ count = 200, area = [6, 4, 4], color = '#E8E4DC', size = 0.02, opacity = 0.6 }) {
  const mat = useRef();
  const { positions, seeds, uniforms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * area[0];
      pos[i * 3 + 1] = Math.random() * area[1];
      pos[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      seed[i] = Math.random();
    }
    return {
      positions: pos, seeds: seed,
      uniforms: {
        uTime: { value: 0 },
        uArea: { value: new THREE.Vector3(...area) },
        uSize: { value: size * 50 },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
      },
    };
  }, [count, area, color, size, opacity]);

  useFrame(({ clock }) => { if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime; });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-seed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={mat} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} transparent depthWrite={false} />
    </points>
  );
}
