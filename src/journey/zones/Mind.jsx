import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import Words from '../three/Words.jsx';
import { MIND_WORDS } from '../three/Words.data.js';
import ZoneBand from '../three/ZoneBand.jsx';
import { useProgress } from '../../lib/progressContext.jsx';

// Shards rotate slowly via time; band-entrance handled by CA pulse in Journey.
function Shards() {
  const grp = useRef();
  const shards = useMemo(() => Array.from({ length: 18 }, () => ({
    pos: [(Math.random() - 0.5) * 8, 1 + Math.random() * 4, (Math.random() - 0.5) * 4 - 1],
    rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    scale: [0.6 + Math.random() * 0.6, 0.05, 0.3 + Math.random() * 0.4],
  })), []);
  useFrame(({ clock }) => {
    grp.current?.children.forEach((c, i) => {
      c.rotation.x += 0.0015 + i * 0.00005;
      c.rotation.z = Math.sin(clock.elapsedTime * 0.3 + i) * 0.15;
    });
  });
  return (
    <group ref={grp}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
          <planeGeometry />
          <meshBasicMaterial color="#C9A227" transparent opacity={0.25} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function MindWorld() {
  return (
    <group>
      <ambientLight intensity={0.3} color="#C9A227" />
      <pointLight position={[0, 0, 2]} intensity={1.2} color="#C9A227" />
      <Shards />
      <Words words={MIND_WORDS} color="#E8E4DC" size={0.55} />
    </group>
  );
}

export default function Mind() {
  return <ZoneBand band={1}><MindWorld /></ZoneBand>;
}
