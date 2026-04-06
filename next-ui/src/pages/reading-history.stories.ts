import type { Meta, StoryObj } from '@storybook/vue3'
import ReadingHistory from './reading-history.vue'

const meta = {
  title: 'Pages/Reading History',
  component: ReadingHistory,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => ({
      components: { story },
      template: '<v-app><story /></v-app>',
    }),
  ],
} satisfies Meta<typeof ReadingHistory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'With Reading History',
  render: () => ({
    components: { ReadingHistory },
    template: `
      <v-container fluid class="pa-4">
        <reading-history />
      </v-container>
    `,
  }),
}

export const ActiveReader: Story = {
  name: 'Active Reader (High Stats)',
  parameters: {
    msw: {
      handlers: [
        // Override default handlers for active reader scenario
      ],
    },
  },
  render: () => ({
    components: { ReadingHistory },
    template: `
      <v-container fluid class="pa-4">
        <reading-history />
      </v-container>
    `,
  }),
}

export const NoHistory: Story = {
  name: 'No Reading History',
  render: () => ({
    components: { ReadingHistory },
    template: `
      <v-container fluid class="pa-4">
        <div class="text-center py-8">
          <v-icon
            icon="i-mdi:book-open"
            size="48"
            opacity="0.3"
            class="mb-4 d-block"
          />
          <p>Start reading to see your timeline</p>
        </div>
      </v-container>
    `,
  }),
}

export const WithCurrentlyReading: Story = {
  name: 'With Currently Reading Books',
  render: () => ({
    components: { ReadingHistory },
    template: `
      <v-container fluid class="pa-4">
        <reading-history />
      </v-container>
    `,
  }),
}

export const WithStreak: Story = {
  name: 'With Active Reading Streak',
  render: () => ({
    components: { ReadingHistory },
    template: `
      <v-container fluid class="pa-4">
        <reading-history />
      </v-container>
    `,
  }),
}

export const MobileView: Story = {
  name: 'Mobile Layout',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => ({
    components: { ReadingHistory },
    template: `
      <v-container fluid class="pa-2">
        <reading-history />
      </v-container>
    `,
  }),
}

export const TabletView: Story = {
  name: 'Tablet Layout',
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => ({
    components: { ReadingHistory },
    template: `
      <v-container fluid class="pa-3">
        <reading-history />
      </v-container>
    `,
  }),
}

export const LoadingState: Story = {
  name: 'Loading State',
  render: () => ({
    template: `
      <v-container fluid class="pa-4">
        <v-row class="mb-6">
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-skeleton-loader type="heading" width="200" />
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mb-6 ga-4">
          <v-col v-for="i in 4" :key="i" cols="12" sm="6" md="3">
            <v-skeleton-loader type="card" height="120" />
          </v-col>
        </v-row>

        <v-row class="mb-6">
          <v-col cols="12">
            <v-skeleton-loader type="heading,image,paragraph" />
          </v-col>
        </v-row>
      </v-container>
    `,
  }),
}
