function Clouds() {
  return (
    <group position={[0, 6, -4]}>
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[(i - 4) * 3, Math.sin(i) * 0.5, -i * 0.5]}>
          <sphereGeometry args={[1.5 + (i % 3), 16, 16]} />
          <meshBasicMaterial color="#F0C75E" transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

export default function Summit() {
  return (
    <group>
      <ambientLight intensity={0.8} color="#F0C75E" />
      <pointLight position={[0, 9, -2]} intensity={1.5} color="#F0C75E" />
      <Clouds />
    </group>
  );
}
