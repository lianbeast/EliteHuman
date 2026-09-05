import { Text } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Words({ words = [], color = '#E8E4DC', area = [5, 3, 3], size = 0.5 }) {
  const groupRef = useRef();

  const items = useMemo(() =>
    words.map((w, i) => {
      const angle = (i / words.length) * Math.PI * 2;
      return {
        word: w,
        position: [Math.cos(angle) * (area[0] / 2), Math.sin(i) * (area[1] / 3), Math.sin(angle) * (area[2] / 2) - 1],
      };
    }), [words, area]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    groupRef.current?.children.forEach((c, i) => {
      c.position.y += Math.sin(t * 0.4 + i) * 0.002;
      c.rotation.y = Math.sin(t * 0.2 + i) * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <group key={i} position={item.position}>
          <Text
            text={item.word}
            fontSize={size}
            color={color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#0A0A0C"
          />
        </group>
      ))}
    </group>
  );
}
