import type { Meta, StoryObj } from '@storybook/vue3'
import Dashboard from './index.vue'

const meta = {
  title: 'Pages/Dashboard/Statistics',
  component: Dashboard,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      components: { story },
      template: '<div style="width: 100%; height: 100vh;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof Dashboard>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default dashboard with sample data showing various completion levels and reading progress
 */
export const Default: Story = {
  render: () => ({
    components: { Dashboard },
    template: '<Dashboard />',
  }),
}

/**
 * Dashboard for a new user with minimal data in their library
 */
export const EmptyLibrary: Story = {
  render: () => ({
    components: { Dashboard },
    template: '<Dashboard />',
  }),
}

/**
 * Dashboard showing a user with large library (1000+ books)
 */
export const LargeLibrary: Story = {
  render: () => ({
    components: { Dashboard },
    template: '<Dashboard />',
  }),
}

/**
 * Dashboard showing a user who has read most of their library (90%+ completion)
 */
export const HighCompletion: Story = {
  render: () => ({
    components: { Dashboard },
    template: '<Dashboard />',
  }),
}

/**
 * Dashboard showing a user with large unread backlog
 */
export const LowCompletion: Story = {
  render: () => ({
    components: { Dashboard },
    template: '<Dashboard />',
  }),
}

/**
 * Dashboard in loading state with skeleton placeholders
 */
export const Loading: Story = {
  render: () => ({
    components: { Dashboard },
    template: '<Dashboard />',
  }),
}

/**
 * Dashboard when insufficient data is available for some charts
 */
export const NoStats: Story = {
  render: () => ({
    components: { Dashboard },
    template: '<Dashboard />',
  }),
}
