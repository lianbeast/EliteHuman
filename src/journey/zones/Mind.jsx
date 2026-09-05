import { useMemo } from 'react';
import * as THREE from 'three';
import Words from '../three/Words.jsx';
import { MIND_WORDS } from '../three/Words.data.js';

function Shards() {
  const shards = useMemo(() => Array.from({ length: 18 }, () => ({
    pos: [(Math.random() - 0.5) * 8, 1 + Math.random() * 4, (Math.random() - 0.5) * 4 - 1],
    rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    scale: [0.6 + Math.random() * 0.6, 0.05, 0.3 + Math.random() * 0.4],
  })), []);
  return (
    <group>
      {shards.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
          <planeGeometry />
          <meshBasicMaterial color="#C9A227" transparent opacity={0.25} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export default function Mind() {
  return (
    <group>
      <ambientLight intensity={0.3} color="#C9A227" />
      <pointLight position={[0, 0, 2]} intensity={1.2} color="#C9A227" />
      <Shards />
      <Words words={MIND_WORDS} color="#E8E4DC" size={0.55} />
    </group>
  );
}
