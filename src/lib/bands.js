// Single source of truth for zone banding. Every consumer (camera, overlays,
// meter, CA pulse, altMode snap) imports from here — retune once, whole site follows.
export const BANDS = [0.15, 0.40, 0.70]; // upper bounds of body/mind/spirit; summit = 1
export const CULL_PAD = 0.08;

const ZONE_NAMES = ['body', 'mind', 'spirit', 'summit'];
const starts = [0, ...BANDS, 1];

export function zoneAt(p) {
  for (let i = BANDS.length - 1; i >= 0; i--) if (p >= BANDS[i]) return ZONE_NAMES[i + 1];
  return ZONE_NAMES[0];
}
export function bandCenter(i) { return (starts[i] + starts[i + 1]) / 2; }
export function bandHalf(i) { return (starts[i + 1] - starts[i]) / 2; }
