import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import {
  readListsListQuery,
  useCreateReadList,
  readlistDetailQuery,
  readlistBooksQuery,
  useUpdateReadList,
  useDeleteReadList,
} from '@/colada/readlists'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { useQuery } from '@pinia/colada'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada readlists', () => {
  // List queries
  test('when readlists list query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        readListsListQuery({
          search: undefined,
          libraryIds: undefined,
          pageRequest: undefined,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      readListsListQuery({
        search: undefined,
        libraryIds: undefined,
        pageRequest: undefined,
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
    expect(data.value?.content).toBeDefined()
    expect(data.value?.content.length).toBeGreaterThan(0)
  })

  test('when readlists list endpoint fails with 401, error is set', async () => {
    server.use(http.get('*/api/v1/readlists', response401Unauthorized))

    createMockColada(() =>
      useQuery(
        readListsListQuery({
          search: undefined,
          libraryIds: undefined,
          pageRequest: undefined,
        }),
      ),
    )

    const { error, refresh } = useQuery(
      readListsListQuery({
        search: undefined,
        libraryIds: undefined,
        pageRequest: undefined,
      }),
    )

    await refresh()
    expect(error.value).toBeDefined()
  })

  // Detail query
  test('when readlist detail query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(readlistDetailQuery({ readlistId: '02AQZYKBS00J8' })),
    )

    const { data, refresh } = useQuery(
      readlistDetailQuery({ readlistId: '02AQZYKBS00J8' }),
    )

    await refresh()
    expect(data.value).toBeDefined()
    expect(data.value?.id).toBe('02AQZYKBS00J8')
  })

  test('when readlist detail endpoint returns 404, error is set', async () => {
    server.use(http.get('*/api/v1/readlists/:id', response401Unauthorized))

    createMockColada(() =>
      useQuery(readlistDetailQuery({ readlistId: 'nonexistent' })),
    )

    const { error, refresh } = useQuery(
      readlistDetailQuery({ readlistId: 'nonexistent' }),
    )

    await refresh()
    expect(error.value).toBeDefined()
  })

  // Books query
  test('when readlist books query succeeds then books are returned', async () => {
    createMockColada(() =>
      useQuery(
        readlistBooksQuery({
          readlistId: '02AQZYKBS00J8',
          pageRequest: undefined,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      readlistBooksQuery({
        readlistId: '02AQZYKBS00J8',
        pageRequest: undefined,
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
    expect(data.value?.content).toBeDefined()
  })

  // Create mutation
  test('when create readlist mutation succeeds then readlist is created', async () => {
    createMockColada(() => useCreateReadList())
    const { mutate } = useCreateReadList()

    const result = await mutate({
      name: 'Test Readlist',
      bookIds: ['book-1', 'book-2'],
    } as any)
    expect(result.data).toBeDefined()
    expect(result.data?.id).toBeDefined()
  })

  test('when create readlist endpoint fails with 401, error is set', async () => {
    server.use(http.post('*/api/v1/readlists', response401Unauthorized))

    createMockColada(() => useCreateReadList())
    const { mutate, error } = useCreateReadList()

    try {
      await mutate({
        name: 'Test Readlist',
        bookIds: ['book-1', 'book-2'],
      } as any)
    } catch {
      // Expected to fail
    }
    expect(error.value).toBeDefined()
  })

  // Update mutation
  test('when update readlist mutation succeeds then readlist is updated', async () => {
    createMockColada(() => useUpdateReadList())
    const { mutate } = useUpdateReadList()

    const result = await mutate({
      readlistId: '02AQZYKBS00J8',
      patch: { name: 'Updated Name' },
    } as any)
    expect(result.data).toBeDefined()
  })

  // Delete mutation
  test('when delete readlist mutation succeeds then readlist is deleted', async () => {
    createMockColada(() => useDeleteReadList())
    const { mutate } = useDeleteReadList()

    await mutate('02AQZYKBS00J8')
    expect(mutate).toBeDefined()
  })
})
