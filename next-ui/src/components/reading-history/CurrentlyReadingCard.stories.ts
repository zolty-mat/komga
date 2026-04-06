import type { Meta, StoryObj } from '@storybook/vue3'
import CurrentlyReadingCard from './CurrentlyReadingCard.vue'

const meta = {
  title: 'Components/Reading History/CurrentlyReadingCard',
  component: CurrentlyReadingCard,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CurrentlyReadingCard>

export default meta

type Story = StoryObj<typeof meta>

const mockSeries = {
  id: 'series-1',
  metadata: {
    title: 'The Stormlight Archive: Words of Radiance',
    description: 'An epic fantasy series',
  },
  seriesTitle: 'The Stormlight Archive',
  booksCount: 5,
  readProgress: {
    page: 3,
    completed: false,
    created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deviceId: 'device-1',
    deviceName: 'Web Reader',
  },
}

const mockSeriesCompleted = {
  ...mockSeries,
  readProgress: {
    ...mockSeries.readProgress,
    page: 5,
    completed: true,
  },
}

const mockSeriesJustStarted = {
  ...mockSeries,
  readProgress: {
    ...mockSeries.readProgress,
    page: 1,
    created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
}

const mockSeriesAlmostDone = {
  ...mockSeries,
  readProgress: {
    ...mockSeries.readProgress,
    page: 4,
  },
}

export const Default: Story = {
  args: {
    series: mockSeries,
  },
}

export const Completed: Story = {
  args: {
    series: mockSeriesCompleted,
  },
}

export const JustStarted: Story = {
  args: {
    series: mockSeriesJustStarted,
  },
}

export const AlmostDone: Story = {
  args: {
    series: mockSeriesAlmostDone,
  },
}

export const LongTitle: Story = {
  args: {
    series: {
      ...mockSeries,
      metadata: {
        title: 'This Is An Extremely Long Title That Might Wrap To Multiple Lines When Displayed In A Card Component',
      },
    },
  },
}

export const NoProgress: Story = {
  args: {
    series: {
      ...mockSeries,
      readProgress: {
        ...mockSeries.readProgress,
        page: 0,
      },
    },
  },
}
