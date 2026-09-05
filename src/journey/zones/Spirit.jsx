import * as THREE from 'three';
import SkyDome from '../three/SkyDome.jsx';
import Particles from '../three/Particles.jsx';
import Words from '../three/Words.jsx';
import { SPIRIT_WORDS } from '../three/Words.data.js';
import ZoneBand from '../three/ZoneBand.jsx';

// Sun with additive corona sprite — glow without postfx dependency.
function Sun() {
  return (
    <group position={[0, 8, -10]}>
      <mesh>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color="#F0C75E" />
      </mesh>
      <sprite scale={[9, 9, 1]}>
        <spriteMaterial color="#F0C75E" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  );
}

function SpiritWorld() {
  return (
    <group>
      <SkyDome />
      <Sun />
      <Particles count={600} area={[3, 12, 3]} color="#F0C75E" size={0.025} opacity={0.7} />
      <Words words={SPIRIT_WORDS} color="#F0C75E" size={0.5} />
    </group>
  );
}

export default function Spirit() {
  return <ZoneBand band={2}><SpiritWorld /></ZoneBand>;
}
