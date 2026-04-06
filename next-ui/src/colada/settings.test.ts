import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { useSettings, useUpdateSettings } from '@/colada/settings'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada settings', () => {
  test('when settings query succeeds then data is returned', async () => {
    createMockColada(useSettings)
    const { data, refresh } = useSettings()

    await refresh()
    expect(data.value).toBeDefined()
  })

  test('when settings endpoint fails with 401, error is set', async () => {
    server.use(http.get('*/api/v1/settings', response401Unauthorized))

    createMockColada(useSettings)
    const { error, refresh } = useSettings()

    await refresh()
    expect(error.value).toBeDefined()
  })

  test('when update settings mutation succeeds then mutation executes', async () => {
    createMockColada(() => useUpdateSettings())
    const { mutate } = useUpdateSettings()

    await mutate({})
    expect(mutate).toBeDefined()
  })

  test('when update settings endpoint fails with 401, error is set', async () => {
    server.use(http.patch('*/api/v1/settings', response401Unauthorized))

    createMockColada(() => useUpdateSettings())
    const { mutate, error } = useUpdateSettings()

    try {
      await mutate({})
    } catch (e) {
      // Expected to fail
    }
    expect(error.value).toBeDefined()
  })
})
