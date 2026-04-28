'use client'

import { useState } from 'react'

/* ─── Hover animation helpers ─── */
const EASE = 'cubic-bezier(0.16,1,0.3,1)'

/* ── Primary text swap (no fill — immediate) ── */
function enterT(hovered: boolean, extraDelay = 0) {
  return {
    transform: hovered ? 'translateY(-100%)' : 'translateY(0)',
    opacity: hovered ? 0 : 1,
    transition: hovered
      ? `transform 1s ${EASE} ${extraDelay}s, opacity 0.3s ${EASE} ${extraDelay}s`
      : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
  }
}

function enterB(hovered: boolean, extraDelay = 0) {
  return {
    transform: hovered ? 'translateY(0)' : 'translateY(100%)',
    opacity: hovered ? 1 : 0,
    transition: hovered
      ? `transform 1s ${EASE} ${extraDelay}s, opacity 0.3s ${EASE} ${extraDelay}s`
      : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
  }
}

/* ── Secondary text swap (synced with fill — default exits early, hover enters after fill) ── */
function secT(hovered: boolean, extraDelay = 0) {
  return {
    transform: hovered ? 'translateY(-100%)' : 'translateY(0)',
    opacity: hovered ? 0 : 1,
    transition: hovered
      ? `transform 0.4s ${EASE} ${0.05 + extraDelay}s, opacity 0.2s ${EASE} ${0.05 + extraDelay}s`
      : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
  }
}

function secB(hovered: boolean, extraDelay = 0) {
  return {
    transform: hovered ? 'translateY(0)' : 'translateY(100%)',
    opacity: hovered ? 1 : 0,
    transition: hovered
      ? `transform 1s ${EASE} ${0.1 + extraDelay}s, opacity 0.3s ${EASE} ${0.1 + extraDelay}s`
      : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
  }
}

/* ── Rotated arrow for icon buttons ── */
function ArrowIcon({ rotate = 0 }: { rotate?: number }) {
  return (
    <span style={{ display: 'inline-block', transform: `rotate(${rotate}deg)` }}>→</span>
  )
}

/* ─── Section wrapper ─── */
type ThemeMode = 'dark' | 'light' | 'inverse'

const THEME_BG: Record<ThemeMode, string> = {
  dark: 'bg-bg-surface-primary',
  light: 'bg-bg-surface-tertiary',
  inverse: 'bg-bg',
}

const THEME_TOKEN: Record<ThemeMode, string> = {
  dark: 'bg-surface-primary (n-450, 0.22)',
  light: 'bg-surface-tertiary (n-400, 0.36)',
  inverse: 'bg (brand-400, 0.91)',
}

