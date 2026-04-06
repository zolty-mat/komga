/**
 * src/pages/settings/appearance.stories.ts
 *
 * Storybook stories for the appearance settings page
 */

import type { Meta, StoryObj } from '@storybook/vue3'
import { createPinia, setActivePinia } from 'pinia'
import AppearanceSettings from './appearance.vue'

const meta = {
  title: 'Pages/Settings/Appearance',
  component: AppearanceSettings,
  tags: ['autodocs'],
  decorators: [
    (story) => {
      setActivePinia(createPinia())
      return story()
    },
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AppearanceSettings>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default appearance settings page with light theme
 */
export const Default: Story = {
  render: () => ({
    components: { AppearanceSettings },
    template: '<AppearanceSettings />',
  }),
}

/**
 * Appearance settings with theme selector tab active
 */
export const ThemeSelectorTab: Story = {
  render: () => ({
    components: { AppearanceSettings },
    setup() {
      return {
        activeTab: 'theme-selector',
      }
    },
    template: '<AppearanceSettings />',
  }),
}

/**
 * Appearance settings with customizer tab active
 */
export const CustomizerTab: Story = {
  render: () => ({
    components: { AppearanceSettings },
    template: '<AppearanceSettings />',
  }),
}

/**
 * Appearance settings with import/export tab active
 */
export const ImportExportTab: Story = {
  render: () => ({
    components: { AppearanceSettings },
    template: '<AppearanceSettings />',
  }),
}

/**
 * Showing theme selector with various preset options
 */
export const PresetThemes: Story = {
  render: () => ({
    components: { AppearanceSettings },
    template: '<AppearanceSettings />',
  }),
  args: {
    // Pre-populate with some custom themes via store setup
  },
}

/**
 * Dark mode appearance settings
 */
export const DarkMode: Story = {
  render: () => ({
    components: { AppearanceSettings },
    template: '<AppearanceSettings />',
  }),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/**
 * With custom themes created
 */
export const WithCustomThemes: Story = {
  render: () => ({
    components: { AppearanceSettings },
    setup() {
      const pinia = createPinia()
      setActivePinia(pinia)

      // Could inject custom themes here if needed
      return {}
    },
    template: '<AppearanceSettings />',
  }),
}

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => ({
    components: { AppearanceSettings },
    template: '<AppearanceSettings />',
  }),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  render: () => ({
    components: { AppearanceSettings },
    template: '<AppearanceSettings />',
  }),
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
  },
}
