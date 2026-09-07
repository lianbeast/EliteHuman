import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useProgress } from '../../lib/progressContext.jsx';
import { bandCenter, bandHalf, CULL_PAD } from '../../lib/bands.js';

// Culls subtree when scroll progress is far from this zone's band.
export default function ZoneBand({ band = 0, children }) {
  const ref = useRef();
  const { progress } = useProgress();
  const c = bandCenter(band), h = bandHalf(band);
  useFrame(() => {
    ref.current.visible = Math.abs(progress - c) < h + CULL_PAD;
  });
  return <group ref={ref}>{children}</group>;
}
