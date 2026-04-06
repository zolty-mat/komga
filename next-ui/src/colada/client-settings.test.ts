import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { useClientSettingsUser } from '@/colada/client-settings'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { httpTyped } from '@/mocks/api/httpTyped'
import { CLIENT_SETTING_USER, type ClientSettingUserLibrary } from '@/types/ClientSettingsUser'
import type { components } from '@/generated/openapi/komga'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada client-settings', () => {
  test('when user has library settings then userLibraries is populated', async () => {
    const userLibraries: Record<string, ClientSettingUserLibrary> = {
      lib1: { unpinned: true },
      lib2: { order: 2 },
    }
    server.use(
      httpTyped.get('/api/v1/client-settings/user/list', ({ response }) => {
        const settings: Record<string, components['schemas']['ClientSettingUserUpdateDto']> = {
          [CLIENT_SETTING_USER.NEXTUI_LIBRARIES]: {
            value: JSON.stringify(userLibraries),
          },
        }
        return response(200).json(settings)
      }),
    )

    createMockColada(useClientSettingsUser)
    const { userLibraries: result, refresh } = useClientSettingsUser()

    await refresh()
    expect(result.value).toStrictEqual(userLibraries)
  })

  test('when user has no library settings then userLibraries is empty', async () => {
    server.use(
      httpTyped.get('/api/v1/client-settings/user/list', ({ response }) =>
        response(200).json({}),
      ),
    )

    createMockColada(useClientSettingsUser)
    const { userLibraries, refresh } = useClientSettingsUser()

    await refresh()
    expect(userLibraries.value).toStrictEqual({})
  })
})
