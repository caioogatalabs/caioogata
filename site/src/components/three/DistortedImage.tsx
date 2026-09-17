'use client'

import { useRef, useMemo, useEffect, useCallback } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { vertexShader, fragmentShader, computeShader } from './shaders/displacement.glsl'

/**
 * Grid resolution for the velocity buffer. The reference implementation derives
 * this from element width (w/70 x h/20), which collapses to 3x14 on a box this
 * small — too coarse to read as liquid. Fixed instead, and still trivial: 1344
 * texels, recomputed only while the trail is alive.
 */
const GRID_W = 32
const GRID_H = 42

/** Frames the trail keeps animating after the pointer stops. */
const ENERGY_FRAMES = 90

/** Per-frame multiplier on the accumulated velocity. Below 1, the trail fades. */
const DECAY = 0.94

export interface DistortedImageProps {
  texture: THREE.Texture
  /** Falloff radius of the mouse, in aspect-corrected UV. */
  distance?: number
  /** How far the displacement pushes the image UVs. */
  strength?: number
  /** Hex colour painted over displaced edges. Converted to linear to match the texture. */
  tint?: string
  /** 0 disables the colour and leaves pure distortion. */
  tintStrength?: number
  /** Renders the raw velocity field instead of the image, for tuning. */
  debugGrid?: boolean
  /** Runs one bottom-to-top sweep once the texture is ready, as the box opens. */
  revealOnMount?: boolean
  /** Delay before that sweep. Match the wrapper's entrance delay. */
  revealDelayMs?: number
  /** Length of the sweep. Match the wrapper's entrance duration. */
  revealDurationMs?: number
  /** Period of the idle twitch, in ms. 0 turns it off. */
  idleGlitchMs?: number
  /** Strength of the idle twitch relative to the reveal sweep. */
  idleGlitchStrength?: number
}

/** Magnitude of a synthetic impulse, in the same units the pointer produces. */
const REVEAL_IMPULSE = 2.2

