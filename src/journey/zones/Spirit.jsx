import SkyDome from '../three/SkyDome.jsx';
import Particles from '../three/Particles.jsx';

function Sun() {
  return (
    <mesh position={[0, 8, -10]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="#F0C75E" />
    </mesh>
  );
}

export default function Spirit() {
  return (
    <group>
      <SkyDome />
      <Sun />
      <Particles count={400} area={[3, 12, 3]} color="#F0C75E" size={0.025} opacity={0.7} />
    </group>
  );
}
