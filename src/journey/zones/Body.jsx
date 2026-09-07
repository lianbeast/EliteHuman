import { useMemo } from 'react';
import * as THREE from 'three';
import Particles from '../three/Particles.jsx';
import ZoneBand from '../three/ZoneBand.jsx';

function Plate({ x }) {
  return (
    <mesh position={[x, 0, 0]}>
      <cylinderGeometry args={[0.7, 0.7, 0.2, 32]} />
      <meshStandardMaterial color="#1C1D22" metalness={0.85} roughness={0.35} />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0A0A0C" metalness={0.2} roughness={0.8} />
    </mesh>
  );
}

function Grid() {
  return <gridHelper args={[20, 40, '#1C1D22', '#1C1D22']} position={[0, -0.99, 0]} />;
}

// Baked-feel contact shadow — replaces real-time shadow maps entirely.
function ContactShadow() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 8, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0,0,0,0.55)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh position={[0, -0.98, -2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5, 1.6]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

function Rack() {
  return (
    <group>
      {[-1.9, 1.9].map((x) => (
        <mesh key={x} position={[x, 0.2, -2.1]}>
          <boxGeometry args={[0.08, 2.4, 0.08]} />
          <meshStandardMaterial color="#1C1D22" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {[-1.9, 1.9].map((x) => (
        <mesh key={`c${x}`} position={[x, 1.4, -2.1]}>
          <boxGeometry args={[0.5, 0.08, 0.08]} />
          <meshStandardMaterial color="#1C1D22" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
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
      <Plate x={-1.7} />
      <Plate x={1.7} />
    </group>
  );
}

function BodyWorld() {
  return (
    <group>
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 2]} intensity={1.4} />
      <pointLight position={[0, 2, -3]} intensity={0.8} color="#E8E4DC" />
      <Floor />
      <Grid />
      <Barbell />
      <Rack />
      <ContactShadow />
      <Particles count={150} area={[6, 3, 4]} color="#E8E4DC" size={0.015} opacity={0.4} />
    </group>
  );
}

export default function Body() {
  return <ZoneBand band={0}><BodyWorld /></ZoneBand>;
}
