import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import {
  useRefreshMetadataSeries,
  useAnalyzeSeries,
  useDeleteSeries,
  useMarkSeriesRead,
  useUpdateSeriesMetadata,
} from '@/colada/series'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada series', () => {
  test('when refresh metadata series mutation succeeds then mutation executes', async () => {
    createMockColada(() => useRefreshMetadataSeries())
    const { mutate } = useRefreshMetadataSeries()

    await mutate('series-123')
    expect(mutate).toBeDefined()
  })

  test('when refresh metadata series endpoint fails with 401, error is set', async () => {
    server.use(http.post('*/api/v1/series/*/metadata/refresh', response401Unauthorized))

    createMockColada(() => useRefreshMetadataSeries())
    const { mutate, error } = useRefreshMetadataSeries()

    try {
      await mutate('series-123')
    } catch (e) {
      // Expected to fail
    }
    expect(error.value).toBeDefined()
  })

  test('when analyze series mutation succeeds then mutation executes', async () => {
    createMockColada(() => useAnalyzeSeries())
    const { mutate } = useAnalyzeSeries()

    await mutate('series-456')
    expect(mutate).toBeDefined()
  })

  test('when analyze series endpoint fails with 401, error is set', async () => {
    server.use(http.post('*/api/v1/series/*/analyze', response401Unauthorized))

    createMockColada(() => useAnalyzeSeries())
    const { mutate, error } = useAnalyzeSeries()

    try {
      await mutate('series-456')
    } catch (e) {
      // Expected to fail
    }
    expect(error.value).toBeDefined()
  })

  test('when delete series mutation succeeds then mutation executes', async () => {
    createMockColada(() => useDeleteSeries())
    const { mutate } = useDeleteSeries()

    await mutate('series-789')
    expect(mutate).toBeDefined()
  })

  test('when mark series read mutation succeeds then mutation executes', async () => {
    createMockColada(() => useMarkSeriesRead())
    const { mutate } = useMarkSeriesRead()

    await mutate('series-321')
    expect(mutate).toBeDefined()
  })

  test('when update series metadata mutation succeeds then mutation executes', async () => {
    createMockColada(() => useUpdateSeriesMetadata())
    const { mutate } = useUpdateSeriesMetadata()

    await mutate({
      seriesId: 'series-654',
      metadata: {},
    })
    expect(mutate).toBeDefined()
  })
})
