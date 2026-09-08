import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, MeshTransmissionMaterial, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export default function MerchMonolith({ pointerOffset = { x: 0, y: 0 } }) {
  const meshRef = useRef();

  // Asset loading - using a sample texture from assets
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    // Using one of the provided gym images as the product face
    return loader.load('/assets/img/1092409409410180026.jpg');
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = clock.elapsedTime * 0.2;
    // Base rotation + subtle pointer influence
    meshRef.current.rotation.y = t + (pointerOffset.x * 0.2);
    meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.1 + (pointerOffset.y * 0.1);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <RoundedBox
        ref={meshRef}
        args={[1.5, 2, 0.4]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial
          map={texture}
          roughness={0.2}
          metalness={0.8}
          emissive="#3EF0D8"
          emissiveIntensity={0.1}
        />
      </RoundedBox>
    </Float>
  );
}
