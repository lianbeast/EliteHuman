export const clamp01 = (n) => Math.max(0, Math.min(1, n));
export const smoothstep = (n) => { n = clamp01(n); return n * n * (3 - 2 * n); };
export const smootherstep = (n) => { n = clamp01(n); return n * n * n * (n * (n * 6 - 15) + 10); };
export const lerp = (a, b, t) => a + (b - a) * t;
export const map = (n, a, b, c, d) => lerp(c, d, clamp01((n - a) / (b - a)));
