'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from './shaders/noise.glsl'

interface NoiseGradientProps {
  colors: [string, string, string]
  speed?: number
  paused?: boolean
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

export function NoiseGradient({ colors, speed = 0.15, paused = false }: NoiseGradientProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  const uniforms = useMemo(() => {
    const [c1, c2, c3] = colors.map(hexToRgb)
    return {
      uTime: { value: 0 },
      uNoiseDensity: { value: 1.5 },
      uNoiseStrength: { value: 0.3 },
      uC1r: { value: c1[0] }, uC1g: { value: c1[1] }, uC1b: { value: c1[2] },
      uC2r: { value: c2[0] }, uC2g: { value: c2[1] }, uC2b: { value: c2[2] },
      uC3r: { value: c3[0] }, uC3g: { value: c3[1] }, uC3b: { value: c3[2] },
    }
  }, [colors])

  useFrame((_, delta) => {
    if (materialRef.current && !paused) {
      materialRef.current.uniforms.uTime.value += delta * speed
    }
  })

  // Scale mesh to cover the entire viewport (use max to avoid gaps)
  const scale = Math.max(viewport.width / 10, viewport.height / 6)

  return (
    <mesh ref={meshRef} scale={[scale, scale, 1]}>
      <planeGeometry args={[10, 6, 48, 48]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
