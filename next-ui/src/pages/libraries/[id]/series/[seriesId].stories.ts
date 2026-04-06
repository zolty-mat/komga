import type { Meta, StoryObj } from '@storybook/vue3-vite'
import seriesDetail from './[seriesId].vue'
import { http, delay } from 'msw'
import { response404NotFound } from '@/mocks/api/handlers'
import { mockSeries1 } from '@/mocks/api/handlers/series'
import { mockBooks } from '@/mocks/api/handlers/books'
import { mockPage } from '@/mocks/api/pageable'
import { PageRequest } from '@/types/PageRequest'
import { httpTyped } from '@/mocks/api/httpTyped'

const meta = {
  component: seriesDetail,
  render: (args: object) => ({
    components: { seriesDetail },
    setup() {
      return { args }
    },
    template: '<series-detail />',
  }),
  parameters: {
    router: {
      location: '/libraries/1/series/57',
    },
  },
  args: {},
} satisfies Meta<typeof seriesDetail>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        httpTyped.get('/api/v1/series/{seriesId}', ({ response }) =>
          response(200).json(mockSeries1)
        ),
        httpTyped.post('/api/v1/books/list', ({ response }) =>
          response(200).json(
            mockPage(
              mockBooks(5),
              new PageRequest(0, 20, [])
            )
          )
        ),
      ],
    },
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.all('*/api/*', async () => await delay(5_000)),
      ],
    },
  },
}

export const NotFound: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/v1/series/*', response404NotFound),
      ],
    },
  },
}

export const NoBooks: Story = {
  parameters: {
    msw: {
      handlers: [
        httpTyped.get('/api/v1/series/{seriesId}', ({ response }) =>
          response(200).json({
            ...mockSeries1,
            booksCount: 0,
            booksReadCount: 0,
            booksUnreadCount: 0,
            booksInProgressCount: 0,
          })
        ),
        httpTyped.post('/api/v1/books/list', ({ response }) =>
          response(200).json(
            mockPage(
              [],
              new PageRequest(0, 20, [])
            )
          )
        ),
      ],
    },
  },
}

export const PartiallyRead: Story = {
  parameters: {
    msw: {
      handlers: [
        httpTyped.get('/api/v1/series/{seriesId}', ({ response }) =>
          response(200).json({
            ...mockSeries1,
            booksReadCount: 2,
            booksUnreadCount: 2,
            booksInProgressCount: 1,
          })
        ),
        httpTyped.post('/api/v1/books/list', ({ response }) =>
          response(200).json(
            mockPage(
              mockBooks(5),
              new PageRequest(0, 20, [])
            )
          )
        ),
      ],
    },
  },
}
