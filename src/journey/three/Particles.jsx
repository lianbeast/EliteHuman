import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Particles({ count = 200, area = [6, 4, 4], color = '#E8E4DC', size = 0.02, opacity = 0.6 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * area[0];
      arr[i * 3 + 1] = Math.random() * area[1];
      arr[i * 3 + 2] = (Math.random() - 0.5) * area[2];
    }
    return arr;
  }, [count, area]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 0.1;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += 0.003;
      if (pos.array[i * 3 + 1] > area[1]) pos.array[i * 3 + 1] = 0;
      pos.array[i * 3] += Math.sin(t + i) * 0.0005;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} transparent opacity={opacity} sizeAttenuation />
    </points>
  );
}
