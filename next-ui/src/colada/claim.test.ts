import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { useClaimStatus } from '@/colada/claim'
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

describe('colada claim', () => {
  test('when server is claimed then isClaimed is true', async () => {
    createMockColada(useClaimStatus)
    const { data, refresh } = useClaimStatus()

    await refresh()
    expect(data.value?.isClaimed).toBe(true)
  })

  test('when server is unclaimed then isClaimed is false', async () => {
    server.use(
      httpTyped.get('/api/v1/claim', ({ response }) =>
        response(200).json({ isClaimed: false }),
      ),
    )

    createMockColada(useClaimStatus)
    const { data, refresh } = useClaimStatus()

    await refresh()
    expect(data.value?.isClaimed).toBe(false)
  })

  test('when claim endpoint fails then error is set', async () => {
    server.use(http.get('*/api/v1/claim', response401Unauthorized))

    createMockColada(useClaimStatus)
    const { data, error, refresh } = useClaimStatus()

    await refresh()
    expect(data.value).toBeUndefined()
    expect((error.value?.cause as ErrorCause).status).toBe(401)
  })
})
