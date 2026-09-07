import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useProgress } from '../../lib/progressContext.jsx';
import * as THREE from 'three';

// GPU particles: positions static in buffer, all motion in vertex shader via uTime.
// One uniform write per frame — zero per-particle JS math.
// Point size replicates three.js sizeAttenuation: size * (0.5*viewportHeight / -mv.z),
// clamped so near-camera particles can't smear across the screen.
const VERT = `
  attribute float seed;
  uniform float uTime;
  uniform vec3 uArea;
  uniform float uSize;
  uniform float uScale;
  varying float vNear;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * 0.15 * (0.6 + seed * 0.8), uArea.y);
    p.x += sin(uTime * 0.4 + seed * 20.0) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = clamp(uSize * uScale / max(0.1, -mv.z), 1.0, 48.0);
    vNear = smoothstep(0.5, 1.8, -mv.z); // fade particles grazing the camera
    gl_Position = projectionMatrix * mv;
  }`;
const FRAG = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vNear;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, uOpacity * vNear * smoothstep(0.5, 0.1, d));
  }`;

export default function Particles({ count = 200, area = [6, 4, 4], color = '#E8E4DC', size = 0.02, opacity = 0.6 }) {
  const mat = useRef();
  const { gl } = useThree();
  const { altMode } = useProgress();
  // deps are primitives: array-literal props (new identity each parent render) must NOT
  // re-seed the field — otherwise every scroll tick re-randomizes particle positions.
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
        uArea: { value: new THREE.Vector3(area[0], area[1], area[2]) },
        uSize: { value: size },
        uScale: { value: 400 },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
      },
    };
  }, [count, area[0], area[1], area[2], color, size, opacity]);

  useFrame(({ clock }) => {
    if (!mat.current) return;
    if (!altMode) mat.current.uniforms.uTime.value = clock.elapsedTime;
    // three.js sizeAttenuation parity: size * (0.5 * drawingBufferHeight / -mv.z)
    mat.current.uniforms.uScale.value = 0.5 * gl.drawingBufferHeight;
  });

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
