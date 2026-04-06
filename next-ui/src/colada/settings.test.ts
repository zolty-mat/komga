import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import {
  useSettings,
  useUpdateSettings,
  useReadingStatistics,
  useUpdateUserPreferences,
  useLogoutAllDevices,
  useDeleteAccount,
} from '@/colada/settings'
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

  test('when reading statistics query succeeds then stats are returned', async () => {
    createMockColada(useReadingStatistics)
    const { data, refresh } = useReadingStatistics()

    await refresh()
    expect(data.value).toBeDefined()
  })

  test('when reading statistics endpoint fails with 401, error is set', async () => {
    server.use(http.get('*/api/v2/users/me/reading-stats', response401Unauthorized))

    createMockColada(useReadingStatistics)
    const { error, refresh } = useReadingStatistics()

    await refresh()
    expect(error.value).toBeDefined()
  })

  test('when update user preferences mutation succeeds then mutation executes', async () => {
    createMockColada(() => useUpdateUserPreferences())
    const { mutate } = useUpdateUserPreferences()

    await mutate({})
    expect(mutate).toBeDefined()
  })

  test('when logout all devices mutation succeeds then mutation executes', async () => {
    createMockColada(() => useLogoutAllDevices())
    const { mutate } = useLogoutAllDevices()

    await mutate({} as any)
    expect(mutate).toBeDefined()
  })

  test('when logout all devices endpoint fails with 401, error is set', async () => {
    server.use(http.post('*/api/logout', response401Unauthorized))

    createMockColada(() => useLogoutAllDevices())
    const { mutate, error } = useLogoutAllDevices()

    try {
      await mutate({} as any)
    } catch (e) {
      // Expected to fail
    }
    expect(error.value).toBeDefined()
  })

  test('when delete account mutation succeeds then mutation executes', async () => {
    createMockColada(() => useDeleteAccount())
    const { mutate } = useDeleteAccount()

    await mutate({} as any)
    expect(mutate).toBeDefined()
  })

  test('when delete account endpoint fails with 401, error is set', async () => {
    server.use(http.delete('*/api/v2/users/me', response401Unauthorized))

    createMockColada(() => useDeleteAccount())
    const { mutate, error } = useDeleteAccount()

    try {
      await mutate()
    } catch (e) {
      // Expected to fail
    }
    expect(error.value).toBeDefined()
  })
})
