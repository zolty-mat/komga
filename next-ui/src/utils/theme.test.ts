/**
 * src/utils/theme.test.ts
 *
 * Theme utility functions tests
 */

import { describe, it, expect } from 'vitest'
import {
  getPresetThemes,
  getPresetTheme,
  toVuetifyTheme,
  generateCSSVariables,
  isValidThemeConfig,
  getSystemThemePreference,
  THEME_PRESETS,
} from '@/utils/theme'

describe('Theme Utilities', () => {
  describe('Preset themes', () => {
    it('should have all required preset themes', () => {
      const presets = getPresetThemes()
      expect(presets.length).toBeGreaterThan(0)

      const ids = presets.map((t) => t.id)
      expect(ids).toContain('default-light')
      expect(ids).toContain('default-dark')
      expect(ids).toContain('high-contrast')
      expect(ids).toContain('warm')
      expect(ids).toContain('cool')
    })

    it('should return correct preset by ID', () => {
      const theme = getPresetTheme('default-light')
      expect(theme).toBeDefined()
      expect(theme?.id).toBe('default-light')
      expect(theme?.mode).toBe('light')
    })

    it('should return undefined for non-existent preset', () => {
      const theme = getPresetTheme('non-existent')
      expect(theme).toBeUndefined()
    })

    it('should mark presets as non-custom', () => {
      const presets = getPresetThemes()
      expect(presets.every((t) => t.isCustom === false)).toBe(true)
    })

    it('should have valid colors in all presets', () => {
      const presets = getPresetThemes()
      const hexRegex = /^#([a-f0-9]{6}|[a-f0-9]{3})$/i

      presets.forEach((preset) => {
        expect(hexRegex.test(preset.colors.primary)).toBe(true)
        expect(hexRegex.test(preset.colors.secondary)).toBe(true)
        expect(hexRegex.test(preset.colors.accent)).toBe(true)
      })
    })
  })

  describe('Vuetify theme conversion', () => {
    it('should convert theme config to Vuetify format', () => {
      const config = getPresetTheme('default-light')!
      const vuetifyTheme = toVuetifyTheme(config)

      expect(vuetifyTheme.dark).toBe(false)
      expect(vuetifyTheme.colors).toBeDefined()
      expect(vuetifyTheme.colors.primary).toBe(config.colors.primary)
      expect(vuetifyTheme.colors.secondary).toBe(config.colors.secondary)
    })

    it('should set dark flag correctly for dark themes', () => {
      const config = getPresetTheme('default-dark')!
      const vuetifyTheme = toVuetifyTheme(config)

      expect(vuetifyTheme.dark).toBe(true)
    })

    it('should include all color properties', () => {
      const config = getPresetTheme('default-light')!
      const vuetifyTheme = toVuetifyTheme(config)

      expect(vuetifyTheme.colors.primary).toBeDefined()
      expect(vuetifyTheme.colors.secondary).toBeDefined()
      expect(vuetifyTheme.colors.accent).toBeDefined()
      expect(vuetifyTheme.colors.surface).toBeDefined()
      expect(vuetifyTheme.colors.error).toBeDefined()
      expect(vuetifyTheme.colors.warning).toBeDefined()
      expect(vuetifyTheme.colors.success).toBeDefined()
      expect(vuetifyTheme.colors.info).toBeDefined()
    })
  })

  describe('CSS variable generation', () => {
    it('should generate CSS variables from theme', () => {
      const config = getPresetTheme('default-light')!
      const cssVars = generateCSSVariables(config)

      expect(cssVars).toContain('--color-primary:')
      expect(cssVars).toContain('--color-secondary:')
      expect(cssVars).toContain('--color-accent:')
      expect(cssVars).toContain(config.colors.primary)
    })

    it('should include typography variables', () => {
      const config = getPresetTheme('default-light')!
      const cssVars = generateCSSVariables(config)

      expect(cssVars).toContain('--font-family:')
      expect(cssVars).toContain('--font-size-scale:')
      expect(cssVars).toContain('--line-height:')
    })

    it('should include spacing scale', () => {
      const config = getPresetTheme('default-light')!
      const cssVars = generateCSSVariables(config)

      expect(cssVars).toContain('--spacing-scale:')
    })

    it('should format as valid CSS', () => {
      const config = getPresetTheme('default-light')!
      const cssVars = generateCSSVariables(config)

      const lines = cssVars.split('\n').filter((line) => line.trim())
      lines.forEach((line) => {
        expect(line).toMatch(/^--[a-z-]+:\s*.+;$/)
      })
    })
  })

  describe('Theme validation', () => {
    it('should validate correct theme config', () => {
      const config = {
        id: 'test-theme',
        name: 'Test Theme',
        mode: 'light' as const,
        colors: {
          primary: '#005ed3',
          secondary: '#fec000',
          accent: '#ff0335',
        },
      }

      expect(isValidThemeConfig(config)).toBe(true)
    })

    it('should accept config without id (id is generated)', () => {
      const config = {
        name: 'Test Theme',
        mode: 'light' as const,
        colors: {
          primary: '#005ed3',
          secondary: '#fec000',
          accent: '#ff0335',
        },
      }

      expect(isValidThemeConfig(config)).toBe(true)
    })

    it('should reject config without colors', () => {
      const config = {
        id: 'test-theme',
        name: 'Test Theme',
        mode: 'light' as const,
      }

      expect(isValidThemeConfig(config)).toBe(false)
    })

    it('should reject invalid hex colors', () => {
      const config = {
        id: 'test-theme',
        name: 'Test Theme',
        mode: 'light' as const,
        colors: {
          primary: 'not-a-hex',
          secondary: '#fec000',
          accent: '#ff0335',
        },
      }

      expect(isValidThemeConfig(config)).toBe(false)
    })

    it('should accept 3-digit hex colors', () => {
      const config = {
        id: 'test-theme',
        name: 'Test Theme',
        mode: 'light' as const,
        colors: {
          primary: '#f00',
          secondary: '#0f0',
          accent: '#00f',
        },
      }

      expect(isValidThemeConfig(config)).toBe(true)
    })

    it('should be case-insensitive for hex colors', () => {
      const config = {
        id: 'test-theme',
        name: 'Test Theme',
        mode: 'light' as const,
        colors: {
          primary: '#ABC123',
          secondary: '#DEF456',
          accent: '#FEDCBA',
        },
      }

      expect(isValidThemeConfig(config)).toBe(true)
    })
  })

  describe('System theme preference', () => {
    it('should return light or dark', () => {
      const pref = getSystemThemePreference()
      expect(['light', 'dark']).toContain(pref)
    })

    it('should handle missing window gracefully', () => {
      const originalWindow = global.window
      // @ts-expect-error testing undefined window
      global.window = undefined

      const pref = getSystemThemePreference()
      expect(pref).toBe('light')

      global.window = originalWindow
    })
  })

  describe('Preset theme variants', () => {
    it('should have light and dark variants', () => {
      const presets = getPresetThemes()
      const lightPresets = presets.filter((t) => t.mode === 'light')
      const darkPresets = presets.filter((t) => t.mode === 'dark')

      expect(lightPresets.length).toBeGreaterThan(0)
      expect(darkPresets.length).toBeGreaterThan(0)
    })

    it('should have high contrast preset', () => {
      const theme = getPresetTheme('high-contrast')
      expect(theme).toBeDefined()
      expect(theme?.name).toBe('High Contrast')
    })

    it('should have named preset themes', () => {
      const presetNames = [
        'default-light',
        'default-dark',
        'high-contrast',
        'warm',
        'cool',
        'solarized-dark',
        'solarized-light',
        'dracula',
        'nord',
        'gruvbox',
      ]

      presetNames.forEach((name) => {
        expect(getPresetTheme(name)).toBeDefined()
      })
    })
  })

  describe('Preset exports', () => {
    it('should export THEME_PRESETS constant', () => {
      expect(THEME_PRESETS).toBeDefined()
      expect(Object.keys(THEME_PRESETS).length).toBeGreaterThan(0)
    })

    it('should have correct keys in THEME_PRESETS', () => {
      const keys = Object.keys(THEME_PRESETS)
      expect(keys).toContain('default_light')
      expect(keys).toContain('default_dark')
    })
  })
})
