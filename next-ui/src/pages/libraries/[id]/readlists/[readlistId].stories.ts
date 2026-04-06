import type { Meta, StoryObj } from '@storybook/vue3'
import { http } from 'msw'
import ReadlistDetailPage from './[readlistId].vue'

const meta: Meta<typeof ReadlistDetailPage> = {
  component: ReadlistDetailPage,
  tags: ['autodocs'],
  decorators: [],
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        http.get('*/api/v1/readlists/:readlistId', ({ params }) => {
          const readlists: Record<string, any> = {
            '02AQZYKBS00J8': {
              id: '02AQZYKBS00J8',
              name: 'Readlist example',
              summary: 'An example read list to show off how it works in Komga.',
              ordered: true,
              bookIds: ['BOOK1', 'BOOK2', 'BOOK3'],
              createdDate: new Date('2020-08-20T05:45:38Z'),
              lastModifiedDate: new Date('2021-08-09T08:42:38Z'),
              filtered: false,
            },
            'empty': {
              id: 'empty',
              name: 'Empty Readlist',
              summary: 'A reading list with no books',
              ordered: false,
              bookIds: [],
              createdDate: new Date('2023-01-01T00:00:00Z'),
              lastModifiedDate: new Date('2023-01-01T00:00:00Z'),
              filtered: false,
            },
            'large': {
              id: 'large',
              name: 'Large Reading List',
              summary: 'A comprehensive collection of books for a long reading journey',
              ordered: true,
              bookIds: Array.from({ length: 50 }, (_, i) => `BOOK${i}`),
              createdDate: new Date('2021-06-15T12:30:00Z'),
              lastModifiedDate: new Date('2024-01-20T08:45:00Z'),
              filtered: false,
            },
            'notfound': null,
          }

          const readlist = readlists[params.readlistId as string]
          if (!readlist) {
            return new Response(null, { status: 404 })
          }
          return new Response(JSON.stringify(readlist), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }),

        http.get('*/api/v1/readlists/:readlistId/books', ({ params }) => {
          const booksByReadlist: Record<string, any[]> = {
            '02AQZYKBS00J8': [
              {
                id: 'BOOK1',
                name: 'Book One',
                number: '1',
                seriesId: 'series1',
                seriesTitle: 'Sample Series',
                metadata: { title: 'Book One' },
              },
              {
                id: 'BOOK2',
                name: 'Book Two',
                number: '2',
                seriesId: 'series1',
                seriesTitle: 'Sample Series',
                metadata: { title: 'Book Two' },
              },
              {
                id: 'BOOK3',
                name: 'Book Three',
                number: '3',
                seriesId: 'series2',
                seriesTitle: 'Another Series',
                metadata: { title: 'Book Three' },
              },
            ],
            'empty': [],
            'large': Array.from({ length: 50 }, (_, i) => ({
              id: `BOOK${i}`,
              name: `Book ${i + 1}`,
              number: `${i + 1}`,
              seriesId: `series${Math.floor(i / 10)}`,
              seriesTitle: `Series ${Math.floor(i / 10) + 1}`,
              metadata: { title: `Book ${i + 1}` },
            })),
          }

          const books = booksByReadlist[params.readlistId as string] || []
          return new Response(
            JSON.stringify({
              content: books,
              totalElements: books.length,
              totalPages: 1,
              number: 0,
              size: 20,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }),
      ],
    },
  },
}

export default meta
type Story = StoryObj<typeof ReadlistDetailPage>

export const Default: Story = {
  parameters: {
    route: {
      params: { id: 'library1', readlistId: '02AQZYKBS00J8' },
    },
  },
}

export const Empty: Story = {
  parameters: {
    route: {
      params: { id: 'library1', readlistId: 'empty' },
    },
  },
}

export const Large: Story = {
  parameters: {
    route: {
      params: { id: 'library1', readlistId: 'large' },
    },
  },
}

export const NotFound: Story = {
  parameters: {
    route: {
      params: { id: 'library1', readlistId: 'notfound' },
    },
    msw: {
      handlers: [
        http.get('*/api/v1/readlists/:readlistId', () => {
          return new Response(null, { status: 404 })
        }),
      ],
    },
  },
}
