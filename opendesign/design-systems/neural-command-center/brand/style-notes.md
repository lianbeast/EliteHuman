# Visual Foundations

## Holographic Materiality
The primary visual metaphor is **Projected Light**. 

### 1. Additive Blending
Unlike standard glassmorphism, holographic panels use `AdditiveBlending`. They do not block light; they add to it. Overlapping panels result in brighter "hotspots," creating a sense of luminous depth.

### 2. Depth & Motion
- **Zero-G Drift**: UI elements never stay perfectly still. They drift on a slow, asynchronous sine-wave to simulate weightlessness.
- **Focus Scaling**: Panels scale slightly and increase opacity as the pointer/camera moves toward them.

### 3. Palette
- **Background**: Deep Obsidian (`#0A0A0C`). No true black; always a hint of chroma.
- **Accent**: Neon Cyan (`#3EF0D8`). Used for primary data, borders, and glows.
- **Secondary**: Ember (`#C9A227`). Used sparingly for warnings or critical "Peak" moments.

### 4. Typography
- **Headers**: `Big Shoulders Display` (condensed, bold, technical).
- **Data**: `Space Mono` (fixed-width, readable, computer-like).
- **Body**: `Spectral` (elegant, human contrast to the technical UI).

### 5. Glass Rules
- **Blur**: 25px backdrop-filter.
- **Saturation**: 180% to make the colors "pop" through the blur.
- **Borders**: 1px semi-transparent white with an inner glow.
