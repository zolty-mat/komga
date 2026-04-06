import type { Meta, StoryObj } from '@storybook/vue3'
import ReadingStatsChart from './ReadingStatsChart.vue'

const meta = {
  title: 'Components/Reading History/ReadingStatsChart',
  component: ReadingStatsChart,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ReadingStatsChart>

export default meta

type Story = StoryObj<typeof meta>

const mockMonthlyStats = [
  { month: '2024-01', count: 2 },
  { month: '2024-02', count: 3 },
  { month: '2024-03', count: 5 },
  { month: '2024-04', count: 4 },
  { month: '2024-05', count: 6 },
  { month: '2024-06', count: 8 },
  { month: '2024-07', count: 7 },
  { month: '2024-08', count: 5 },
  { month: '2024-09', count: 9 },
  { month: '2024-10', count: 6 },
  { month: '2024-11', count: 7 },
  { month: '2024-12', count: 4 },
]

const mockYearlyStats = [
  { year: 2022, count: 24 },
  { year: 2023, count: 42 },
  { year: 2024, count: 66 },
]

export const Default: Story = {
  args: {
    monthlyStats: mockMonthlyStats,
    yearlyStats: mockYearlyStats,
  },
}

export const LowActivity: Story = {
  args: {
    monthlyStats: [
      { month: '2024-10', count: 1 },
      { month: '2024-11', count: 0 },
      { month: '2024-12', count: 2 },
    ],
    yearlyStats: [{ year: 2024, count: 3 }],
  },
}

export const HighActivity: Story = {
  args: {
    monthlyStats: [
      { month: '2024-01', count: 15 },
      { month: '2024-02', count: 18 },
      { month: '2024-03', count: 22 },
      { month: '2024-04', count: 20 },
      { month: '2024-05', count: 25 },
      { month: '2024-06', count: 28 },
    ],
    yearlyStats: [
      { year: 2023, count: 100 },
      { year: 2024, count: 128 },
    ],
  },
}

export const SingleMonth: Story = {
  args: {
    monthlyStats: [{ month: '2024-12', count: 5 }],
    yearlyStats: [{ year: 2024, count: 5 }],
  },
}

export const Empty: Story = {
  args: {
    monthlyStats: [],
    yearlyStats: [],
  },
}