export function DistortedImage({
  texture,
  distance = 0.25,
  strength = 0.01,
  tint = '#FAEA4D',
  tintStrength = 1,
  debugGrid = false,
  revealOnMount = false,
  revealDelayMs = 0,
  revealDurationMs = 900,
  idleGlitchMs = 0,
  idleGlitchStrength = 0.35,
}: DistortedImageProps) {
  const gl = useThree((s) => s.gl)
  const viewport = useThree((s) => s.viewport)
  const invalidate = useThree((s) => s.invalidate)

  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const energy = useRef(0)
  const lastUv = useRef<THREE.Vector2 | null>(null)

  const aspect = viewport.width / viewport.height

  // The compute pass owns a GPU buffer pair, so it is built once per renderer
  // and disposed by hand — React cannot see into it.
  const compute = useMemo(() => {
    const gpu = new GPUComputationRenderer(GRID_W, GRID_H, gl)
    const variable = gpu.addVariable('uGrid', computeShader, gpu.createTexture())
    gpu.setVariableDependencies(variable, [variable])

    Object.assign(variable.material.uniforms, {
      uMouse: { value: new THREE.Vector2(0, 0) },
      uDeltaMouse: { value: new THREE.Vector2(0, 0) },
      uDistance: { value: distance },
      uDecay: { value: DECAY },
      uGridAspect: { value: new THREE.Vector2(1, 1) },
    })

    const error = gpu.init()
    if (error !== null) console.error('GPUComputationRenderer:', error)

    return { gpu, variable }
    // `distance` seeds the uniform; later changes are pushed in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl])

  useEffect(() => () => compute.gpu.dispose(), [compute])

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uGrid: { value: null as THREE.Texture | null },
      uContainerResolution: { value: new THREE.Vector2(1, 1) },
      uImageResolution: { value: new THREE.Vector2(1, 1) },
      // THREE.Color converts the hex from sRGB into the renderer's linear
      // working space, so the mix below happens in the same space as the texture.
      uTint: { value: new THREE.Color(tint) },
      uTintStrength: { value: tintStrength },
      uStrength: { value: strength },
      uDebugGrid: { value: 0 },
      uEncodeOutput: { value: 1 },
    }),
    // Built once; every field is kept in sync by the effect below so that
    // changing a prop never recreates the material.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // Push prop and size changes onto the live uniforms.
  useEffect(() => {
    const u = uniforms
    u.uTexture.value = texture
    u.uTint.value.set(tint)
    u.uTintStrength.value = tintStrength
    u.uStrength.value = strength
    u.uDebugGrid.value = debugGrid ? 1 : 0
    // Declared NoColorSpace by the caller for video, sRGB for a still — which
    // is exactly the question of whether the shader owes the output an encode.
    u.uEncodeOutput.value = texture.colorSpace === THREE.NoColorSpace ? 0 : 1
    u.uContainerResolution.value.set(viewport.width, viewport.height)

    // A video element carries its intrinsic size on `videoWidth`/`videoHeight`;
    // its `width`/`height` are the layout attributes and read 0 here, which
    // would collapse the shader's cover fit.
    const img = texture.image as
      | { width?: number; height?: number; videoWidth?: number; videoHeight?: number }
      | undefined
    u.uImageResolution.value.set(
      img?.videoWidth || img?.width || 1,
      img?.videoHeight || img?.height || 1,
    )

    const c = compute.variable.material.uniforms
    c.uDistance.value = distance
    c.uGridAspect.value.set(aspect > 1 ? aspect : 1, aspect > 1 ? 1 : 1 / aspect)

    invalidate()
  }, [
    uniforms, texture, tint, tintStrength, strength, debugGrid,
    viewport.width, viewport.height, distance, aspect, compute, invalidate,
  ])

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!event.uv) return
    const c = compute.variable.material.uniforms

    if (lastUv.current) {
      // Velocity, not position — a still pointer displaces nothing.
      c.uDeltaMouse.value.subVectors(event.uv, lastUv.current).multiplyScalar(90)
      lastUv.current.copy(event.uv)
    } else {
      lastUv.current = event.uv.clone()
    }

    c.uMouse.value.copy(event.uv)
    energy.current = ENERGY_FRAMES
    invalidate()
  }

  const handlePointerOut = () => {
    lastUv.current = null
  }

  /**
   * Writes the same uniforms the pointer handler writes, so a scripted effect
   * and a real hover are indistinguishable downstream. The reference site does
   * the same thing on pointerdown, injecting an impulse with no movement
   * behind it.
   */
  const drive = useCallback(
    (u: number, v: number, dx: number, dy: number) => {
      const c = compute.variable.material.uniforms
      c.uMouse.value.set(u, v)
      c.uDeltaMouse.value.set(dx, dy)
      energy.current = ENERGY_FRAMES
      invalidate()
    },
    [compute, invalidate],
  )

  // Reveal: one sweep from the bottom edge to the top, timed to the wrapper's
  // clip-path entrance so the distortion happens WHILE the box opens.
  useEffect(() => {
    if (!revealOnMount) return
    let raf = 0
    let start = 0

    const step = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / revealDurationMs)
      // Drift sideways a little so the sweep does not read as a straight line.
      drive(0.5 + Math.sin(t * Math.PI * 2) * 0.18, t, 0, REVEAL_IMPULSE * (1 - t * 0.5))
      if (t < 1) raf = requestAnimationFrame(step)
    }

    const timer = setTimeout(() => {
      raf = requestAnimationFrame(step)
    }, revealDelayMs)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [revealOnMount, revealDelayMs, revealDurationMs, drive])

  // Idle twitch: a few weak impulses at random spots, on a slow period. Meant
  // to be noticed peripherally, not watched.
  useEffect(() => {
    if (!idleGlitchMs) return
    let timers: ReturnType<typeof setTimeout>[] = []

    const burst = () => {
      if (document.hidden) return
      timers = []
      const shots = 2 + Math.floor(Math.random() * 2)
      for (let i = 0; i < shots; i++) {
        timers.push(
          setTimeout(() => {
            const angle = Math.random() * Math.PI * 2
            const mag = REVEAL_IMPULSE * idleGlitchStrength
            drive(
              Math.random(),
              Math.random(),
              Math.cos(angle) * mag,
              Math.sin(angle) * mag,
            )
          }, i * 55),
        )
      }
    }

    const interval = setInterval(burst, idleGlitchMs)
    return () => {
      clearInterval(interval)
      timers.forEach(clearTimeout)
    }
  }, [idleGlitchMs, idleGlitchStrength, drive])

  useFrame(() => {
    if (energy.current <= 0) return

    const c = compute.variable.material.uniforms
    c.uDeltaMouse.value.multiplyScalar(DECAY)

    compute.gpu.compute()
    uniforms.uGrid.value = compute.gpu.getCurrentRenderTarget(compute.variable).texture

    energy.current -= 1
    // Keeps the demand-driven loop alive only while the trail is still moving.
    invalidate()
  })

  return (
    <mesh
      scale={[viewport.width, viewport.height, 1]}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}
