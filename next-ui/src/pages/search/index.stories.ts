import type { Meta, StoryObj } from '@storybook/vue3'
import SearchPage from './index.vue'

const meta = {
  component: SearchPage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchPage>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  name: 'Empty State',
  args: {},
}

export const WithResults: Story = {
  name: 'With Results',
  args: {},
  parameters: {
    msw: {
      handlers: [
        // Mock series search results
        // Mock books search results
        // Mock authors search results
      ],
    },
  },
}

export const NoResults: Story = {
  name: 'No Results',
  args: {},
  parameters: {
    msw: {
      handlers: [
        // Mock empty results
      ],
    },
  },
}

export const WithFilters: Story = {
  name: 'With Filters Applied',
  args: {},
  parameters: {
    msw: {
      handlers: [
        // Mock filtered results
      ],
    },
  },
}

export const Loading: Story = {
  name: 'Loading State',
  args: {},
  parameters: {
    msw: {
      handlers: [
        // Mock with delay
      ],
    },
  },
}

export const Error: Story = {
  name: 'Error State',
  args: {},
  parameters: {
    msw: {
      handlers: [
        // Mock with error response
      ],
    },
  },
}
