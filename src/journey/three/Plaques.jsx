import { Text } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useProgress } from '../../lib/progressContext.jsx';

// Timeline stations on the final summit climb. Fade/scale with proximity
// to their progress anchor.
const STATIONS = [
  { p: 0.74, pos: [-2.2, 4.6, -1.5], year: '2015', line: 'STOP wishing START doing.' },
  { p: 0.82, pos: [2.4, 5.4, -2.5], year: '2017', line: 'Dragon-flag era — Bruce Lee inspiration.' },
  { p: 0.9,  pos: [-1.8, 6.2, -3.5], year: '2018', line: 'Full-body training peak. 80 reactions.' },
];

export default function Plaques() {
  const grp = useRef();
  const { progress } = useProgress();
  useFrame(() => {
    grp.current?.children.forEach((c, i) => {
      const near = Math.max(0, 1 - Math.abs(progress - STATIONS[i].p) / 0.05);
      c.scale.setScalar(0.9 + near * 0.1);
      c.traverse((o) => { if (o.material) o.material.opacity = 0.15 + near * 0.85; });
    });
  });
  return (
    <group ref={grp}>
      {STATIONS.map((s) => (
        <group key={s.year} position={s.pos}>
          <mesh>
            <boxGeometry args={[2.2, 1.1, 0.06]} />
            <meshStandardMaterial color="#0A0A0C" metalness={0.4} roughness={0.5} transparent opacity={0.2} />
          </mesh>
          <Text position={[0, 0.28, 0.04]} fontSize={0.22} color="#C9A227" anchorX="center" outlineWidth={0.004} outlineColor="#000">{s.year}</Text>
          <Text position={[0, -0.12, 0.04]} fontSize={0.14} color="#E8E4DC" anchorX="center" maxWidth={2} outlineWidth={0.004} outlineColor="#000">{s.line}</Text>
        </group>
      ))}
    </group>
  );
}
