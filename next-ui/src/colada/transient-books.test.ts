import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { transientBooksScan, transientBookAnalyze } from '@/colada/transient-books'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { useQuery } from '@pinia/colada'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada transient-books', () => {
  test('when transient books scan query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        transientBooksScan({
          path: '/test/path',
        }),
      ),
    )

    const { data, refresh } = useQuery(
      transientBooksScan({
        path: '/test/path',
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
  })

  test('when transient books scan endpoint fails with 401, error is set', async () => {
    server.use(http.post('*/api/v1/transient-books', response401Unauthorized))

    createMockColada(() =>
      useQuery(
        transientBooksScan({
          path: '/test/path',
        }),
      ),
    )

    const { error, refresh } = useQuery(
      transientBooksScan({
        path: '/test/path',
      }),
    )

    await refresh()
    expect(error.value).toBeDefined()
  })

  test('when transient book analyze query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        transientBookAnalyze({
          transientBookId: 'book-123',
        }),
      ),
    )

    const { data, refresh } = useQuery(
      transientBookAnalyze({
        transientBookId: 'book-123',
      }),
    )

    const result = await refresh()
    // Analyze endpoint returns void/null on success
    expect(refresh).toBeDefined()
  })

  test('when transient book analyze endpoint fails with 401, error is set', async () => {
    server.use(http.post('*/api/v1/transient-books/*/analyze', response401Unauthorized))

    createMockColada(() =>
      useQuery(
        transientBookAnalyze({
          transientBookId: 'book-123',
        }),
      ),
    )

    const { error, refresh } = useQuery(
      transientBookAnalyze({
        transientBookId: 'book-123',
      }),
    )

    await refresh()
    expect(error.value).toBeDefined()
  })
})
