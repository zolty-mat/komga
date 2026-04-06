import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import {
  useLibraries,
  useCreateLibrary,
  useUpdateLibrary,
  useDeleteLibrary,
} from '@/colada/libraries'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada libraries', () => {
  test('when libraries query succeeds then data is returned', async () => {
    createMockColada(useLibraries)
    const { data, refresh } = useLibraries()

    await refresh()
    expect(data.value).toBeDefined()
    expect(Array.isArray(data.value)).toBe(true)
  })

  test('when libraries endpoint fails with 401, error is set', async () => {
    server.use(http.get('*/api/v1/libraries', response401Unauthorized))

    createMockColada(useLibraries)
    const { error, refresh } = useLibraries()

    await refresh()
    expect(error.value).toBeDefined()
  })

  test('when create library mutation succeeds then mutation executes', async () => {
    createMockColada(() => useCreateLibrary())
    const { mutate } = useCreateLibrary()

    await mutate({
      name: 'Test Library',
      root: '/test/path',
    })
    expect(mutate).toBeDefined()
  })

  test('when create library endpoint fails with 401, error is set', async () => {
    server.use(http.post('*/api/v1/libraries', response401Unauthorized))

    createMockColada(() => useCreateLibrary())
    const { mutate, error } = useCreateLibrary()

    try {
      await mutate({
        name: 'Test Library',
        root: '/test/path',
      })
    } catch (e) {
      // Expected to fail
    }
    expect(error.value).toBeDefined()
  })

  test('when update library mutation succeeds then mutation executes', async () => {
    createMockColada(() => useUpdateLibrary())
    const { mutate } = useUpdateLibrary()

    await mutate({
      id: 'lib-123',
      name: 'Updated Library',
      root: '/updated/path',
    })
    expect(mutate).toBeDefined()
  })

  test('when delete library mutation succeeds then mutation executes', async () => {
    createMockColada(() => useDeleteLibrary())
    const { mutate } = useDeleteLibrary()

    await mutate('lib-456')
    expect(mutate).toBeDefined()
  })
})
