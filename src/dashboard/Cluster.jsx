import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import MerchMonolith from './MerchMonolith';
import HolographicPanel from './components/HolographicPanel';

const NODES = [
  { id: 'biometrics', label: 'Biometrics', angle: 0, phi: 0.5, radius: 4, content: 'BIOMETRIC_DATA' },
  { id: 'merch', label: 'Archive', angle: Math.PI * 0.6, phi: 0.8, radius: 4, content: 'ARCHIVE_LINK' },
  { id: 'calendar', label: 'Timeline', angle: Math.PI * 1.2, phi: 0.4, radius: 4, content: 'CALENDAR_DATA' },
  { id: 'stats', label: 'Performance', angle: Math.PI * 1.8, phi: 0.7, radius: 4, content: 'STAT_DATA' },
];

export default function Cluster() {
  const groupRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  // Update pointer for global parallax
  useFrame((state) => {
    mouse.current.x = state.pointer.x;
    mouse.current.y = state.pointer.y;

    if (groupRef.current) {
      // Subtle cluster-wide parallax based on pointer
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.current.x * 0.1, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.current.y * 0.1, 0.05);
    }
  });

  const nodePositions = useMemo(() => {
    return NODES.map(node => {
      // Spherical to Cartesian
      const x = node.radius * Math.sin(node.phi) * Math.cos(node.angle);
      const y = node.radius * Math.cos(node.phi);
      const z = node.radius * Math.sin(node.phi) * Math.sin(node.angle);
      return { ...node, pos: [x, y, z] };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* Center of gravity */}
      <MerchMonolith pointerOffset={mouse.current} />

      {/* Orbiting holographic nodes */}
      {nodePositions.map((node) => (
        <HolographicPanel
          key={node.id}
          position={node.pos}
          label={node.label}
          content={node.content}
        />
      ))}
    </group>
  );
}
