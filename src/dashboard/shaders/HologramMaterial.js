import * as THREE from 'three';

export const HologramMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#3EF0D8') },
    uOpacity: { value: 0.4 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    varying vec2 vUv;
    varying vec3 vPosition;

    // Simple pseudo-random noise
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      // Create scanning lines
      float scanline = sin(vUv.y * 100.0 + uTime * 5.0) * 0.1;

      // Edge glow based on UV distance from center
      float edge = 1.0 - smoothstep(0.0, 0.1, length(vUv - 0.5) * 2.0);

      // Subtle noise flicker
      float n = noise(vUv + uTime * 0.01);

      vec3 finalColor = uColor + scanline + (n * 0.05);
      float alpha = uOpacity + edge * 0.3 + scanline * 0.1;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};
