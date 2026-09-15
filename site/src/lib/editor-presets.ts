export interface FilterState {
  brightness: number    // 0–200, default 100
  contrast: number      // 0–200, default 100
  saturation: number    // 0–200, default 100
  blur: number          // 0–20, default 0
  grayscale: number     // 0–100, default 0
  hueRotate: number     // 0–360, default 0
  invert: number        // 0–100, default 0
  posterize: number     // 2–32, default 32
  pixelate: number      // 1–32, default 1
  noise: number         // 0–100, default 0
  dithering: number     // 0–100, default 0
}

export const DEFAULT_FILTERS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
  posterize: 32,
  pixelate: 1,
  noise: 0,
  dithering: 0,
}

// A preset value can be a fixed number or a range [min, max] that animates
export type PresetValue = number | [number, number]

export interface EditorPreset {
  name: string
  filters: { [K in keyof FilterState]?: PresetValue }
}

// Resolve a PresetValue to a concrete number (picks random within range)
export function resolvePresetValue(value: PresetValue): number {
  if (Array.isArray(value)) {
    const [min, max] = value
    return Math.round(min + Math.random() * (max - min))
  }
  return value
}

// Resolve an entire preset to a FilterState
export function resolvePreset(preset: EditorPreset): FilterState {
  const resolved = { ...DEFAULT_FILTERS }
  for (const key of Object.keys(preset.filters) as (keyof FilterState)[]) {
    const val = preset.filters[key]
    if (val !== undefined) {
      resolved[key] = resolvePresetValue(val)
    }
  }
  return resolved
}

// Extract which keys have animated ranges
export function getAnimatedKeys(preset: EditorPreset): (keyof FilterState)[] {
  return (Object.keys(preset.filters) as (keyof FilterState)[]).filter(
    (key) => Array.isArray(preset.filters[key])
  )
}

export const EDITOR_PRESETS: EditorPreset[] = [
  {
    name: 'B&W',
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: 100,
      hueRotate: 0,
      invert: 0,
      posterize: [30, 32],
      pixelate: 1,
      noise: [5, 15],
      dithering: 0,
    },
  },
  {
    name: 'Dithering',
    filters: {
      brightness: [150, 156],
      contrast: 100,
      saturation: 114,
      blur: 0,
      grayscale: 100,
      hueRotate: 0,
      invert: 0,
      posterize: [30, 32],
      pixelate: 1,
      noise: 28,
      dithering: 76,
    },
  },
]
