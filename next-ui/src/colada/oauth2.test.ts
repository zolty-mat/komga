import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { useOAuth2Providers } from '@/colada/oauth2'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import type { ErrorCause } from '@/api/komga-client'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'
import { httpTyped } from '@/mocks/api/httpTyped'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada oauth2', () => {
  test('when providers exist, data contains the provider list', async () => {
    createMockColada(useOAuth2Providers)
    const { data, refresh } = useOAuth2Providers()

    await refresh()
    expect(data.value).toEqual([
      { name: 'Authentik', registrationId: 'authentik' },
      { name: 'GitHub', registrationId: 'github' },
    ])
  })

  test('when no providers configured, data is empty array', async () => {
    server.use(
      httpTyped.get('/api/v1/oauth2/providers', ({ response }) =>
        response(200).json([]),
      ),
    )

    createMockColada(useOAuth2Providers)
    const { data, refresh } = useOAuth2Providers()

    await refresh()
    expect(data.value).toEqual([])
  })

  test('when endpoint fails (401), error is set', async () => {
    server.use(http.get('*/api/v1/oauth2/providers', response401Unauthorized))

    createMockColada(useOAuth2Providers)
    const { data, error, refresh } = useOAuth2Providers()

    await refresh()
    expect(data.value).toBeUndefined()
    expect((error.value?.cause as ErrorCause).status).toBe(401)
  })
})
