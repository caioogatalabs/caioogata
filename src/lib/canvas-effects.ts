import type { FilterState } from './editor-presets'

/**
 * Main rendering pipeline — draws source image onto canvas with all effects applied.
 * Uses Canvas API pixel manipulation (getImageData/putImageData) for all effects
 * except blur which uses ctx.filter for performance.
 */
export function renderToCanvas(
  canvas: HTMLCanvasElement,
  source: HTMLImageElement | HTMLVideoElement,
  filters: FilterState,
  crop?: { top: number; bottom: number }
): void {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height

  // 1. Clear and draw source image
  ctx.clearRect(0, 0, w, h)

  // 2. Apply blur via ctx.filter (pixel-level blur is too expensive)
  if (filters.blur > 0) {
    ctx.filter = `blur(${filters.blur}px)`
  } else {
    ctx.filter = 'none'
  }

  if (crop && (crop.top > 0 || crop.bottom > 0)) {
    const srcW = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth
    const srcH = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight
    const sy = srcH * crop.top
    const sh = srcH * (1 - crop.top - crop.bottom)
    ctx.drawImage(source, 0, sy, srcW, sh, 0, 0, w, h)
  } else {
    ctx.drawImage(source, 0, 0, w, h)
  }
  ctx.filter = 'none'

  // 3. Pixelate (must happen before per-pixel effects)
  if (filters.pixelate > 1) {
    applyPixelate(ctx, w, h, filters.pixelate)
  }

  // 4. Get pixel data for per-pixel effects
  const needsPixelEffects =
    filters.brightness !== 100 ||
    filters.contrast !== 100 ||
    filters.saturation !== 100 ||
    filters.grayscale > 0 ||
    filters.hueRotate !== 0 ||
    filters.invert > 0 ||
    filters.posterize < 32 ||
    filters.noise > 0 ||
    filters.dithering > 0

  if (!needsPixelEffects) return

  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data

  // 5. Apply per-pixel effects in order
  applyBrightness(data, filters.brightness)
  applyContrast(data, filters.contrast)
  applySaturation(data, filters.saturation)
  applyHueRotate(data, filters.hueRotate)
  applyGrayscale(data, filters.grayscale)
  applyInvert(data, filters.invert)
  applyPosterize(data, filters.posterize)
  applyNoise(data, filters.noise)
  applyDithering(data, w, h, filters.dithering)

  // 6. Put processed pixels back
  ctx.putImageData(imageData, 0, 0)
}

// --- Individual effect functions ---

function clamp(val: number): number {
  return val < 0 ? 0 : val > 255 ? 255 : val
}

function applyBrightness(data: Uint8ClampedArray, amount: number): void {
  if (amount === 100) return
  const factor = amount / 100
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] * factor)
    data[i + 1] = clamp(data[i + 1] * factor)
    data[i + 2] = clamp(data[i + 2] * factor)
  }
}

function applyContrast(data: Uint8ClampedArray, amount: number): void {
  if (amount === 100) return
  // Map 0-200 to -255..255 where 100 → 0 (neutral)
  const contrast = (amount - 100) * 2.55
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(factor * (data[i] - 128) + 128)
    data[i + 1] = clamp(factor * (data[i + 1] - 128) + 128)
    data[i + 2] = clamp(factor * (data[i + 2] - 128) + 128)
  }
}

function applySaturation(data: Uint8ClampedArray, amount: number): void {
  if (amount === 100) return
  const factor = amount / 100
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    data[i] = clamp(gray + factor * (data[i] - gray))
    data[i + 1] = clamp(gray + factor * (data[i + 1] - gray))
    data[i + 2] = clamp(gray + factor * (data[i + 2] - gray))
  }
}

