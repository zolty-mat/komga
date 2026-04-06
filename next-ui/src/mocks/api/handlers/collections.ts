import { httpTyped } from '@/mocks/api/httpTyped'
import { PageRequest } from '@/types/PageRequest'
import { mockPage } from '@/mocks/api/pageable'

const collection1 = {
  id: '026801S4HWRZA',
  name: 'Golden Age',
  ordered: true,
  seriesIds: ['57'],
  createdDate: new Date('2020-08-06T06:13:25Z'),
  lastModifiedDate: new Date('2020-08-06T06:17:12Z'),
  filtered: false,
}

const collection2 = {
  id: '026801S4HWRZB',
  name: 'Modern Era',
  ordered: false,
  seriesIds: ['58', '59', '60'],
  createdDate: new Date('2021-01-15T10:30:00Z'),
  lastModifiedDate: new Date('2021-06-20T14:22:30Z'),
  filtered: false,
}

const collections = [collection1, collection2]

const collectionSeries1 = [
  {
    id: '57',
    name: 'Amazing Comics',
    booksCount: 10,
    metadata: { title: 'Amazing Comics' },
  },
  {
    id: '58',
    name: 'Classic Tales',
    booksCount: 5,
    metadata: { title: 'Classic Tales' },
  },
]

export const collectionsHandlers = [
  httpTyped.get('/api/v1/collections', ({ query, response }) => {
    const search = query.get('search')

    const selected = collections.filter((it) => {
      let include = true
      if (search) include = include && !!it.name.match(new RegExp(search, 'i'))
      return include
    })

    return response(200).json(
      mockPage(selected, new PageRequest(Number(query.get('page')), Number(query.get('size')))),
    )
  }),

  httpTyped.get('/api/v1/collections/{id}', ({ params, response }) => {
    const collection = collections.find((c) => c.id === params.id)
    if (!collection) return response(404).empty()
    return response(200).json(collection)
  }),

  httpTyped.get('/api/v1/collections/{id}/series', ({ params, query, response }) => {
    if (params.id === '026801S4HWRZA') {
      return response(200).json(
        mockPage(collectionSeries1, new PageRequest(Number(query.get('page')), Number(query.get('size')))),
      )
    }
    return response(200).json(
      mockPage([], new PageRequest(Number(query.get('page')), Number(query.get('size')))),
    )
  }),

  httpTyped.patch('/api/v1/collections/{id}', ({ params, request, response }) => {
    const body = request.body
    const collection = collections.find((c) => c.id === params.id)
    if (!collection) return response(404).empty()
    Object.assign(collection, body, { lastModifiedDate: new Date() })
    return response(204).json(collection)
  }),

  httpTyped.delete('/api/v1/collections/{id}', ({ params, response }) => {
    const index = collections.findIndex((c) => c.id === params.id)
    if (index === -1) return response(404).empty()
    collections.splice(index, 1)
    return response(204).empty()
  }),
]
