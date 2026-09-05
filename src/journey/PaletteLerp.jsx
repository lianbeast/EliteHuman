import { useFrame, useThree } from '@react-three/fiber';
import { useProgress } from '../lib/progressContext.jsx';
import { clamp01, lerp } from '../lib/easing.js';

const lerpHex = (a, b, t) => {
  const ah = parseInt(a.slice(1), 16), bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 255, ag = (ah >> 8) & 255, ab = ah & 255;
  const br = (bh >> 16) & 255, bg = (bh >> 8) & 255, bb = bh & 255;
  const r = Math.round(lerp(ar, br, t)), g = Math.round(lerp(ag, bg, t)), bv = Math.round(lerp(ab, bb, t));
  return `rgb(${r},${g},${bv})`;
};

export default function PaletteLerp() {
  const { progress } = useProgress();
  const { scene } = useThree();

  useFrame(() => {
    const p = clamp01(progress);
    const color = p < 0.6 ? lerpHex('#0A0A0C', '#1C1D22', p / 0.6)
                          : lerpHex('#1C1D22', '#F0C75E', (p - 0.6) / 0.4);
    scene.fog.color.set(color);
    scene.background.set(color);
  });

  return null;
}
