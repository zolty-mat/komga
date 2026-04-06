import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { useDeleteSyncPoints } from '@/colada/syncpoints'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada syncpoints', () => {
  test('when delete syncpoints mutation succeeds then mutation executes', async () => {
    createMockColada(() => useDeleteSyncPoints())
    const { mutate } = useDeleteSyncPoints()

    await mutate(['key-1', 'key-2'])
    expect(mutate).toBeDefined()
  })

  test('when delete syncpoints endpoint fails with 401, error is set', async () => {
    server.use(http.delete('*/api/v1/syncpoints/me', response401Unauthorized))

    createMockColada(() => useDeleteSyncPoints())
    const { mutate, error } = useDeleteSyncPoints()

    try {
      await mutate(['key-1', 'key-2'])
    } catch (e) {
      // Expected to fail
    }
    expect(error.value).toBeDefined()
  })
})
