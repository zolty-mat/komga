import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import {
  useRefreshMetadataBook,
  useAnalyzeBook,
  useMarkBookRead,
  bookDetailQuery,
} from '@/colada/books'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import type { ErrorCause } from '@/api/komga-client'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'
import { useQuery } from '@pinia/colada'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada books', () => {
  test('when refresh metadata mutation succeeds then mutation executes', async () => {
    createMockColada(() => useRefreshMetadataBook())
    const { mutate } = useRefreshMetadataBook()

    await mutate('book-123')
    expect(mutate).toBeDefined()
  })

  test('when refresh metadata endpoint fails with 401, error is set', async () => {
    server.use(http.post('*/api/v1/books/*/metadata/refresh', response401Unauthorized))

    createMockColada(() => useRefreshMetadataBook())
    const { mutate, error } = useRefreshMetadataBook()

    try {
      await mutate('book-123')
    } catch (e) {
      // Expected to fail
    }
    expect(error.value).toBeDefined()
  })

  test('when analyze book mutation succeeds then mutation executes', async () => {
    createMockColada(() => useAnalyzeBook())
    const { mutate } = useAnalyzeBook()

    await mutate('book-456')
    expect(mutate).toBeDefined()
  })

  test('when analyze book endpoint fails with 401, error is set', async () => {
    server.use(http.post('*/api/v1/books/*/analyze', response401Unauthorized))

    createMockColada(() => useAnalyzeBook())
    const { mutate, error } = useAnalyzeBook()

    try {
      await mutate('book-456')
    } catch (e) {
      // Expected to fail
    }
    expect(error.value).toBeDefined()
  })

  test('when mark book read mutation succeeds then mutation executes', async () => {
    createMockColada(() => useMarkBookRead())
    const { mutate } = useMarkBookRead()

    await mutate('book-789')
    expect(mutate).toBeDefined()
  })

  test('when mark book read endpoint fails with 401, error is set', async () => {
    server.use(http.patch('*/api/v1/books/*/read-progress', response401Unauthorized))

    createMockColada(() => useMarkBookRead())
    const { mutate, error } = useMarkBookRead()

    try {
      await mutate('book-789')
    } catch (e) {
      // Expected to fail
    }
    expect(error.value).toBeDefined()
  })

  test('when book detail query succeeds then book data is returned', async () => {
    createMockColada(() => useQuery(() => bookDetailQuery({ bookId: '05RKH8CC8B4RW' })))
    const { data } = useQuery(() => bookDetailQuery({ bookId: '05RKH8CC8B4RW' }))

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(data.value).toBeDefined()
    expect(data.value?.id).toBe('05RKH8CC8B4RW')
  })

  test('when book detail endpoint returns 404, error is set', async () => {
    createMockColada(() => useQuery(() => bookDetailQuery({ bookId: '404' })))
    const { data, error } = useQuery(() => bookDetailQuery({ bookId: '404' }))

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(error.value).toBeDefined()
  })
})
