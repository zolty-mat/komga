import type { Meta, StoryObj } from '@storybook/vue3'
import ReadingTimeline from './ReadingTimeline.vue'

const meta = {
  title: 'Components/Reading History/ReadingTimeline',
  component: ReadingTimeline,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ReadingTimeline>

export default meta

type Story = StoryObj<typeof meta>

const generateMockHistory = (count: number) => ({
  content: Array.from({ length: count }, (_, i) => ({
    id: `series-${i}`,
    metadata: {
      title: `Book ${i + 1}: Amazing Title Here`,
      description: `A great read #${i + 1}`,
    },
    seriesTitle: `Series ${Math.floor(i / 3) + 1}`,
    booksCount: 10,
    readProgress: {
      page: 10,
      completed: i % 3 !== 0, // Some not completed
      created: new Date(Date.now() - (i + 10) * 24 * 60 * 60 * 1000).toISOString(),
      lastModified: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      deviceId: 'device-1',
      deviceName: 'Web Reader',
    },
  })),
  totalElements: count,
})

export const Default: Story = {
  args: {
    readingHistory: generateMockHistory(10),
    isLoading: false,
  },
}

export const LargeHistory: Story = {
  args: {
    readingHistory: generateMockHistory(50),
    isLoading: false,
  },
}

export const Empty: Story = {
  args: {
    readingHistory: {
      content: [],
      totalElements: 0,
    },
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    readingHistory: {
      content: [],
      totalElements: 0,
    },
    isLoading: true,
  },
}

export const SingleBook: Story = {
  args: {
    readingHistory: generateMockHistory(1),
    isLoading: false,
  },
}

export const WithManyBooks: Story = {
  args: {
    readingHistory: generateMockHistory(100),
    isLoading: false,
  },
}

export const FilteredBySearch: Story = {
  args: {
    readingHistory: generateMockHistory(20),
    isLoading: false,
  },
  render: (args) => ({
    components: { ReadingTimeline },
    setup() {
      return { args }
    },
    template: `
      <div class="pa-4">
        <p class="mb-4 text-caption">Search is pre-filtered to 'Book 1' books</p>
        <reading-timeline v-bind="args" />
      </div>
    `,
  }),
}
