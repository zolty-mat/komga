import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { collectionsListQuery, collectionDetailQuery } from '@/colada/collections'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { useQuery } from '@pinia/colada'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada collections', () => {
  test('when collections list query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        collectionsListQuery({
          search: undefined,
          libraryIds: undefined,
          pageRequest: undefined,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      collectionsListQuery({
        search: undefined,
        libraryIds: undefined,
        pageRequest: undefined,
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
  })

  test('when collections list endpoint fails with 401, error is set', async () => {
    server.use(http.get('*/api/v1/collections', response401Unauthorized))

    createMockColada(() =>
      useQuery(
        collectionsListQuery({
          search: undefined,
          libraryIds: undefined,
          pageRequest: undefined,
        }),
      ),
    )

    const { error, refresh } = useQuery(
      collectionsListQuery({
        search: undefined,
        libraryIds: undefined,
        pageRequest: undefined,
      }),
    )

    await refresh()
    expect(error.value).toBeDefined()
  })

})
