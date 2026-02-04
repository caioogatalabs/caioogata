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

export interface EditorPreset {
  name: string
  filters: Partial<FilterState>
}

export const EDITOR_PRESETS: EditorPreset[] = [
  {
    name: 'Vintage',
    filters: {
      brightness: 110,
      contrast: 85,
      saturation: 60,
      noise: 15,
      hueRotate: 20,
    },
  },
  {
    name: 'B&W',
    filters: {
      grayscale: 100,
      contrast: 120,
    },
  },
  {
    name: 'High Contrast',
    filters: {
      contrast: 160,
      brightness: 105,
      saturation: 120,
    },
  },
  {
    name: 'Posterize',
    filters: {
      posterize: 4,
      contrast: 110,
    },
  },
  {
    name: 'Pixel Art',
    filters: {
      pixelate: 8,
      posterize: 6,
      saturation: 130,
    },
  },
  {
    name: 'Dithered',
    filters: {
      dithering: 80,
      grayscale: 100,
    },
  },
  {
    name: 'Dreamy',
    filters: {
      blur: 3,
      brightness: 115,
      saturation: 80,
    },
  },
  {
    name: 'Inverted',
    filters: {
      invert: 100,
    },
  },
]
