/**
 * src/stores/theme.ts
 *
 * Pinia store for managing theme state and operations
 */

import { defineStore } from 'pinia'
import type { ThemeConfig } from '@/utils/theme'
import {
  getPresetThemes,
  getPresetTheme,
  getSystemThemePreference,
  isValidThemeConfig,
} from '@/utils/theme'

interface ThemeState {
  // Current active theme ID
  activeThemeId: string
  // Custom themes created by user
  customThemes: ThemeConfig[]
  // Whether to follow system preference
  useSystemPreference: boolean
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    activeThemeId: 'default-light',
    customThemes: [],
    useSystemPreference: false,
  }),

  getters: {
    /**
     * Get all available themes (presets + custom)
     */
    allThemes: (state) => {
      return [...getPresetThemes(), ...state.customThemes]
    },

    /**
     * Get the currently active theme
     */
    activeTheme: (state) => {
      const theme =
        getPresetTheme(state.activeThemeId) ||
        state.customThemes.find((t) => t.id === state.activeThemeId)

      return theme || getPresetTheme('default-light')!
    },

    /**
     * Get preset themes only
     */
    presetThemes: () => {
      return getPresetThemes()
    },

    /**
     * Check if active theme is a custom theme
     */
    isCustomTheme: (state) => {
      return !getPresetTheme(state.activeThemeId)
    },

    /**
     * Get available themes for current mode
     */
    themesByMode: (state) => (mode: 'light' | 'dark') => {
      return state.allThemes.filter((t) => t.mode === mode)
    },
  },

  actions: {
    /**
     * Set the active theme
     */
    setActiveTheme(themeId: string) {
      const theme =
        getPresetTheme(themeId) || this.customThemes.find((t) => t.id === themeId)

      if (theme) {
        this.activeThemeId = themeId
      }
    },

    /**
     * Get theme by ID
     */
    getThemeById(id: string): ThemeConfig | undefined {
      return getPresetTheme(id) || this.customThemes.find((t) => t.id === id)
    },

    /**
     * Create a new custom theme
     */
    createTheme(config: Omit<ThemeConfig, 'id' | 'isCustom' | 'createdAt'>) {
      if (!isValidThemeConfig(config)) {
        throw new Error('Invalid theme configuration')
      }

      // Generate unique ID using crypto API if available, otherwise use timestamp + random
      let uniqueId: string
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        uniqueId = `custom-${crypto.randomUUID()}`
      } else {
        uniqueId = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      }

      const theme: ThemeConfig = {
        ...config,
        id: uniqueId,
        isCustom: true,
        createdAt: Date.now(),
      }

      this.customThemes.push(theme)
      return theme
    },

    /**
     * Update an existing custom theme
     */
    updateTheme(id: string, updates: Partial<ThemeConfig>) {
      const theme = this.customThemes.find((t) => t.id === id)
      if (!theme) {
        throw new Error(`Theme with id ${id} not found`)
      }

      if (updates.name) theme.name = updates.name
      if (updates.description) theme.description = updates.description
      if (updates.colors) theme.colors = { ...theme.colors, ...updates.colors }
      if (updates.typography) theme.typography = { ...theme.typography, ...updates.typography }
      if (updates.spacing) theme.spacing = { ...theme.spacing, ...updates.spacing }
    },

    /**
     * Delete a custom theme
     */
    deleteTheme(id: string) {
      const index = this.customThemes.findIndex((t) => t.id === id)
      if (index === -1) {
        throw new Error(`Theme with id ${id} not found`)
      }

      // If active theme is being deleted, switch to default light
      if (this.activeThemeId === id) {
        this.activeThemeId = 'default-light'
      }

      this.customThemes.splice(index, 1)
    },

    /**
     * Reset to factory defaults
     */
    resetToDefaults() {
      this.activeThemeId = 'default-light'
      this.customThemes = []
      this.useSystemPreference = false
    },

    /**
     * Toggle system preference mode
     */
    setUseSystemPreference(use: boolean) {
      this.useSystemPreference = use
      if (use) {
        const systemPref = getSystemThemePreference()
        const themesByMode = this.themesByMode(systemPref)
        if (themesByMode.length > 0) {
          this.activeThemeId = themesByMode[0].id
        }
      }
    },

    /**
     * Export theme as JSON
     */
    exportTheme(id: string): string {
      const theme = this.getThemeById(id)
      if (!theme) {
        throw new Error(`Theme with id ${id} not found`)
      }

      return JSON.stringify(theme, null, 2)
    },

    /**
     * Import theme from JSON
     */
    importTheme(jsonString: string): ThemeConfig {
      try {
        const imported = JSON.parse(jsonString) as Partial<ThemeConfig>

        if (!isValidThemeConfig(imported)) {
          throw new Error('Invalid theme configuration in import')
        }

        // If it's a preset, just activate it
        const preset = getPresetTheme(imported.id!)
        if (preset) {
          return preset
        }

        // Otherwise create as custom theme
        return this.createTheme({
          name: imported.name || 'Imported Theme',
          description: imported.description,
          mode: imported.mode || 'light',
          colors: imported.colors!,
          typography: imported.typography,
          spacing: imported.spacing,
        })
      } catch (error) {
        throw new Error(`Failed to import theme: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },

    /**
     * Duplicate a theme
     */
    duplicateTheme(id: string): ThemeConfig {
      const theme = this.getThemeById(id)
      if (!theme) {
        throw new Error(`Theme with id ${id} not found`)
      }

      // Add a small delay to ensure unique timestamp-based ID
      const duplicate = this.createTheme({
        name: `${theme.name} (Copy)`,
        description: theme.description,
        mode: theme.mode,
        colors: { ...theme.colors },
        typography: theme.typography ? { ...theme.typography } : undefined,
        spacing: theme.spacing ? { ...theme.spacing } : undefined,
      })

      return duplicate
    },
  },

  persist: {
    key: 'komga.nextui.theme',
    pick: ['activeThemeId', 'customThemes', 'useSystemPreference'],
  },
})
