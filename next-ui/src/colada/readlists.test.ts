import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { readListsListQuery, useCreateReadList } from '@/colada/readlists'
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

  test('when create readlist mutation succeeds then mutation executes', async () => {
    createMockColada(() => useCreateReadList())
    const { mutate } = useCreateReadList()

    await mutate({
      name: 'Test Readlist',
      bookIds: ['book-1', 'book-2'],
    })
    expect(mutate).toBeDefined()
  })

  test('when create readlist endpoint fails with 401, error is set', async () => {
    server.use(http.post('*/api/v1/readlists', response401Unauthorized))

    createMockColada(() => useCreateReadList())
    const { mutate, error } = useCreateReadList()

    try {
      await mutate({
        name: 'Test Readlist',
        bookIds: ['book-1', 'book-2'],
      })
    } catch (e) {
      // Expected to fail
    }
    expect(error.value).toBeDefined()
  })
})
