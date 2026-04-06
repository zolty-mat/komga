import type { Meta, StoryObj } from '@storybook/vue3-vite'
import bookDetail from './[bookId].vue'
import { http, delay } from 'msw'
import { response404NotFound } from '@/mocks/api/handlers'
import { mockBook, mockBooks } from '@/mocks/api/handlers/books'
import { mockPage } from '@/mocks/api/pageable'
import { PageRequest } from '@/types/PageRequest'
import { httpTyped } from '@/mocks/api/httpTyped'

const meta = {
  component: bookDetail,
  render: (args: object) => ({
    components: { bookDetail },
    setup() {
      return { args }
    },
    template: '<book-detail />',
  }),
  parameters: {
    router: {
      location: '/media/books/05RKH8CC8B4RW',
    },
  },
  args: {},
} satisfies Meta<typeof bookDetail>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        httpTyped.get('/api/v1/books/{bookId}', ({ params, response }) =>
          response(200).json({
            ...mockBook,
            metadata: {
              ...mockBook.metadata,
              title: 'Super Duck 001',
              summary: 'A classic comic book featuring the adventures of Super Duck.',
              authors: [{ name: 'MLJ Comics', role: 'Publisher' }],
              tags: ['Comics', 'Classic', 'Action'],
              releaseDate: '1944-05-10',
            },
          }),
        ),
        httpTyped.post('/api/v1/books/list', ({ response }) =>
          response(200).json(mockPage(mockBooks(5), new PageRequest(0, 100, []))),
        ),
      ],
    },
  },
}

export const PartiallyRead: Story = {
  parameters: {
    msw: {
      handlers: [
        httpTyped.get('/api/v1/books/{bookId}', ({ params, response }) =>
          response(200).json({
            ...mockBook,
            metadata: {
              ...mockBook.metadata,
              title: 'Amazing Spider-Man 001',
              summary: 'The first appearance of Spider-Man in the comics.',
              authors: [
                { name: 'Stan Lee', role: 'Writer' },
                { name: 'Steve Ditko', role: 'Artist' },
              ],
              tags: ['Comics', 'Marvel', 'Superhero'],
            },
            readProgress: {
              page: 25,
              completed: false,
              readDate: new Date('2025-02-19T11:29:25Z'),
              created: new Date('2025-02-19T11:29:25Z'),
              lastModified: new Date('2025-02-19T11:29:25Z'),
              deviceId: '',
              deviceName: '',
            },
          }),
        ),
        httpTyped.post('/api/v1/books/list', ({ response }) =>
          response(200).json(mockPage(mockBooks(5), new PageRequest(0, 100, []))),
        ),
      ],
    },
  },
}

export const NotRead: Story = {
  parameters: {
    msw: {
      handlers: [
        httpTyped.get('/api/v1/books/{bookId}', ({ params, response }) =>
          response(200).json({
            ...mockBook,
            metadata: {
              ...mockBook.metadata,
              title: 'The Incredible Hulk 001',
              summary: 'The origin story of the mighty Hulk.',
              authors: [
                { name: 'Stan Lee', role: 'Writer' },
                { name: 'Jack Kirby', role: 'Artist' },
              ],
              tags: ['Comics', 'Marvel', 'Action'],
            },
            readProgress: undefined,
          }),
        ),
        httpTyped.post('/api/v1/books/list', ({ response }) =>
          response(200).json(mockPage(mockBooks(5), new PageRequest(0, 100, []))),
        ),
      ],
    },
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [http.all('*/api/*', async () => await delay(5_000))],
    },
  },
}

export const NotFound: Story = {
  parameters: {
    router: {
      location: '/media/books/404',
    },
    msw: {
      handlers: [httpTyped.get('/api/v1/books/{bookId}', ({ response }) => response(404).empty())],
    },
  },
}
