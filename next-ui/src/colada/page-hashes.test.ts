import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { pageHashesKnownQuery, pageHashesUnknownQuery, pageHashMatchesQuery } from '@/colada/page-hashes'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { useQuery } from '@pinia/colada'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada page-hashes', () => {
  test('when known page hashes query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        pageHashesKnownQuery({
          actions: undefined,
          page: 0,
          size: 20,
          sort: undefined,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      pageHashesKnownQuery({
        actions: undefined,
        page: 0,
        size: 20,
        sort: undefined,
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
  })

  test('when known page hashes endpoint fails with 401, error is set', async () => {
    server.use(http.get('*/api/v1/page-hashes', response401Unauthorized))

    createMockColada(() =>
      useQuery(
        pageHashesKnownQuery({
          actions: undefined,
          page: 0,
          size: 20,
          sort: undefined,
        }),
      ),
    )

    const { error, refresh } = useQuery(
      pageHashesKnownQuery({
        actions: undefined,
        page: 0,
        size: 20,
        sort: undefined,
      }),
    )

    await refresh()
    expect(error.value).toBeDefined()
  })

  test('when unknown page hashes query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        pageHashesUnknownQuery({
          page: 0,
          size: 20,
          sort: undefined,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      pageHashesUnknownQuery({
        page: 0,
        size: 20,
        sort: undefined,
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
  })

})
