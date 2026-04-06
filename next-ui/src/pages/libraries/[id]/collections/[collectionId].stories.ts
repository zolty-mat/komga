import type { Meta, StoryObj } from '@storybook/vue3'
import { http } from 'msw'
import CollectionDetailPage from './[collectionId].vue'

const meta: Meta<typeof CollectionDetailPage> = {
  component: CollectionDetailPage,
  tags: ['autodocs'],
  decorators: [],
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        http.get('*/api/v1/collections/:collectionId', ({ params }) => {
          const collections: Record<string, any> = {
            '026801S4HWRZA': {
              id: '026801S4HWRZA',
              name: 'Golden Age',
              ordered: true,
              seriesIds: ['57', '58'],
              createdDate: new Date('2020-08-06T06:13:25Z'),
              lastModifiedDate: new Date('2020-08-06T06:17:12Z'),
              filtered: false,
            },
            'empty': {
              id: 'empty',
              name: 'Empty Collection',
              ordered: false,
              seriesIds: [],
              createdDate: new Date('2023-01-01T00:00:00Z'),
              lastModifiedDate: new Date('2023-01-01T00:00:00Z'),
              filtered: false,
            },
            'large': {
              id: 'large',
              name: 'Large Collection',
              ordered: true,
              seriesIds: Array.from({ length: 50 }, (_, i) => `series-${i}`),
              createdDate: new Date('2021-06-15T12:30:00Z'),
              lastModifiedDate: new Date('2024-01-20T08:45:00Z'),
              filtered: false,
            },
            'notfound': null,
          }

          const collection = collections[params.collectionId as string]
          if (!collection) {
            return new Response(null, { status: 404 })
          }
          return new Response(JSON.stringify(collection), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }),

        http.get('*/api/v1/collections/:collectionId/series', ({ params }) => {
          const page = 0
          const size = 20

          const seriesByCollection: Record<string, any[]> = {
            '026801S4HWRZA': [
              {
                id: '57',
                name: 'Golden Comics',
                booksCount: 10,
                metadata: { title: 'Golden Comics' },
              },
              {
                id: '58',
                name: 'Classic Tales',
                booksCount: 5,
                metadata: { title: 'Classic Tales' },
              },
            ],
            'empty': [],
            'large': Array.from({ length: 55 }, (_, i) => ({
              id: `series-${i}`,
              name: `Series ${i + 1}`,
              booksCount: Math.floor(Math.random() * 20) + 1,
              metadata: { title: `Series ${i + 1}` },
            })),
          }

          const seriesList = seriesByCollection[params.collectionId as string] || []
          const paginatedSeries = seriesList.slice(page * size, (page + 1) * size)

          return new Response(
            JSON.stringify({
              content: paginatedSeries,
              number: page,
              size: size,
              numberOfElements: paginatedSeries.length,
              totalElements: seriesList.length,
              totalPages: Math.ceil(seriesList.length / size),
              first: page === 0,
              last: page === Math.ceil(seriesList.length / size) - 1,
              empty: paginatedSeries.length === 0,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }),

        http.patch('*/api/v1/collections/:collectionId', async ({ params, request }) => {
          const body = await request.json() as Record<string, any>
          return new Response(
            JSON.stringify({
              id: params.collectionId,
              ...body,
              lastModifiedDate: new Date(),
            }),
            {
              status: 204,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }),

        http.delete('*/api/v1/collections/:collectionId', ({ params }) => {
          if (params.collectionId === 'notfound') {
            return new Response(null, { status: 404 })
          }
          return new Response(null, { status: 204 })
        }),
      ],
    },
  },
}

export default meta

type Story = StoryObj<typeof CollectionDetailPage>

export const Default: Story = {
  parameters: {
    route: {
      params: {
        id: '1',
        collectionId: '026801S4HWRZA',
      },
    },
  },
}

export const Empty: Story = {
  parameters: {
    route: {
      params: {
        id: '1',
        collectionId: 'empty',
      },
    },
  },
}

export const ManySeries: Story = {
  parameters: {
    route: {
      params: {
        id: '1',
        collectionId: 'large',
      },
    },
  },
}

export const NotFound: Story = {
  parameters: {
    route: {
      params: {
        id: '1',
        collectionId: 'notfound',
      },
    },
  },
}
