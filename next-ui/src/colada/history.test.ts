import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { historyQuery } from '@/colada/history'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { useQuery } from '@pinia/colada'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada history', () => {
  test('when history query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        historyQuery({
          page: 0,
          size: 20,
          sort: undefined,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      historyQuery({
        page: 0,
        size: 20,
        sort: undefined,
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
  })

  test('when history endpoint fails with 401, error is set', async () => {
    server.use(http.get('*/api/v1/history', response401Unauthorized))

    createMockColada(() =>
      useQuery(
        historyQuery({
          page: 0,
          size: 20,
          sort: undefined,
        }),
      ),
    )

    const { error, refresh } = useQuery(
      historyQuery({
        page: 0,
        size: 20,
        sort: undefined,
      }),
    )

    await refresh()
    expect(error.value).toBeDefined()
  })
})
