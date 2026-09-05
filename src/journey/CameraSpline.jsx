import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useProgress } from '../lib/progressContext.jsx';
import { clamp01 } from '../lib/easing.js';

const WAYPOINTS = {
  body:   new THREE.Vector3(0, 0.4, 4),       // bench-press POV looking up at bar
  mind:   new THREE.Vector3(0, 1.5, 6),
  spirit: new THREE.Vector3(0, 4, 5),
  summit: new THREE.Vector3(0, 7, 0),
};
const LOOKS = {
  body:   new THREE.Vector3(0, 1.2, 0),
  mind:   new THREE.Vector3(0, 1.5, 0),
  spirit: new THREE.Vector3(0, 5, 0),
  summit: new THREE.Vector3(0, 8, -5),
};

function lerpPoint(a, b, t, out) { out.lerpVectors(a, b, t); return out; }

export default function CameraSpline() {
  const { progress, altMode } = useProgress();
  const { camera } = useThree();
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const p = clamp01(progress);
    // M-2: reduced motion — static camera per zone, no spline drift
    if (altMode) {
      const zone = p < 0.25 ? 'body' : p < 0.6 ? 'mind' : p < 0.9 ? 'spirit' : 'summit';
      camera.position.copy(WAYPOINTS[zone]);
      camera.lookAt(LOOKS[zone]);
      return;
    }
    let a, b, la, lb, t;
    if (p < 0.25)      { a = WAYPOINTS.body;   b = WAYPOINTS.mind;   la = LOOKS.body;   lb = LOOKS.mind;   t = p / 0.25; }
    else if (p < 0.6)  { a = WAYPOINTS.mind;   b = WAYPOINTS.spirit; la = LOOKS.mind;   lb = LOOKS.spirit; t = (p - 0.25) / 0.35; }
    else if (p < 0.9)  { a = WAYPOINTS.spirit; b = WAYPOINTS.summit; la = LOOKS.spirit; lb = LOOKS.summit; t = (p - 0.6) / 0.3; }
    else               { a = WAYPOINTS.summit; b = WAYPOINTS.summit; la = LOOKS.summit; lb = LOOKS.summit; t = 0; }
    lerpPoint(a, b, t, pos);
    lerpPoint(la, lb, t, look);
    camera.position.copy(pos);
    camera.lookAt(look);
  });

  return null;
}
