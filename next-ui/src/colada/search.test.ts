import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { seriesSearchQuery, booksSearchQuery, authorsSearchQuery } from '@/colada/search'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { useQuery } from '@pinia/colada'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada search', () => {
  test('when series search query with fulltext succeeds then results are returned', async () => {
    createMockColada(() => {
      const { data } = useQuery(() => seriesSearchQuery({ query: 'Super Duck' }))
      expect(data).toBeDefined()
    })
  })

  test('when series search query with library filter succeeds then results are returned', async () => {
    createMockColada(() => {
      const { data } = useQuery(() =>
        seriesSearchQuery({
          query: '',
          filters: { libraryId: ['1'] },
        }),
      )
      expect(data).toBeDefined()
    })
  })

  test('when series search query with multiple filters succeeds then results are returned', async () => {
    createMockColada(() => {
      const { data } = useQuery(() =>
        seriesSearchQuery({
          query: 'manga',
          filters: {
            libraryId: ['1'],
            oneshot: false,
          },
        }),
      )
      expect(data).toBeDefined()
    })
  })

  test('when books search query with fulltext succeeds then results are returned', async () => {
    createMockColada(() => {
      const { data } = useQuery(() => booksSearchQuery({ query: 'The Book' }))
      expect(data).toBeDefined()
    })
  })

  test('when books search query with pagination succeeds then results are returned', async () => {
    createMockColada(() => {
      const { data } = useQuery(() =>
        booksSearchQuery({
          query: 'The Book',
          pageRequest: { page: 0, size: 10 },
        }),
      )
      expect(data).toBeDefined()
    })
  })

  test('when authors search query with fulltext succeeds then results are returned', async () => {
    createMockColada(() => {
      const { data } = useQuery(() => authorsSearchQuery({ query: 'John Doe' }))
      expect(data).toBeDefined()
    })
  })

  test('when authors search query with library filter succeeds then results are returned', async () => {
    createMockColada(() => {
      const { data } = useQuery(() =>
        authorsSearchQuery({
          query: '',
          filters: { libraryId: ['1'] },
        }),
      )
      expect(data).toBeDefined()
    })
  })

  test('when series search query with empty query succeeds then results are returned', async () => {
    createMockColada(() => {
      const { data } = useQuery(() => seriesSearchQuery({ query: '' }))
      expect(data).toBeDefined()
    })
  })

  test('when series search query with genre filter succeeds then results are returned', async () => {
    createMockColada(() => {
      const { data } = useQuery(() =>
        seriesSearchQuery({
          query: '',
          filters: {
            genres: [{ id: '1', name: 'Action' }],
          },
        }),
      )
      expect(data).toBeDefined()
    })
  })

  test('when series search query with language filter succeeds then results are returned', async () => {
    createMockColada(() => {
      const { data } = useQuery(() =>
        seriesSearchQuery({
          query: '',
          filters: {
            languages: [{ id: 'en', name: 'English' }],
          },
        }),
      )
      expect(data).toBeDefined()
    })
  })
})
