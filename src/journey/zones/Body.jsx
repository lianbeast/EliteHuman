import Particles from '../three/Particles.jsx';

function Plate({ x }) {
  return (
    <mesh position={[x, 0, 0]} castShadow>
      <cylinderGeometry args={[0.7, 0.7, 0.2, 32]} />
      <meshStandardMaterial color="#1C1D22" metalness={0.85} roughness={0.35} />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0A0A0C" metalness={0.2} roughness={0.8} />
    </mesh>
  );
}

function Grid() {
  return <gridHelper args={[20, 40, '#1C1D22', '#1C1D22']} position={[0, -0.99, 0]} />;
}

function Barbell() {
  return (
    <group position={[0, 1.2, -2]}>
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 4, 16]} />
        <meshStandardMaterial color="#E8E4DC" metalness={0.9} roughness={0.2} />
      </mesh>
      <Plate x={-1.5} />
      <Plate x={1.5} />
    </group>
  );
}

export default function Body() {
  return (
    <group>
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 2]} intensity={1.4} castShadow />
      <pointLight position={[0, 2, -3]} intensity={0.8} color="#E8E4DC" />
      <Floor />
      <Grid />
      <Barbell />
      <Particles count={150} area={[6, 3, 4]} color="#E8E4DC" size={0.015} opacity={0.4} />
    </group>
  );
}
