import { httpTyped } from '@/mocks/api/httpTyped'
import { mockPage } from '@/mocks/api/pageable'
import { PageRequest } from '@/types/PageRequest'

export const matchCbl = {
  readListMatch: { name: "Jupiter's Legacy", errorCode: '' },
  requests: [
    {
      request: { series: ['Space Adventures (2018)', 'Space Adventures'], number: '1' },
      matches: [
        {
          series: {
            seriesId: '63',
            title: 'Space Adventures',
            releaseDate: '2018-07-10',
          },
          books: [{ bookId: '0F99E5W723ENS', number: '1', title: 'Volume 1' }],
        },
      ],
    },
    {
      request: { series: ["Jupiter's Legacy (2013)", "Jupiter's Legacy"], number: '2' },
      matches: [
        {
          series: {
            seriesId: '63',
            title: 'Space Adventures',
            releaseDate: '2018-07-10',
          },
          books: [{ bookId: '0F99E5W723ENS', number: '1', title: 'Volume 1' }],
        },
      ],
    },
    {
      request: { series: ["Jupiter's Legacy (2013)", "Jupiter's Legacy"], number: '3' },
      matches: [
        {
          series: {
            seriesId: '63',
            title: "Jupiter's Legacy",
            releaseDate: '2018-07-10',
          },
          books: [{ bookId: '0F99E5W763ECC', number: '3', title: 'Volume 3' }],
        },
      ],
    },
    {
      request: { series: ["Jupiter's Legacy (2013)", "Jupiter's Legacy"], number: '4' },
      matches: [
        {
          series: {
            seriesId: '63',
            title: "Jupiter's Legacy",
            releaseDate: '2018-07-10',
          },
          books: [{ bookId: '0F99E5W723ENT', number: '4', title: 'Volume 4' }],
        },
      ],
    },
    {
      request: { series: ["Jupiter's Legacy (2013)", "Jupiter's Legacy"], number: '5' },
      matches: [
        {
          series: {
            seriesId: '63',
            title: "Jupiter's Legacy",
            releaseDate: '2018-07-10',
          },
          books: [{ bookId: '0F99E5W723ENR', number: '5', title: 'Volume 5' }],
        },
      ],
    },
    {
      request: { series: ["Jupiter's Legacy 2 (2016)", "Jupiter's Legacy 2"], number: '1' },
      matches: [],
    },
    {
      request: { series: ["Jupiter's Legacy 2 (2016)", "Jupiter's Legacy 2"], number: '2' },
      matches: [],
    },
    {
      request: { series: ["Jupiter's Legacy 2 (2016)", "Jupiter's Legacy 2"], number: '3' },
      matches: [],
    },
    {
      request: { series: ["Jupiter's Legacy 2 (2016)", "Jupiter's Legacy 2"], number: '4' },
      matches: [],
    },
    {
      request: { series: ["Jupiter's Legacy 2 (2016)", "Jupiter's Legacy 2"], number: '5' },
      matches: [],
    },
    {
      request: {
        series: ["Jupiter's Legacy Requiem (2021)", "Jupiter's Legacy Requiem"],
        number: '1',
      },
      matches: [],
    },
    {
      request: {
        series: ["Jupiter's Legacy Requiem (2021)", "Jupiter's Legacy Requiem"],
        number: '2',
      },
      matches: [],
    },
    {
      request: {
        series: ["Jupiter's Legacy Requiem (2021)", "Jupiter's Legacy Requiem"],
        number: '3',
      },
      matches: [],
    },
    {
      request: {
        series: ["Jupiter's Legacy Requiem (2021)", "Jupiter's Legacy Requiem"],
        number: '4',
      },
      matches: [],
    },
    {
      request: {
        series: ["Jupiter's Legacy Requiem (2021)", "Jupiter's Legacy Requiem"],
        number: '5',
      },
      matches: [],
    },
    {
      request: {
        series: ["Jupiter's Legacy Requiem (2021)", "Jupiter's Legacy Requiem"],
        number: '6',
      },
      matches: [],
    },
  ],
  errorCode: '',
}

