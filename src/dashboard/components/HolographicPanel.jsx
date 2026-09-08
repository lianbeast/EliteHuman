import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { HologramMaterial } from '../shaders/HologramMaterial';

export default function HolographicPanel({ position, label, content }) {
  const meshRef = useRef();
  const textRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = clock.elapsedTime;
    // Zero-G Drift: Sine-wave float
    meshRef.current.position.y += Math.sin(t + position[0]) * 0.001;
    meshRef.current.position.x += Math.cos(t + position[1]) * 0.001;

    // Rotate to face center (roughly)
    meshRef.current.lookAt(0, 0, 0);
  });

  return (
    <group position={position}>
      {/* Holographic Background */}
      <RoundedBox
        ref={meshRef}
        args={[2, 1.2, 0.05]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial
          color="#3EF0D8"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </RoundedBox>

      {/* Panel Label */}
      <Text
        position={[0, 0.7, 0.1]}
        fontSize={0.2}
        color="#3EF0D8"
      >
        {label}
      </Text>

      {/* Content Placeholder */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.15}
        color="white"
        maxWidth={1.5}
        textAlign="center"
      >
        {content}
      </Text>
    </group>
  );
}
