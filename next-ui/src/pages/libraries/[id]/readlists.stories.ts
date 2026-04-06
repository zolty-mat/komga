import type { Meta, StoryObj } from '@storybook/vue3'
import { http } from 'msw'
import ReadlistsPage from './readlists.vue'

const meta: Meta<typeof ReadlistsPage> = {
  component: ReadlistsPage,
  tags: ['autodocs'],
  decorators: [],
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        http.get('*/api/v1/readlists', ({ request }) => {
          const url = new URL(request.url)
          const search = url.searchParams.get('search')

          const allReadlists = [
            {
              id: '02AQZYKBS00J8',
              name: 'Readlist example',
              summary: 'An example read list to show off how it works in Komga.',
              ordered: true,
              bookIds: ['BOOK1', 'BOOK2'],
              createdDate: new Date('2020-08-20T05:45:38Z'),
              lastModifiedDate: new Date('2021-08-09T08:42:38Z'),
              filtered: false,
            },
            {
              id: '02AQZYKBS00J9',
              name: 'Elfes',
              summary: 'Elfes readlist',
              ordered: false,
              bookIds: ['BOOK3', 'BOOK4'],
              createdDate: new Date('2020-08-20T05:45:38Z'),
              lastModifiedDate: new Date('2021-08-09T08:42:38Z'),
              filtered: false,
            },
            {
              id: '02AQZYKBS00JA',
              name: 'Science Fiction Anthology',
              summary: 'A collection of classic sci-fi short stories and novels',
              ordered: true,
              bookIds: Array.from({ length: 15 }, (_, i) => `BOOK${i + 5}`),
              createdDate: new Date('2022-01-15T10:20:00Z'),
              lastModifiedDate: new Date('2024-02-01T14:30:00Z'),
              filtered: false,
            },
          ]

          const filtered = search
            ? allReadlists.filter((rl) =>
                rl.name.toLowerCase().includes(search.toLowerCase()),
              )
            : allReadlists

          return new Response(
            JSON.stringify({
              content: filtered,
              totalElements: filtered.length,
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
type Story = StoryObj<typeof ReadlistsPage>

export const Default: Story = {
  parameters: {
    route: {
      params: { id: 'library1' },
    },
  },
}

export const Empty: Story = {
  parameters: {
    route: {
      params: { id: 'library1' },
    },
    msw: {
      handlers: [
        http.get('*/api/v1/readlists', () => {
          return new Response(
            JSON.stringify({
              content: [],
              totalElements: 0,
              totalPages: 0,
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

export const WithSearch: Story = {
  parameters: {
    route: {
      params: { id: 'library1' },
    },
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[placeholder*="Search"]') as HTMLInputElement
    if (input) {
      input.value = 'Elfes'
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  },
}

export const ManyReadlists: Story = {
  parameters: {
    route: {
      params: { id: 'library1' },
    },
    msw: {
      handlers: [
        http.get('*/api/v1/readlists', () => {
          const readlists = Array.from({ length: 20 }, (_, i) => ({
            id: `readlist-${i}`,
            name: `Reading List ${i + 1}`,
            summary: `Description for reading list ${i + 1}`,
            ordered: i % 2 === 0,
            bookIds: Array.from({ length: Math.floor(Math.random() * 20) + 1 }, (_, j) => `BOOK${j}`),
            createdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            lastModifiedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            filtered: false,
          }))

          return new Response(
            JSON.stringify({
              content: readlists,
              totalElements: readlists.length,
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

export const Loading: Story = {
  parameters: {
    route: {
      params: { id: 'library1' },
    },
    msw: {
      handlers: [
        http.get('*/api/v1/readlists', () => {
          return new Promise((resolve) =>
            setTimeout(
              () =>
                resolve(
                  new Response(
                    JSON.stringify({ content: [], totalElements: 0, totalPages: 0 }),
                    {
                      status: 200,
                      headers: { 'Content-Type': 'application/json' },
                    },
                  ),
                ),
              5000,
            ),
          )
        }),
      ],
    },
  },
}
