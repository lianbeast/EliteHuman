import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float } from '@react-three/drei';
import Cluster from './Cluster';
import Overlay from './Overlay';
import { useProgress } from '../lib/progressContext.jsx';

export default function Dashboard() {
  const { altMode } = useProgress();

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--obsidian)', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          stencil: false,
          depth: true,
          powerPreference: 'high-performance'
        }}
      >
        <color attach="background" args={['#0A0A0C']} />

        <Suspense fallback={<mesh><boxGeometry /><meshStandardMaterial color="cyan" /></mesh>}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />

          {/* Global lighting for the 3D volume */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#3EF0D8" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#3EF0D8" />

          <Cluster />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          rotateSpeed={0.4}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* 2D HUD Overlay */}
      <Overlay />
    </div>
  );
}