export const emptyCbl = {
  error: 'Bad Request',
  message: 'ERR_1029',
}

export const garbledCbl = {
  error: 'Bad Request',
  message: 'ERR_1015',
}

const rl1 = {
  id: '02AQZYKBS00J8',
  name: 'Readlist example',
  summary: 'An example read list to show off how it works in Komga.',
  ordered: true,
  bookIds: ['BOOK1', 'BOOK2'],
  createdDate: new Date('2020-08-20T05:45:38Z'),
  lastModifiedDate: new Date('2021-08-09T08:42:38Z'),
  filtered: false,
}

const rl2 = {
  id: '02AQZYKBS00J9',
  name: 'Elfes',
  summary: 'Elfes readlist',
  ordered: false,
  bookIds: ['BOOK3', 'BOOK4'],
  createdDate: new Date('2020-08-20T05:45:38Z'),
  lastModifiedDate: new Date('2021-08-09T08:42:38Z'),
  filtered: false,
}

let readlists = [rl1, rl2]

export const readListsHandlers = [
  httpTyped.get('/api/v1/readlists', ({ query, response }) => {
    const selectedReadLists = query.get('search')
      ? readlists.filter((it) => !!it.name.match(new RegExp(query.get('search')!, 'i')))
      : readlists

    return response(200).json(
      mockPage(
        selectedReadLists,
        new PageRequest(
          Number(query.get('page')),
          Number(query.get('size')),
          undefined,
          Boolean(query.get('unpaged')),
        ),
      ),
    )
  }),
  httpTyped.get('/api/v1/readlists/:id', ({ params, response }) => {
    const readlist = readlists.find((it) => it.id === params.id)
    if (!readlist) {
      return response(404).json({ error: 'Not Found' })
    }
    return response(200).json(readlist)
  }),
  httpTyped.get('/api/v1/readlists/:id/books', ({ params, query, response }) => {
    const readlist = readlists.find((it) => it.id === params.id)
    if (!readlist) {
      return response(404).json({ error: 'Not Found' })
    }
    // Return mock books for the readlist
    return response(200).json(
      mockPage(
        readlist.bookIds.map((bookId, idx) => ({
          id: bookId,
          name: `Book ${idx + 1}`,
          number: `${idx + 1}`,
          seriesId: 'series1',
        })),
        new PageRequest(
          Number(query.get('page')),
          Number(query.get('size')),
          undefined,
          Boolean(query.get('unpaged')),
        ),
      ),
    )
  }),
  httpTyped.post('/api/v1/readlists', async ({ request, response }) => {
    const body = await request.json()
    const newReadlist = {
      ...body,
      createdDate: new Date(),
      lastModifiedDate: new Date(),
      id: (Math.random() + 1).toString(36).substring(7),
      filtered: false,
    }
    readlists.push(newReadlist)
    return response(200).json(newReadlist)
  }),
  httpTyped.patch('/api/v1/readlists/:id', async ({ params, request, response }) => {
    const readlist = readlists.find((it) => it.id === params.id)
    if (!readlist) {
      return response(404).json({ error: 'Not Found' })
    }
    const body = await request.json()
    const updated = {
      ...readlist,
      ...body,
      lastModifiedDate: new Date(),
    }
    readlists = readlists.map((it) => (it.id === params.id ? updated : it))
    return response(200).json(updated)
  }),
  httpTyped.delete('/api/v1/readlists/:id', ({ params, response }) => {
    const idx = readlists.findIndex((it) => it.id === params.id)
    if (idx === -1) {
      return response(404).json({ error: 'Not Found' })
    }
    readlists = readlists.filter((it) => it.id !== params.id)
    return response(204).text('')
  }),
  httpTyped.post('/api/v1/readlists/match/comicrack', ({ response }) => {
    return response(200).json(matchCbl)
  }),
]
