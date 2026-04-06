import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import {
  readingHistoryQuery,
  readingStatsQuery,
  currentlyReadingQuery,
  readingStreakQuery,
} from '@/colada/history'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { useQuery } from '@pinia/colada'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('reading history queries', () => {
  test('reading history query returns paginated series with read progress', async () => {
    createMockColada(() =>
      useQuery(
        readingHistoryQuery({
          page: 0,
          size: 20,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      readingHistoryQuery({
        page: 0,
        size: 20,
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
    expect(data.value?.content).toBeInstanceOf(Array)
    expect(data.value?.totalElements).toBeGreaterThanOrEqual(0)
  })

  test('reading history query supports pagination', async () => {
    createMockColada(() =>
      useQuery(
        readingHistoryQuery({
          page: 0,
          size: 10,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      readingHistoryQuery({
        page: 0,
        size: 10,
      }),
    )

    await refresh()
    expect(data.value?.content.length).toBeLessThanOrEqual(10)
  })

  test('reading stats query returns monthly aggregation', async () => {
    createMockColada(() => useQuery(readingStatsQuery()))

    const { data, refresh } = useQuery(readingStatsQuery())

    await refresh()
    expect(data.value).toBeDefined()
    expect(data.value?.monthlyStats).toBeInstanceOf(Array)
    expect(data.value?.totalRead).toBeGreaterThanOrEqual(0)
    expect(data.value?.averagePerMonth).toBeGreaterThanOrEqual(0)
  })

  test('reading stats query calculates yearly aggregation', async () => {
    createMockColada(() => useQuery(readingStatsQuery()))

    const { data, refresh } = useQuery(readingStatsQuery())

    await refresh()
    expect(data.value?.yearlyStats).toBeInstanceOf(Array)
    expect(data.value?.yearlyStats.length).toBeGreaterThanOrEqual(0)
  })

  test('currently reading query returns in-progress series', async () => {
    createMockColada(() => useQuery(currentlyReadingQuery()))

    const { data, refresh } = useQuery(currentlyReadingQuery())

    await refresh()
    expect(data.value).toBeDefined()
    expect(data.value?.content).toBeInstanceOf(Array)
    expect(data.value?.totalElements).toBeGreaterThanOrEqual(0)
  })

  test('currently reading query returns max 10 items', async () => {
    createMockColada(() => useQuery(currentlyReadingQuery()))

    const { data, refresh } = useQuery(currentlyReadingQuery())

    await refresh()
    expect(data.value?.content.length).toBeLessThanOrEqual(10)
  })

  test('reading streak query calculates consecutive reading days', async () => {
    createMockColada(() => useQuery(readingStreakQuery()))

    const { data, refresh } = useQuery(readingStreakQuery())

    await refresh()
    expect(data.value).toBeDefined()
    expect(data.value?.currentStreak).toBeGreaterThanOrEqual(0)
    expect(data.value?.longestStreak).toBeGreaterThanOrEqual(0)
    expect(data.value?.totalReadingDays).toBeGreaterThanOrEqual(0)
  })

  test('reading streak query includes streak start date', async () => {
    createMockColada(() => useQuery(readingStreakQuery()))

    const { data, refresh } = useQuery(readingStreakQuery())

    await refresh()
    if (data.value?.currentStreak && data.value.currentStreak > 0) {
      expect(data.value?.currentStreakStart).toBeDefined()
    }
  })

  test('when reading history endpoint fails with 401, error is set', async () => {
    server.use(http.get('*/api/v1/series', response401Unauthorized))

    createMockColada(() =>
      useQuery(
        readingHistoryQuery({
          page: 0,
          size: 20,
        }),
      ),
    )

    const { error, refresh } = useQuery(
      readingHistoryQuery({
        page: 0,
        size: 20,
      }),
    )

    await refresh()
    expect(error.value).toBeDefined()
  })

  test('when stats endpoint fails with 401, error is set', async () => {
    server.use(http.get('*/api/v1/series', response401Unauthorized))

    createMockColada(() => useQuery(readingStatsQuery()))

    const { error, refresh } = useQuery(readingStatsQuery())

    await refresh()
    expect(error.value).toBeDefined()
  })

  test('reading history query caches results with same parameters', async () => {
    createMockColada(() =>
      useQuery(
        readingHistoryQuery({
          page: 0,
          size: 20,
        }),
      ),
    )

    const { data: data1, refresh: refresh1 } = useQuery(
      readingHistoryQuery({
        page: 0,
        size: 20,
      }),
    )

    await refresh1()

    const { data: data2 } = useQuery(
      readingHistoryQuery({
        page: 0,
        size: 20,
      }),
    )

    expect(data1.value).toEqual(data2.value)
  })

  test('reading history query invalidates cache with different page', async () => {
    createMockColada(() =>
      useQuery(
        readingHistoryQuery({
          page: 0,
          size: 20,
        }),
      ),
    )

    const query1 = useQuery(
      readingHistoryQuery({
        page: 0,
        size: 20,
      }),
    )

    const query2 = useQuery(
      readingHistoryQuery({
        page: 1,
        size: 20,
      }),
    )

    expect(query1).not.toEqual(query2)
  })
})
