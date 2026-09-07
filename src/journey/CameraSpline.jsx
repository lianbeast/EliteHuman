import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useProgress } from '../lib/progressContext.jsx';
import { clamp01 } from '../lib/easing.js';
import { BANDS } from '../lib/bands.js';

const WAYPOINTS = {
  bodyClose: new THREE.Vector3(0, 0.9, 2.2), // hero cold-open: low, behind bar
  body:      new THREE.Vector3(0, 0.4, 4),
  mind:      new THREE.Vector3(0, 1.5, 6),
  spirit:    new THREE.Vector3(0, 4, 5),
  summit:    new THREE.Vector3(0, 7, 0),
};
const LOOKS = {
  body:   new THREE.Vector3(0, 1.2, 0),
  mind:   new THREE.Vector3(0, 1.5, 0),
  spirit: new THREE.Vector3(0, 5, 0),
  summit: new THREE.Vector3(0, 8, -5),
};

const [B1, B2, B3] = BANDS; // 0.15 / 0.40 / 0.70

export default function CameraSpline() {
  const { progress, altMode } = useProgress();
  const { camera } = useThree();
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const p = clamp01(progress);
    // M-2: reduced motion — static camera per zone, no spline drift
    if (altMode) {
      const zone = p < B1 ? 'body' : p < B2 ? 'mind' : p < B3 ? 'spirit' : 'summit';
      camera.position.copy(WAYPOINTS[zone]);
      camera.lookAt(LOOKS[zone]);
      return;
    }
    let a, b, la, lb, t;
    if (p < 0.06)       { a = WAYPOINTS.bodyClose; b = WAYPOINTS.body;   la = LOOKS.body;   lb = LOOKS.body;   t = p / 0.06; } // hero pull-back
    else if (p < B1)    { a = WAYPOINTS.body;     b = WAYPOINTS.mind;    la = LOOKS.body;   lb = LOOKS.mind;   t = (p - 0.06) / (B1 - 0.06); }
    else if (p < B2)    { a = WAYPOINTS.mind;      b = WAYPOINTS.spirit; la = LOOKS.mind;   lb = LOOKS.spirit; t = (p - B1) / (B2 - B1); }
    else if (p < B3)    { a = WAYPOINTS.spirit;    b = WAYPOINTS.summit; la = LOOKS.spirit; lb = LOOKS.summit; t = (p - B2) / (B3 - B2); }
    else                { a = WAYPOINTS.summit;    b = WAYPOINTS.summit; la = LOOKS.summit; lb = LOOKS.summit; t = 0; }
    pos.lerpVectors(a, b, t);
    look.lerpVectors(la, lb, t);
    camera.position.copy(pos);
    camera.lookAt(look);
  });

  return null;
}
