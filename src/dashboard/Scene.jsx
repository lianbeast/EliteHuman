import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Environment, Float } from '@react-three/drei';
import MerchMonolith from './MerchMonolith.jsx';
import { useProgress } from '../lib/progressContext.jsx';

export default function Scene({ pointerOffset }) {
  const { altMode } = useProgress();

  return (
    <>
      <color attach="background" args={['#0A0A0C']} />
      <fog attach="fog" args={['#0A0A0C', 5, 15]} />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#3EF0D8" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#F0C75E" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="city" />

      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        <MerchMonolith pointerOffset={pointerOffset} />
      </Float>
    </>
  );
}
