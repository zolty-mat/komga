/**
 * src/utils/theme.ts
 *
 * Theme management utilities for creating, persisting, and applying custom themes
 */

export interface ThemeColor {
  primary: string
  secondary: string
  accent: string
  surface?: string
  error?: string
  warning?: string
  success?: string
  info?: string
}

export interface ThemeTypography {
  fontFamily: 'system' | 'serif' | 'sans-serif' | string
  fontSizeScale: number // 0.8 to 1.4
  lineHeight: number // 1.2 to 1.8
}

export interface ThemeSpacing {
  scale: 'compact' | 'normal' | 'comfortable' // compact = 0.75x, normal = 1x, comfortable = 1.25x
}

export interface ThemeConfig {
  id: string
  name: string
  description?: string
  mode: 'light' | 'dark'
  colors: ThemeColor
  typography?: ThemeTypography
  spacing?: ThemeSpacing
  isCustom: boolean
  createdAt?: number
}

// Preset color palettes
export const THEME_PRESETS = {
  default_light: {
    id: 'default-light',
    name: 'Default Light',
    description: 'Komga default light theme',
    mode: 'light' as const,
    colors: {
      primary: '#005ed3',
      secondary: '#fec000',
      accent: '#ff0335',
      surface: '#ffffff',
      error: '#b3261e',
      warning: '#f9a825',
      success: '#188038',
      info: '#1b6ef3',
    },
    typography: {
      fontFamily: 'system',
      fontSizeScale: 1,
      lineHeight: 1.5,
    },
    spacing: {
      scale: 'normal',
    },
    isCustom: false,
  },
  default_dark: {
    id: 'default-dark',
    name: 'Default Dark',
    description: 'Komga default dark theme',
    mode: 'dark' as const,
    colors: {
      primary: '#78baec',
      secondary: '#fec000',
      accent: '#ff0335',
      surface: '#121212',
      error: '#f2b8b5',
      warning: '#ffe0b2',
      success: '#a6d955',
      info: '#90caf9',
    },
    typography: {
      fontFamily: 'system',
      fontSizeScale: 1,
      lineHeight: 1.5,
    },
    spacing: {
      scale: 'normal',
    },
    isCustom: false,
  },
  high_contrast: {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'WCAG AAA compliant high contrast theme',
    mode: 'light' as const,
    colors: {
      primary: '#000000',
      secondary: '#ffcc00',
      accent: '#ff0000',
      surface: '#ffffff',
      error: '#990000',
      warning: '#ff6600',
      success: '#006600',
      info: '#0066cc',
    },
    typography: {
      fontFamily: 'sans-serif',
      fontSizeScale: 1.1,
      lineHeight: 1.6,
    },
    spacing: {
      scale: 'comfortable',
    },
    isCustom: false,
  },
  warm: {
    id: 'warm',
    name: 'Warm',
    description: 'Warm orange and brown tones',
    mode: 'light' as const,
    colors: {
      primary: '#d97706',
      secondary: '#f59e0b',
      accent: '#dc2626',
      surface: '#fffbf0',
      error: '#b91c1c',
      warning: '#ea580c',
      success: '#16a34a',
      info: '#0284c7',
    },
    typography: {
      fontFamily: 'serif',
      fontSizeScale: 1,
      lineHeight: 1.6,
    },
    spacing: {
      scale: 'normal',
    },
    isCustom: false,
  },
  cool: {
    id: 'cool',
    name: 'Cool',
    description: 'Cool blue and teal tones',
    mode: 'dark' as const,
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#0891b2',
      surface: '#0f172a',
      error: '#ef4444',
      warning: '#f97316',
      success: '#22c55e',
      info: '#3b82f6',
    },
    typography: {
      fontFamily: 'system',
      fontSizeScale: 1,
      lineHeight: 1.5,
    },
    spacing: {
      scale: 'normal',
    },
    isCustom: false,
  },
  solarized_dark: {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    description: 'Solarized dark color scheme',
    mode: 'dark' as const,
    colors: {
      primary: '#268bd2',
      secondary: '#2aa198',
      accent: '#dc322f',
      surface: '#002b36',
      error: '#dc322f',
      warning: '#b58900',
      success: '#859900',
      info: '#2aa198',
    },
    typography: {
      fontFamily: 'system',
      fontSizeScale: 1,
      lineHeight: 1.5,
    },
    spacing: {
      scale: 'normal',
    },
    isCustom: false,
  },
  solarized_light: {
    id: 'solarized-light',
    name: 'Solarized Light',
    description: 'Solarized light color scheme',
    mode: 'light' as const,
    colors: {
      primary: '#268bd2',
      secondary: '#2aa198',
      accent: '#dc322f',
      surface: '#fdf6e3',
      error: '#dc322f',
      warning: '#b58900',
      success: '#859900',
      info: '#2aa198',
    },
    typography: {
      fontFamily: 'system',
      fontSizeScale: 1,
      lineHeight: 1.5,
    },
    spacing: {
      scale: 'normal',
    },
    isCustom: false,
  },
  dracula: {
    id: 'dracula',
    name: 'Dracula',
    description: 'Dracula dark color scheme',
    mode: 'dark' as const,
    colors: {
      primary: '#bd93f9',
      secondary: '#50fa7b',
      accent: '#ff79c6',
      surface: '#282a36',
      error: '#ff5555',
      warning: '#ffb86c',
      success: '#50fa7b',
      info: '#8be9fd',
    },
    typography: {
      fontFamily: 'system',
      fontSizeScale: 1,
      lineHeight: 1.5,
    },
    spacing: {
      scale: 'normal',
    },
    isCustom: false,
  },
  nord: {
    id: 'nord',
    name: 'Nord',
    description: 'Nord dark color scheme',
    mode: 'dark' as const,
    colors: {
      primary: '#88c0d0',
      secondary: '#81a1c1',
      accent: '#bf616a',
      surface: '#2e3440',
      error: '#bf616a',
      warning: '#ebcb8b',
      success: '#a3be8c',
      info: '#81a1c1',
    },
    typography: {
      fontFamily: 'system',
      fontSizeScale: 1,
      lineHeight: 1.5,
    },
    spacing: {
      scale: 'normal',
    },
    isCustom: false,
  },
  gruvbox: {
    id: 'gruvbox',
    name: 'Gruvbox',
    description: 'Gruvbox dark color scheme',
    mode: 'dark' as const,
    colors: {
      primary: '#83a598',
      secondary: '#fe8019',
      accent: '#fb4934',
      surface: '#282828',
      error: '#fb4934',
      warning: '#fabd2f',
      success: '#b8bb26',
      info: '#83a598',
    },
    typography: {
      fontFamily: 'system',
      fontSizeScale: 1,
      lineHeight: 1.5,
    },
    spacing: {
      scale: 'normal',
    },
    isCustom: false,
  },
} as const

