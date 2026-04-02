/**
 * TypeScript tokens map — type-safe access for dynamic styles.
 * Use when a token needs to live in TypeScript (animations, inline styles, dynamic props).
 *
 * Usage:
 *   <motion.div style={{ backgroundColor: tokens.color.bgFillPrimary }} />
 *   <Icon color={tokens.color.iconBrand} />
 */

export const tokens = {
  color: {
    // Background
    bg:                      'var(--color-bg)',
    bgSurfacePrimary:        'var(--color-bg-surface-primary)',
    bgSurfaceSecondary:      'var(--color-bg-surface-secondary)',
    bgSurfaceSecondaryHover: 'var(--color-bg-surface-secondary-hover)',
    bgFillPrimary:           'var(--color-bg-fill-primary)',
    bgFillPrimaryHover:      'var(--color-bg-fill-primary-hover)',
    bgFillPrimaryActive:     'var(--color-bg-fill-primary-active)',
    bgFillPrimaryDisabled:   'var(--color-bg-fill-primary-disabled)',
    bgFillSecondary:         'var(--color-bg-fill-secondary)',
    bgFillSecondaryHover:    'var(--color-bg-fill-secondary-hover)',
    bgFillAccent:            'var(--color-bg-fill-accent)',
    bgFillAccentHover:       'var(--color-bg-fill-accent-hover)',
    bgFillDanger:            'var(--color-bg-fill-danger)',
    bgFillDangerHover:       'var(--color-bg-fill-danger-hover)',
    bgFillSuccess:           'var(--color-bg-fill-success)',
    bgFillWarning:           'var(--color-bg-fill-warning)',

    // Text
    textPrimary:             'var(--color-text-primary)',
    textSecondary:           'var(--color-text-secondary)',
    textTertiary:            'var(--color-text-tertiary)',
    textPrimaryDisabled:     'var(--color-text-primary-disabled)',
    textInverse:             'var(--color-text-inverse)',
    textBrand:               'var(--color-text-brand)',
    textOnPrimary:           'var(--color-text-on-primary)',
    textSecondaryAccent:     'var(--color-text-secondary-accent)',
    textAccent:              'var(--color-text-accent)',
    textDanger:              'var(--color-text-danger)',
    textWarning:             'var(--color-text-warning)',
    textSuccess:             'var(--color-text-success)',
    textPlaceholder:         'var(--color-text-placeholder)',

    // Border
    borderPrimary:           'var(--color-border-primary)',
    borderSecondary:         'var(--color-border-secondary)',
    borderTertiaryDefault:   'var(--color-border-tertiary-default)',
    borderBrand:             'var(--color-border-brand)',
    borderFocus:             'var(--color-border-focus)',
    borderDanger:            'var(--color-border-danger)',

    // Icon
    iconPrimary:             'var(--color-icon-primary)',
    iconSecondary:           'var(--color-icon-secondary)',
    iconSecondaryHover:      'var(--color-icon-secondary-hover)',
    iconTertiary:            'var(--color-icon-tertiary)',
    iconInverse:             'var(--color-icon-inverse)',
    iconBrand:               'var(--color-icon-brand)',
    iconDanger:              'var(--color-icon-danger)',
  },

  space: {
    componentXs: 'var(--spacing-component-xs)',
    componentSm: 'var(--spacing-component-sm)',
    componentMd: 'var(--spacing-component-md)',
    componentLg: 'var(--spacing-component-lg)',
    componentXl: 'var(--spacing-component-xl)',
    blockSm:     'var(--spacing-block-sm)',
    blockMd:     'var(--spacing-block-md)',
    blockLg:     'var(--spacing-block-lg)',
    blockXl:     'var(--spacing-block-xl)',
    layoutXl:    'var(--spacing-layout-xl)',
  },

  radius: {
    none: 'var(--radius-component-none)',
    sm:   'var(--radius-component-sm)',
    md:   'var(--radius-component-md)',
    full: 'var(--radius-component-full)',
  },

  font: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  },
} as const

export type ColorToken = typeof tokens.color[keyof typeof tokens.color]
export type SpaceToken = typeof tokens.space[keyof typeof tokens.space]
export type RadiusToken = typeof tokens.radius[keyof typeof tokens.radius]
