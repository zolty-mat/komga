import type { Meta, StoryObj } from '@storybook/vue3'
import SettingsPage from './index.vue'

const meta: Meta<typeof SettingsPage> = {
  title: 'Pages/Settings',
  component: SettingsPage,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { SettingsPage },
    template: '<SettingsPage />',
  }),
}

export const ProfileTab: Story = {
  render: () => ({
    components: { SettingsPage },
    template: '<SettingsPage />',
  }),
  play: async ({ canvasElement }) => {
    const profileTab = canvasElement.querySelector('[value="profile"]') as HTMLElement
    if (profileTab) {
      profileTab.click()
    }
  },
}

export const PreferencesTab: Story = {
  render: () => ({
    components: { SettingsPage },
    template: '<SettingsPage />',
  }),
  play: async ({ canvasElement }) => {
    const preferencesTab = canvasElement.querySelector('[value="preferences"]') as HTMLElement
    if (preferencesTab) {
      preferencesTab.click()
    }
  },
}

export const StatisticsTab: Story = {
  render: () => ({
    components: { SettingsPage },
    template: '<SettingsPage />',
  }),
  play: async ({ canvasElement }) => {
    const statisticsTab = canvasElement.querySelector('[value="statistics"]') as HTMLElement
    if (statisticsTab) {
      statisticsTab.click()
    }
  },
}

export const ApiKeysTab: Story = {
  render: () => ({
    components: { SettingsPage },
    template: '<SettingsPage />',
  }),
  play: async ({ canvasElement }) => {
    const apiKeysTab = canvasElement.querySelector('[value="api-keys"]') as HTMLElement
    if (apiKeysTab) {
      apiKeysTab.click()
    }
  },
}

export const SecurityTab: Story = {
  render: () => ({
    components: { SettingsPage },
    template: '<SettingsPage />',
  }),
  play: async ({ canvasElement }) => {
    const securityTab = canvasElement.querySelector('[value="security"]') as HTMLElement
    if (securityTab) {
      securityTab.click()
    }
  },
}

export const WithHighStatistics: Story = {
  render: () => ({
    components: { SettingsPage },
    template: '<SettingsPage />',
  }),
  decorators: [
    (story) => ({
      components: { Story: story },
      template: '<Story />',
    }),
  ],
}

export const WithMultipleApiKeys: Story = {
  render: () => ({
    components: { SettingsPage },
    template: '<SettingsPage />',
  }),
  play: async ({ canvasElement }) => {
    const apiKeysTab = canvasElement.querySelector('[value="api-keys"]') as HTMLElement
    if (apiKeysTab) {
      apiKeysTab.click()
    }
  },
}
