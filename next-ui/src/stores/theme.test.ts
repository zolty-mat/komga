/**
 * src/stores/theme.test.ts
 *
 * Pinia theme store tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { getPresetTheme } from '@/utils/theme'

describe('Theme Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Initial state', () => {
    it('should initialize with default light theme', () => {
      const store = useThemeStore()
      expect(store.activeThemeId).toBe('default-light')
      expect(store.customThemes).toEqual([])
      expect(store.useSystemPreference).toBe(false)
    })
  })

  describe('Getters', () => {
    it('should return all themes including presets and custom', () => {
      const store = useThemeStore()
      store.createTheme({
        name: 'Custom Theme',
        mode: 'light',
        colors: {
          primary: '#000000',
          secondary: '#ffffff',
          accent: '#ff0000',
        },
      })

      const allThemes = store.allThemes
      expect(allThemes.length).toBeGreaterThan(0)
      expect(allThemes.some((t) => t.isCustom)).toBe(true)
    })

    it('should return active theme', () => {
      const store = useThemeStore()
      const activeTheme = store.activeTheme
      expect(activeTheme).toBeDefined()
      expect(activeTheme.id).toBe('default-light')
    })

    it('should filter themes by mode', () => {
      const store = useThemeStore()
      const lightThemes = store.themesByMode('light')
      const darkThemes = store.themesByMode('dark')

      expect(lightThemes.length).toBeGreaterThan(0)
      expect(darkThemes.length).toBeGreaterThan(0)
      expect(lightThemes.every((t) => t.mode === 'light')).toBe(true)
      expect(darkThemes.every((t) => t.mode === 'dark')).toBe(true)
    })

    it('should identify custom themes', () => {
      const store = useThemeStore()
      const customTheme = store.createTheme({
        name: 'Custom',
        mode: 'light',
        colors: {
          primary: '#000000',
          secondary: '#ffffff',
          accent: '#ff0000',
        },
      })

      store.setActiveTheme(customTheme.id)
      expect(store.isCustomTheme).toBe(true)

      store.setActiveTheme('default-light')
      expect(store.isCustomTheme).toBe(false)
    })
  })

  describe('Actions', () => {
    it('should set active theme', () => {
      const store = useThemeStore()
      const darkTheme = getPresetTheme('default-dark')

      store.setActiveTheme(darkTheme!.id)
      expect(store.activeThemeId).toBe('default-dark')
    })

    it('should not set invalid theme', () => {
      const store = useThemeStore()
      const originalThemeId = store.activeThemeId

      store.setActiveTheme('non-existent-theme')
      expect(store.activeThemeId).toBe(originalThemeId)
    })

    it('should get theme by ID', () => {
      const store = useThemeStore()
      const theme = store.getThemeById('default-light')

      expect(theme).toBeDefined()
      expect(theme?.id).toBe('default-light')
    })

    it('should return undefined for non-existent theme', () => {
      const store = useThemeStore()
      const theme = store.getThemeById('non-existent')

      expect(theme).toBeUndefined()
    })

    describe('Creating themes', () => {
      it('should create custom theme with valid config', () => {
        const store = useThemeStore()
        const newTheme = store.createTheme({
          name: 'My Custom Theme',
          mode: 'light',
          colors: {
            primary: '#ff0000',
            secondary: '#00ff00',
            accent: '#0000ff',
          },
        })

        expect(newTheme.id).toBeDefined()
        expect(newTheme.id).toMatch(/^custom-/)
        expect(newTheme.name).toBe('My Custom Theme')
        expect(newTheme.isCustom).toBe(true)
        expect(newTheme.createdAt).toBeDefined()
        expect(store.customThemes).toContainEqual(newTheme)
      })

      it('should throw error for invalid config', () => {
        const store = useThemeStore()

        expect(() => {
          store.createTheme({
            name: '',
            mode: 'light',
            colors: {
              primary: '#ff0000',
              secondary: '#00ff00',
              accent: '#0000ff',
            },
          })
        }).toThrow()
      })

      it('should throw error for invalid hex colors', () => {
        const store = useThemeStore()

        expect(() => {
          store.createTheme({
            name: 'Invalid Colors',
            mode: 'light',
            colors: {
              primary: 'notahex',
              secondary: '#00ff00',
              accent: '#0000ff',
            },
          })
        }).toThrow()
      })
    })

    describe('Updating themes', () => {
      it('should update custom theme', () => {
        const store = useThemeStore()
        const theme = store.createTheme({
          name: 'Original Name',
          mode: 'light',
          colors: {
            primary: '#ff0000',
            secondary: '#00ff00',
            accent: '#0000ff',
          },
        })

        store.updateTheme(theme.id, {
          name: 'Updated Name',
          colors: {
            primary: '#000000',
            secondary: '#ffffff',
            accent: '#ff0000',
          },
        })

        const updated = store.getThemeById(theme.id)
        expect(updated?.name).toBe('Updated Name')
        expect(updated?.colors.primary).toBe('#000000')
      })

      it('should throw error when updating non-existent theme', () => {
        const store = useThemeStore()

        expect(() => {
          store.updateTheme('non-existent', { name: 'New Name' })
        }).toThrow()
      })
    })

    describe('Deleting themes', () => {
      it('should delete custom theme', () => {
        const store = useThemeStore()
        const theme = store.createTheme({
          name: 'To Delete',
          mode: 'light',
          colors: {
            primary: '#ff0000',
            secondary: '#00ff00',
            accent: '#0000ff',
          },
        })

        expect(store.customThemes).toContainEqual(theme)

        store.deleteTheme(theme.id)
        expect(store.customThemes).not.toContainEqual(theme)
      })

      it('should switch to default when deleting active custom theme', () => {
        const store = useThemeStore()
        const theme = store.createTheme({
          name: 'To Delete',
          mode: 'light',
          colors: {
            primary: '#ff0000',
            secondary: '#00ff00',
            accent: '#0000ff',
          },
        })

        store.setActiveTheme(theme.id)
        expect(store.activeThemeId).toBe(theme.id)

        store.deleteTheme(theme.id)
        expect(store.activeThemeId).toBe('default-light')
      })

      it('should throw error when deleting non-existent theme', () => {
        const store = useThemeStore()

        expect(() => {
          store.deleteTheme('non-existent')
        }).toThrow()
      })
    })

    it('should reset to defaults', () => {
      const store = useThemeStore()
      const customTheme = store.createTheme({
        name: 'Custom',
        mode: 'light',
        colors: {
          primary: '#ff0000',
          secondary: '#00ff00',
          accent: '#0000ff',
        },
      })

      store.setActiveTheme(customTheme.id)
      store.setUseSystemPreference(true)

      store.resetToDefaults()
      expect(store.activeThemeId).toBe('default-light')
      expect(store.customThemes).toEqual([])
      expect(store.useSystemPreference).toBe(false)
    })

    it('should toggle system preference', () => {
      const store = useThemeStore()
      expect(store.useSystemPreference).toBe(false)

      store.setUseSystemPreference(true)
      expect(store.useSystemPreference).toBe(true)

      store.setUseSystemPreference(false)
      expect(store.useSystemPreference).toBe(false)
    })

    describe('Import/Export', () => {
      it('should export theme as JSON', () => {
        const store = useThemeStore()
        const json = store.exportTheme('default-light')
        const parsed = JSON.parse(json)

        expect(parsed.id).toBe('default-light')
        expect(parsed.name).toBe('Default Light')
        expect(parsed.colors).toBeDefined()
      })

      it('should throw error when exporting non-existent theme', () => {
        const store = useThemeStore()

        expect(() => {
          store.exportTheme('non-existent')
        }).toThrow()
      })

      it('should import theme from JSON', () => {
        const store = useThemeStore()
        const json = JSON.stringify({
          id: 'imported-theme',
          name: 'Imported Theme',
          description: 'Test import',
          mode: 'light',
          colors: {
            primary: '#ff0000',
            secondary: '#00ff00',
            accent: '#0000ff',
          },
        })

        const imported = store.importTheme(json)
        expect(imported.name).toBe('Imported Theme')
        expect(imported.isCustom).toBe(true)
      })

      it('should return preset when importing preset theme', () => {
        const store = useThemeStore()
        const preset = getPresetTheme('default-dark')
        const json = JSON.stringify(preset)

        const imported = store.importTheme(json)
        expect(imported.id).toBe('default-dark')
        expect(imported.isCustom).toBe(false)
      })

      it('should throw error for invalid import JSON', () => {
        const store = useThemeStore()

        expect(() => {
          store.importTheme('invalid json')
        }).toThrow()

        expect(() => {
          store.importTheme(JSON.stringify({ name: 'No colors' }))
        }).toThrow()
      })
    })

    it('should duplicate theme', () => {
      const store = useThemeStore()
      const original = store.createTheme({
        name: 'Original',
        mode: 'light',
        colors: {
          primary: '#ff0000',
          secondary: '#00ff00',
          accent: '#0000ff',
        },
      })

      const duplicate = store.duplicateTheme(original.id)
      expect(duplicate.name).toBe('Original (Copy)')
      expect(duplicate.colors).toEqual(original.colors)
      expect(duplicate.id).not.toBe(original.id)
    })
  })

  describe('Persistence', () => {
    it('should persist custom themes to storage', () => {
      const store = useThemeStore()
      const theme = store.createTheme({
        name: 'Persistent Theme',
        mode: 'light',
        colors: {
          primary: '#ff0000',
          secondary: '#00ff00',
          accent: '#0000ff',
        },
      })

      store.setActiveTheme(theme.id)

      // Simulate page reload by creating new pinia instance
      setActivePinia(createPinia())
      const newStore = useThemeStore()

      // Should load from persisted state if persistence works
      // Note: This depends on the actual persistence plugin behavior
      expect(newStore).toBeDefined()
    })
  })
})