export function getPresetThemes(): ThemeConfig[] {
  return Object.values(THEME_PRESETS) as ThemeConfig[]
}

export function getPresetTheme(id: string): ThemeConfig | undefined {
  return Object.values(THEME_PRESETS).find((t) => t.id === id) as ThemeConfig | undefined
}

/**
 * Convert a theme config to Vuetify theme format
 */
export function toVuetifyTheme(config: ThemeConfig) {
  return {
    dark: config.mode === 'dark',
    colors: {
      primary: config.colors.primary,
      secondary: config.colors.secondary,
      accent: config.colors.accent,
      surface: config.colors.surface || (config.mode === 'dark' ? '#121212' : '#ffffff'),
      error: config.colors.error || '#b3261e',
      warning: config.colors.warning || '#f9a825',
      success: config.colors.success || '#188038',
      info: config.colors.info || '#1b6ef3',
    },
  }
}

/**
 * Generate CSS variables from theme config
 */
export function generateCSSVariables(config: ThemeConfig): string {
  const vars: Record<string, string> = {
    '--color-primary': config.colors.primary,
    '--color-secondary': config.colors.secondary,
    '--color-accent': config.colors.accent,
    '--color-surface': config.colors.surface || (config.mode === 'dark' ? '#121212' : '#ffffff'),
    '--color-error': config.colors.error || '#b3261e',
    '--color-warning': config.colors.warning || '#f9a825',
    '--color-success': config.colors.success || '#188038',
    '--color-info': config.colors.info || '#1b6ef3',
  }

  if (config.typography) {
    vars['--font-family'] = config.typography.fontFamily
    vars['--font-size-scale'] = config.typography.fontSizeScale.toString()
    vars['--line-height'] = config.typography.lineHeight.toString()
  }

  if (config.spacing) {
    const scales = { compact: 0.75, normal: 1, comfortable: 1.25 }
    vars['--spacing-scale'] = scales[config.spacing.scale].toString()
  }

  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n')
}

/**
 * Check system preference for dark mode
 */
export function getSystemThemePreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Validate theme config (used for both complete and partial configs)
 */
export function isValidThemeConfig(config: Partial<ThemeConfig>): boolean {
  // Check required fields (id is not required since it's generated, name/mode/colors are)
  if (!config.name || !config.mode || !config.colors) {
    return false
  }

  // Validate hex colors - all required colors must be valid hex format
  const hexRegex = /^#([a-f0-9]{6}|[a-f0-9]{3})$/i
  const colors = config.colors as Record<string, unknown>

  // Check that required colors are valid hex
  if (
    !hexRegex.test(String(colors.primary)) ||
    !hexRegex.test(String(colors.secondary)) ||
    !hexRegex.test(String(colors.accent))
  ) {
    return false
  }

  return true
}
