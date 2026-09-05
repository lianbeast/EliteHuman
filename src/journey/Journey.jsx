import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { Suspense, useMemo } from 'react';
import { Vector2 } from 'three';
import CameraSpline from './CameraSpline.jsx';
import Body from './zones/Body.jsx';
import Mind from './zones/Mind.jsx';
import Spirit from './zones/Spirit.jsx';
import Summit from './zones/Summit.jsx';
import PaletteLerp from './PaletteLerp.jsx';
import { useProgress } from '../lib/progressContext.jsx';
import { clamp01 } from '../lib/easing.js';

const BANDS = [0.25, 0.6, 0.9];
const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

// m-6: chromatic aberration pulses near zone boundaries, static base elsewhere
function CAPulse() {
  const { progress } = useProgress();
  const offset = useMemo(() => new Vector2(0.0008, 0.0008), []);
  useFrame(() => {
    const proximity = BANDS.reduce((m, b) => Math.max(m, 1 - Math.abs(progress - b) / 0.06), 0);
    const k = clamp01(proximity);
    offset.set(0.0008 + k * 0.006, 0.0008 + k * 0.006);
  });
  return <ChromaticAberration offset={offset} />;
}

export default function Journey() {
  const { altMode } = useProgress();

  return (
    <Canvas
      dpr={[1.5, 2]}
      camera={{ fov: 55, near: 0.1, far: 100, position: [0, 0.4, 4] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
      <color attach="background" args={['#0A0A0C']} />
      <fog attach="fog" args={['#0A0A0C', 4, 18]} />
      <Suspense fallback={null}>
        <Body />
        <Mind />
        <Spirit />
        <Summit />
      </Suspense>
      <CameraSpline />
      <PaletteLerp />
      {/* M-1: no postfx under reduced motion; no CA on touch; bloom downscaled on touch */}
      {altMode ? null : (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.6} luminanceThreshold={0.85} mipmapBlur={isTouch ? false : true} resolutionScale={isTouch ? 0.5 : undefined} />
          {!isTouch && <CAPulse />}
        </EffectComposer>
      )}
    </Canvas>
  );
}
