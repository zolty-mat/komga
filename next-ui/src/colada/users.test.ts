import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { useCurrentUser, useUsers, useApiKeys } from '@/colada/users'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import type { ErrorCause } from '@/api/komga-client'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada users', () => {
  test('when getting current user then admin data is returned', async () => {
    createMockColada(useCurrentUser)
    const { data, isAdmin, refresh } = useCurrentUser()

    await refresh()
    expect(data.value?.email).toBe('admin@example.org')
    expect(data.value?.roles).toContain('ADMIN')
    expect(isAdmin.value).toBe(true)
  })

  test('when auth fails then error is set', async () => {
    server.use(http.get('*/api/v2/users/me', response401Unauthorized))

    createMockColada(useCurrentUser)
    const { data, error, refresh } = useCurrentUser()

    await refresh()
    expect(data.value).toBeUndefined()
    expect((error.value?.cause as ErrorCause).status).toBe(401)
  })

  test('when getting users list then all users returned', async () => {
    createMockColada(useUsers)
    const { data, refresh } = useUsers()

    await refresh()
    expect(data.value).toHaveLength(2)
    expect(data.value?.map((u) => u.email)).toContain('admin@example.org')
    expect(data.value?.map((u) => u.email)).toContain('user@example.org')
  })

  test('when getting api keys then keys returned', async () => {
    createMockColada(useApiKeys)
    const { data, refresh } = useApiKeys()

    await refresh()
    expect(data.value).toHaveLength(3)
    expect(data.value?.[0].comment).toBe('Kobo Libra')
  })
})
