import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene.jsx';
import Overlay from './Overlay.jsx';

export default function Dashboard() {
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: 'var(--obsidian)' }}>
      <Canvas
        dpr={[1.5, 2]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      >
        <Scene pointerOffset={pointerRef.current} />
      </Canvas>
      <Overlay />
    </div>
  );
}
