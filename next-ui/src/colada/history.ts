import { defineQueryOptions } from '@pinia/colada'
import { komgaClient } from '@/api/komga-client'

export const historyQuery = defineQueryOptions(
  ({ page, size, sort }: { page?: number; size?: number; sort?: string[] }) => ({
    key: ['history', { page: page, size: size, sort: sort }],
    query: () =>
      komgaClient
        .GET('/api/v1/history', {
          params: {
            query: { page: page, size: size, sort: sort },
          },
        })
        // unwrap the openapi-fetch structure on success
        .then((res) => res.data),
    placeholderData: (previousData) => previousData,
  }),
)

// Reading history queries for user reading activity
export const readingHistoryQuery = defineQueryOptions(
  ({
    page = 0,
    size = 20,
    sort,
  }: {
    page?: number
    size?: number
    sort?: string[]
  } = {}) => ({
    key: ['readingHistory', { page, size, sort }],
    query: async () => {
      const response = await komgaClient.GET('/api/v1/series', {
        params: {
          query: {
            page,
            size,
            sort: sort || ['lastModified,desc'],
          },
        },
      })
      // Filter to only series with read progress
      return {
        content: response.data?.content?.filter((s: any) => s.booksReadCount > 0) ?? [],
        totalElements: response.data?.totalElements ?? 0,
        totalPages: response.data?.totalPages ?? 0,
      }
    },
    placeholderData: (previousData) => previousData,
  }),
)

export const readingStatsQuery = defineQueryOptions(() => ({
  key: ['readingStats'],
  query: async () => {
    const response = await komgaClient.GET('/api/v1/series', {
      params: {
        query: { page: 0, size: 1000 },
      },
    })

    const series = response.data?.content ?? []
    const monthlyStats = new Map<string, number>()
    const yearly = new Map<number, number>()

    // Aggregate reading stats by month based on last modified
    for (const s of series) {
      if (s.lastModified && s.booksReadCount > 0) {
        const date = new Date(s.lastModified)
        const monthKey = date.toISOString().substring(0, 7) // YYYY-MM
        const year = date.getFullYear()

        monthlyStats.set(monthKey, (monthlyStats.get(monthKey) ?? 0) + 1)
        yearly.set(year, (yearly.get(year) ?? 0) + 1)
      }
    }

    const totalRead = series.filter((s: any) => s.booksReadCount > 0).length

    return {
      monthlyStats: Array.from(monthlyStats.entries())
        .sort()
        .map(([month, count]) => ({ month, count })),
      yearlyStats: Array.from(yearly.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([year, count]) => ({ year, count })),
      totalRead,
      averagePerMonth:
        Math.round((totalRead / Math.max(monthlyStats.size, 1)) * 100) / 100,
    }
  },
  placeholderData: (previousData) => previousData,
}))

export const currentlyReadingQuery = defineQueryOptions(() => ({
  key: ['currentlyReading'],
  query: async () => {
    const response = await komgaClient.GET('/api/v1/series', {
      params: {
        query: { page: 0, size: 1000 },
      },
    })

    const series = response.data?.content ?? []
    return {
      content: series
        .filter((s: any) => s.booksInProgressCount > 0)
        .sort((a: any, b: any) => {
          // Sort by last modified descending
          return (
            new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
          )
        })
        .slice(0, 10), // Top 10 currently reading
      totalElements: series.filter((s: any) => s.booksInProgressCount > 0).length,
    }
  },
  placeholderData: (previousData) => previousData,
}))

export const readingStreakQuery = defineQueryOptions(() => ({
  key: ['readingStreak'],
  query: async () => {
    const response = await komgaClient.GET('/api/v1/series', {
      params: {
        query: { page: 0, size: 1000 },
      },
    })

    const series = response.data?.content ?? []
    const dates = new Set<string>()

    // Collect all modified dates where series was read
    for (const s of series) {
      if (s.lastModified && s.booksReadCount > 0) {
        const date = new Date(s.lastModified)
        const dateStr = date.toISOString().substring(0, 10) // YYYY-MM-DD
        dates.add(dateStr)
      }
    }

    // Calculate current streak
    const sortedDates = Array.from(dates).sort().reverse()
    let currentStreak = 0
    let longestStreak = 0
    let currentStreakStart: string | null = null

    let lastDate: Date | null = null
    for (const dateStr of sortedDates) {
      const date = new Date(dateStr)
      if (!lastDate) {
        currentStreak = 1
        currentStreakStart = dateStr
      } else {
        const diffDays = Math.floor(
          (lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        )
        if (diffDays === 1) {
          currentStreak++
        } else if (diffDays === 0) {
          // Same day, skip
        } else {
          // Streak broken
          longestStreak = Math.max(longestStreak, currentStreak)
          currentStreak = 1
          currentStreakStart = dateStr
        }
      }
      lastDate = date
    }
    longestStreak = Math.max(longestStreak, currentStreak)

    return {
      currentStreak,
      longestStreak,
      currentStreakStart,
      totalReadingDays: dates.size,
    }
  },
  placeholderData: (previousData) => previousData,
}))