function applyHueRotate(data: Uint8ClampedArray, degrees: number): void {
  if (degrees === 0) return
  const rad = (degrees * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  // Hue rotation matrix (preserves luminance)
  const m00 = 0.213 + cos * 0.787 - sin * 0.213
  const m01 = 0.715 - cos * 0.715 - sin * 0.715
  const m02 = 0.072 - cos * 0.072 + sin * 0.928
  const m10 = 0.213 - cos * 0.213 + sin * 0.143
  const m11 = 0.715 + cos * 0.285 + sin * 0.140
  const m12 = 0.072 - cos * 0.072 - sin * 0.283
  const m20 = 0.213 - cos * 0.213 - sin * 0.787
  const m21 = 0.715 - cos * 0.715 + sin * 0.715
  const m22 = 0.072 + cos * 0.928 + sin * 0.072

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    data[i] = clamp(r * m00 + g * m01 + b * m02)
    data[i + 1] = clamp(r * m10 + g * m11 + b * m12)
    data[i + 2] = clamp(r * m20 + g * m21 + b * m22)
  }
}

function applyGrayscale(data: Uint8ClampedArray, amount: number): void {
  if (amount === 0) return
  const factor = amount / 100
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    data[i] = clamp(data[i] + factor * (gray - data[i]))
    data[i + 1] = clamp(data[i + 1] + factor * (gray - data[i + 1]))
    data[i + 2] = clamp(data[i + 2] + factor * (gray - data[i + 2]))
  }
}

function applyInvert(data: Uint8ClampedArray, amount: number): void {
  if (amount === 0) return
  const factor = amount / 100
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] + factor * (255 - 2 * data[i]))
    data[i + 1] = clamp(data[i + 1] + factor * (255 - 2 * data[i + 1]))
    data[i + 2] = clamp(data[i + 2] + factor * (255 - 2 * data[i + 2]))
  }
}

function applyPosterize(data: Uint8ClampedArray, levels: number): void {
  if (levels >= 32) return
  const numLevels = Math.max(2, Math.round(levels))
  const step = 255 / (numLevels - 1)
  const divisor = 256 / numLevels
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(Math.floor(data[i] / divisor) * step)
    data[i + 1] = Math.round(Math.floor(data[i + 1] / divisor) * step)
    data[i + 2] = Math.round(Math.floor(data[i + 2] / divisor) * step)
  }
}

function applyNoise(data: Uint8ClampedArray, amount: number): void {
  if (amount === 0) return
  const intensity = (amount / 100) * 80 // max ±80 noise
  for (let i = 0; i < data.length; i += 4) {
    const offset = (Math.random() - 0.5) * 2 * intensity
    data[i] = clamp(data[i] + offset)
    data[i + 1] = clamp(data[i + 1] + offset)
    data[i + 2] = clamp(data[i + 2] + offset)
  }
}

function applyDithering(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  amount: number
): void {
  if (amount === 0) return
  const strength = amount / 100

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      for (let c = 0; c < 3; c++) {
        const oldVal = data[idx + c]
        const newVal = oldVal < 128 ? 0 : 255
        const quantized = oldVal + (newVal - oldVal) * strength
        data[idx + c] = clamp(quantized)
        const error = (oldVal - quantized) * strength

        // Floyd-Steinberg error diffusion
        if (x + 1 < width) {
          data[((y) * width + (x + 1)) * 4 + c] = clamp(
            data[((y) * width + (x + 1)) * 4 + c] + error * 7 / 16
          )
        }
        if (y + 1 < height) {
          if (x > 0) {
            data[((y + 1) * width + (x - 1)) * 4 + c] = clamp(
              data[((y + 1) * width + (x - 1)) * 4 + c] + error * 3 / 16
            )
          }
          data[((y + 1) * width + x) * 4 + c] = clamp(
            data[((y + 1) * width + x) * 4 + c] + error * 5 / 16
          )
          if (x + 1 < width) {
            data[((y + 1) * width + (x + 1)) * 4 + c] = clamp(
              data[((y + 1) * width + (x + 1)) * 4 + c] + error * 1 / 16
            )
          }
        }
      }
    }
  }
}

function applyPixelate(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  blockSize: number
): void {
  const scaledW = Math.max(1, Math.ceil(width / blockSize))
  const scaledH = Math.max(1, Math.ceil(height / blockSize))

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = scaledW
  tempCanvas.height = scaledH
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) return

  // Scale down
  tempCtx.drawImage(ctx.canvas, 0, 0, scaledW, scaledH)

  // Scale back up without smoothing
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(tempCanvas, 0, 0, scaledW, scaledH, 0, 0, width, height)
  ctx.imageSmoothingEnabled = true
}
