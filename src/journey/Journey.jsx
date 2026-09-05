import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense, useMemo } from 'react';
import { Vector2 } from 'three';
import CameraSpline from './CameraSpline.jsx';
import Body from './zones/Body.jsx';
import Mind from './zones/Mind.jsx';
import Spirit from './zones/Spirit.jsx';
import Summit from './zones/Summit.jsx';
import PaletteLerp from './PaletteLerp.jsx';

export default function Journey() {
  const caOffset = useMemo(() => new Vector2(0.0008, 0.0008), []);
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
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.6} luminanceThreshold={0.85} mipmapBlur />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={caOffset} />
      </EffectComposer>
    </Canvas>
  );
}
