import type { Meta, StoryObj } from '@storybook/vue3'
import StatCard from './StatCard.vue'

const meta = {
  title: 'Components/Reading History/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Books Read',
    value: 42,
    icon: 'i-mdi:book-check',
    color: 'success',
  },
} satisfies Meta<typeof StatCard>

export default meta

type Story = StoryObj<typeof meta>

export const BooksRead: Story = {
  args: {
    label: 'Books Read',
    value: 42,
    icon: 'i-mdi:book-check',
    color: 'success',
  },
}

export const CurrentStreak: Story = {
  args: {
    label: 'Current Streak',
    value: '7 days',
    icon: 'i-mdi:fire',
    color: 'warning',
  },
}

export const LongestStreak: Story = {
  args: {
    label: 'Longest Streak',
    value: '30 days',
    icon: 'i-mdi:trophy',
    color: 'info',
  },
}

export const AveragePerMonth: Story = {
  args: {
    label: 'Avg/Month',
    value: '3.5',
    icon: 'i-mdi:chart-line',
    color: 'primary',
  },
}

export const ZeroValue: Story = {
  args: {
    label: 'Books Read',
    value: 0,
    icon: 'i-mdi:book-open',
    color: 'secondary',
  },
}