function Section({ title, children, theme = 'dark' }: { title: string; children: React.ReactNode; theme?: ThemeMode }) {
  return (
    <div
      className={`flex flex-col gap-6 p-8 rounded-[12px] ${THEME_BG[theme]}`}
      data-theme={theme === 'dark' ? undefined : theme}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-[0.08em] text-text-tertiary font-mono">
          {title}
        </h2>
        <span className="text-[10px] font-mono text-text-tertiary opacity-60 px-2 py-0.5 border border-border-primary rounded-[6px]">
          {THEME_TOKEN[theme]}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {children}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   PRIMARY BUTTON — Pill
   ═══════════════════════════════════════════ */
function PrimaryPill({ label }: { label: string }) {
  const [h, setH] = useState(false)
  return (
    <button
      className="relative inline-flex items-center justify-center h-12 rounded-full bg-bg-fill-primary text-text-on-primary px-8 overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <span className="block text-base font-medium" style={{ fontFamily: 'var(--font-sans)', ...enterT(h) }}>{label}</span>
      <span className="absolute inset-0 flex items-center justify-center type-overlay-hover" style={{ ...enterB(h) }}>{label}</span>
    </button>
  )
}

/* ═══════════════════════════════════════════
   PRIMARY BUTTON — Squared (12px radius)
   ═══════════════════════════════════════════ */
function PrimarySquared({ label }: { label: string }) {
  const [h, setH] = useState(false)
  return (
    <button
      className="relative inline-flex items-center justify-center h-12 rounded-[12px] bg-bg-fill-primary text-text-on-primary px-8 overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <span className="block text-base font-medium" style={{ fontFamily: 'var(--font-sans)', ...enterT(h) }}>{label}</span>
      <span className="absolute inset-0 flex items-center justify-center type-overlay-hover" style={{ ...enterB(h) }}>{label}</span>
    </button>
  )
}

/* ═══════════════════════════════════════════
   PRIMARY ICON ONLY
   ═══════════════════════════════════════════ */
function PrimaryIconOnly({ icon, radius = 'full' }: { icon: string; radius?: 'full' | '12' }) {
  const [h, setH] = useState(false)
  const r = radius === 'full' ? 'rounded-full' : 'rounded-[12px]'
  return (
    <button
      className={`relative flex items-center justify-center size-12 ${r} bg-bg-fill-primary text-text-on-primary overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover`}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <span className="block text-lg" style={{ fontFamily: 'var(--font-sans)', ...enterT(h) }}>{icon}</span>
      <span className="absolute inset-0 flex items-center justify-center type-overlay-hover" style={{ ...enterB(h) }}>{icon}</span>
    </button>
  )
}

/* ═══════════════════════════════════════════
   PRIMARY COMPOSITION — Button + IconOnly
   ═══════════════════════════════════════════ */
function PrimaryComposition({ label, icon }: { label: string; icon: string }) {
  const [h, setH] = useState(false)
  return (
    <div className="flex items-center gap-0.5" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <button className="relative inline-flex items-center justify-center h-12 rounded-full bg-bg-fill-primary text-text-on-primary px-8 overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover">
        <span className="block text-base font-medium" style={{ fontFamily: 'var(--font-sans)', ...enterT(h) }}>{label}</span>
        <span className="absolute inset-0 flex items-center justify-center type-overlay-hover" style={{ ...enterB(h) }}>{label}</span>
      </button>
      <button className="relative flex items-center justify-center size-12 rounded-[12px] bg-bg-fill-primary text-text-on-primary overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover">
        <span className="block text-lg" style={{ fontFamily: 'var(--font-sans)', ...enterT(h, 0.1) }}>{icon}</span>
        <span className="absolute inset-0 flex items-center justify-center type-overlay-hover" style={{ ...enterB(h, 0.1) }}>{icon}</span>
      </button>
    </div>
  )
}

/* ─── Expanding fill shape (like menu bar) ─── */
function ExpandingFill({ active, radius = '12px', delay = 0 }: { active: boolean; radius?: string; delay?: number }) {
  return (
    <div
      className="absolute bg-bg-fill-outline-hover pointer-events-none"
      style={{
        inset: '0',
        borderRadius: radius,
        transform: active ? 'translateY(0)' : 'translateY(100%)',
        transition: active
          ? `transform 0.2s cubic-bezier(0.16,1,0.3,1) ${delay}s`
          : `transform 0.2s cubic-bezier(0.16,1,0.3,1) 0.04s`,
      }}
    />
  )
}

/* ═══════════════════════════════════════════
   SECONDARY BUTTON — Pill
   ═══════════════════════════════════════════ */
function SecondaryPill({ label }: { label: string }) {
  const [h, setH] = useState(false)
  return (
    <button
      className="relative inline-flex items-center justify-center h-12 rounded-full border border-border-primary px-8 overflow-hidden"
      style={{ color: h ? 'var(--color-text-on-outline-hover)' : 'var(--color-text-secondary)', transition: 'color 0.15s' }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <ExpandingFill active={h} radius="999px" />
      <span className="relative z-10 block text-base font-medium overflow-hidden" style={{ fontFamily: 'var(--font-sans)', ...secT(h) }}>{label}</span>
      <span className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden type-overlay-hover" style={{ ...secB(h) }}>{label}</span>
    </button>
  )
}

/* ═══════════════════════════════════════════
   SECONDARY BUTTON — Squared
   ═══════════════════════════════════════════ */
function SecondarySquared({ label }: { label: string }) {
  const [h, setH] = useState(false)
  return (
    <button
      className="relative inline-flex items-center justify-center h-12 rounded-[12px] border border-border-primary px-8 overflow-hidden"
      style={{ color: h ? 'var(--color-text-on-outline-hover)' : 'var(--color-text-secondary)', transition: 'color 0.15s' }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <ExpandingFill active={h} />
      <span className="relative z-10 block text-base font-medium overflow-hidden" style={{ fontFamily: 'var(--font-sans)', ...secT(h) }}>{label}</span>
      <span className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden type-overlay-hover" style={{ ...secB(h) }}>{label}</span>
    </button>
  )
}

/* ═══════════════════════════════════════════
   SECONDARY ICON ONLY
   ═══════════════════════════════════════════ */
function SecondaryIconOnly({ icon, radius = '12' }: { icon: string; radius?: 'full' | '12' }) {
  const [h, setH] = useState(false)
  const r = radius === 'full' ? 'rounded-full' : 'rounded-[12px]'
  const fr = radius === 'full' ? '999px' : '12px'
  return (
    <button
      className={`relative flex items-center justify-center size-12 ${r} border border-border-primary overflow-hidden`}
      style={{ color: h ? 'var(--color-text-on-outline-hover)' : 'var(--color-text-secondary)', transition: 'color 0.15s' }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <ExpandingFill active={h} radius={fr} />
      <span className="relative z-10 block text-lg overflow-hidden" style={{ fontFamily: 'var(--font-sans)', ...secT(h) }}>{icon}</span>
      <span className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden type-overlay-hover" style={{ ...secB(h) }}>{icon}</span>
    </button>
  )
}

/* ═══════════════════════════════════════════
   SECONDARY COMPOSITION — Button + IconOnly
   ═══════════════════════════════════════════ */
function SecondaryComposition({ label, icon, iconRotate = 0 }: { label: string; icon: string; iconRotate?: number }) {
  const [h, setH] = useState(false)
  const rotatedIcon = iconRotate ? <span style={{ display: 'inline-block', transform: `rotate(${iconRotate}deg)` }}>{icon}</span> : icon
  return (
    <div className="flex items-center gap-0.5" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <button
        className="relative inline-flex items-center justify-center h-12 rounded-[12px] border border-border-primary px-8 overflow-hidden"
        style={{ color: h ? 'var(--color-text-on-outline-hover)' : 'var(--color-text-secondary)', transition: 'color 0.15s' }}
      >
        <ExpandingFill active={h} />
        <span className="relative z-10 block text-base font-medium overflow-hidden" style={{ fontFamily: 'var(--font-sans)', ...secT(h) }}>{label}</span>
        <span className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden type-overlay-hover" style={{ ...secB(h) }}>{label}</span>
      </button>
      <button
        className="relative flex items-center justify-center size-12 rounded-[12px] border border-border-primary overflow-hidden"
        style={{ color: h ? 'var(--color-text-on-outline-hover)' : 'var(--color-text-secondary)', transition: 'color 0.15s' }}
      >
        <ExpandingFill active={h} delay={0.1} />
        <span className="relative z-10 block text-lg overflow-hidden" style={{ fontFamily: 'var(--font-sans)', ...secT(h, 0.1) }}>{rotatedIcon}</span>
        <span className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden type-overlay-hover" style={{ ...secB(h, 0.1) }}>{rotatedIcon}</span>
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
export default function ButtonsPage() {
  return (
    <main className="min-h-screen bg-bg px-5 py-12 md:px-8 lg:px-16 flex flex-col gap-8">
      <div className="flex flex-col gap-2 mb-4">
        <h1
          className="text-3xl font-semibold text-text-primary"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Buttons
        </h1>
        <p className="text-text-secondary text-sm font-mono">
          Component review — hover to see states
        </p>
      </div>

      {/* ═══════════════════════════════════════════
          DARK THEME (default)
          ═══════════════════════════════════════════ */}
      <h2 className="text-lg font-semibold text-text-primary mt-4" style={{ fontFamily: 'var(--font-sans)' }}>
        Dark (default)
      </h2>

      <Section title="Primary — Pill / Squared">
        <PrimaryPill label="Contact" />
        <PrimaryPill label="ask about" />
        <PrimarySquared label="Submit" />
      </Section>

      <Section title="Primary — Icon Only / Composition">
        <PrimaryIconOnly icon="×" radius="12" />
        <PrimaryIconOnly icon="→" radius="full" />
        <PrimaryComposition label="ask about" icon="×" />
        <PrimaryComposition label="Contact" icon="→" />
      </Section>

      <Section title="Secondary — Pill / Squared">
        <SecondaryPill label="Clear" />
        <SecondaryPill label="Submit" />
        <SecondarySquared label="LinkedIn" />
      </Section>

      <Section title="Secondary — Icon Only / Composition">
        <SecondaryIconOnly icon="×" />
        <SecondaryIconOnly icon="→" radius="full" />
        <SecondaryComposition label="LinkedIn" icon="→" iconRotate={-45} />
        <SecondaryComposition label="GitHub" icon="→" iconRotate={-45} />
      </Section>

      {/* ═══════════════════════════════════════════
          LIGHT THEME (grey-based)
          ═══════════════════════════════════════════ */}
      <h2 className="text-lg font-semibold text-text-primary mt-8" style={{ fontFamily: 'var(--font-sans)' }}>
        Light (grey-based)
      </h2>

      <Section title="Primary — Pill / Squared" theme="light">
        <PrimaryPill label="Contact" />
        <PrimaryPill label="ask about" />
        <PrimarySquared label="Submit" />
      </Section>

      <Section title="Primary — Icon Only / Composition" theme="light">
        <PrimaryIconOnly icon="×" radius="12" />
        <PrimaryIconOnly icon="→" radius="full" />
        <PrimaryComposition label="ask about" icon="×" />
        <PrimaryComposition label="Contact" icon="→" />
      </Section>

      <Section title="Secondary — Pill / Squared" theme="light">
        <SecondaryPill label="Clear" />
        <SecondaryPill label="Submit" />
        <SecondarySquared label="LinkedIn" />
      </Section>

      <Section title="Secondary — Icon Only / Composition" theme="light">
        <SecondaryIconOnly icon="×" />
        <SecondaryIconOnly icon="→" radius="full" />
        <SecondaryComposition label="LinkedIn" icon="→" iconRotate={-45} />
        <SecondaryComposition label="GitHub" icon="→" iconRotate={-45} />
      </Section>

      {/* ═══════════════════════════════════════════
          INVERSE THEME (brand yellow bg)
          ═══════════════════════════════════════════ */}
      <h2 className="text-lg font-semibold text-text-primary mt-8" style={{ fontFamily: 'var(--font-sans)' }}>
        Inverse (brand)
      </h2>

      <Section title="Primary — Pill / Squared" theme="inverse">
        <PrimaryPill label="Contact" />
        <PrimaryPill label="ask about" />
        <PrimarySquared label="Submit" />
      </Section>

      <Section title="Primary — Icon Only / Composition" theme="inverse">
        <PrimaryIconOnly icon="×" radius="12" />
        <PrimaryIconOnly icon="→" radius="full" />
        <PrimaryComposition label="ask about" icon="×" />
        <PrimaryComposition label="Contact" icon="→" />
      </Section>

      <Section title="Secondary — Pill / Squared" theme="inverse">
        <SecondaryPill label="Clear" />
        <SecondaryPill label="Submit" />
        <SecondarySquared label="LinkedIn" />
      </Section>

      <Section title="Secondary — Icon Only / Composition" theme="inverse">
        <SecondaryIconOnly icon="×" />
        <SecondaryIconOnly icon="→" radius="full" />
        <SecondaryComposition label="LinkedIn" icon="→" iconRotate={-45} />
        <SecondaryComposition label="GitHub" icon="→" iconRotate={-45} />
      </Section>
    </main>
  )
}
