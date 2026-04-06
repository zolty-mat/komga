import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import {
  libraryStatsQuery,
  genreStatsQuery,
  authorStatsQuery,
  publisherStatsQuery,
  languageStatsQuery,
  publicationTimelineQuery,
  completionByGenreQuery,
  userLibraryComparisonQuery,
  readingStreakQuery,
} from '@/colada/analytics'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { useQuery } from '@pinia/colada'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada analytics', () => {
  describe('libraryStats', () => {
    test('when library stats query succeeds then stats are returned', async () => {
      createMockColada(() => useQuery(libraryStatsQuery()))

      const { data, refresh } = useQuery(libraryStatsQuery())

      await refresh()
      expect(data.value).toBeDefined()
      expect(data.value?.totalBooks).toBeGreaterThanOrEqual(0)
      expect(data.value?.totalSeries).toBeGreaterThanOrEqual(0)
      expect(data.value?.booksRead).toBeGreaterThanOrEqual(0)
      expect(data.value?.completionRate).toBeGreaterThanOrEqual(0)
      expect(data.value?.completionRate).toBeLessThanOrEqual(100)
    })

    test('when library endpoint fails with 401, error is set', async () => {
      server.use(http.get('*/api/v1/series', response401Unauthorized))

      createMockColada(() => useQuery(libraryStatsQuery()))

      const { error, refresh } = useQuery(libraryStatsQuery())

      await refresh()
      expect(error.value).toBeDefined()
    })

    test('completion rate is calculated correctly', async () => {
      createMockColada(() => useQuery(libraryStatsQuery()))

      const { data, refresh } = useQuery(libraryStatsQuery())

      await refresh()
      if (data.value?.totalBooks && data.value?.totalBooks > 0) {
        const expectedRate = Math.round((data.value.booksRead / data.value.totalBooks) * 100)
        expect(data.value.completionRate).toBe(expectedRate)
      }
    })
  })

  describe('genreStats', () => {
    test('when genre stats query succeeds then genre data is returned', async () => {
      createMockColada(() => useQuery(genreStatsQuery()))

      const { data, refresh } = useQuery(genreStatsQuery())

      await refresh()
      expect(data.value).toBeDefined()
      expect(Array.isArray(data.value?.genres)).toBe(true)
      expect(Array.isArray(data.value?.topGenres)).toBe(true)
    })

    test('genre data is sorted by count descending', async () => {
      createMockColada(() => useQuery(genreStatsQuery()))

      const { data, refresh } = useQuery(genreStatsQuery())

      await refresh()
      if (data.value?.genres && data.value.genres.length > 1) {
        for (let i = 0; i < data.value.genres.length - 1; i++) {
          expect(data.value.genres[i].value).toBeGreaterThanOrEqual(data.value.genres[i + 1].value)
        }
      }
    })

    test('top genres contains at most 5 items', async () => {
      createMockColada(() => useQuery(genreStatsQuery()))

      const { data, refresh } = useQuery(genreStatsQuery())

      await refresh()
      expect(data.value?.topGenres.length).toBeLessThanOrEqual(5)
    })
  })

  describe('authorStats', () => {
    test('when author stats query succeeds then author data is returned', async () => {
      createMockColada(() => useQuery(authorStatsQuery()))

      const { data, refresh } = useQuery(authorStatsQuery())

      await refresh()
      expect(data.value).toBeDefined()
      expect(Array.isArray(data.value?.authors)).toBe(true)
      expect(Array.isArray(data.value?.topAuthors)).toBe(true)
    })

    test('author data is sorted by total books descending', async () => {
      createMockColada(() => useQuery(authorStatsQuery()))

      const { data, refresh } = useQuery(authorStatsQuery())

      await refresh()
      if (data.value?.authors && data.value.authors.length > 1) {
        for (let i = 0; i < data.value.authors.length - 1; i++) {
          expect(data.value.authors[i].totalBooks).toBeGreaterThanOrEqual(
            data.value.authors[i + 1].totalBooks,
          )
        }
      }
    })

    test('top authors contains at most 10 items', async () => {
      createMockColada(() => useQuery(authorStatsQuery()))

      const { data, refresh } = useQuery(authorStatsQuery())

      await refresh()
      expect(data.value?.topAuthors.length).toBeLessThanOrEqual(10)
    })
  })

  describe('publisherStats', () => {
    test('when publisher stats query succeeds then publisher data is returned', async () => {
      createMockColada(() => useQuery(publisherStatsQuery()))

      const { data, refresh } = useQuery(publisherStatsQuery())

      await refresh()
      expect(data.value).toBeDefined()
      expect(Array.isArray(data.value?.publishers)).toBe(true)
      expect(Array.isArray(data.value?.topPublishers)).toBe(true)
    })

    test('publisher data is sorted by total books descending', async () => {
      createMockColada(() => useQuery(publisherStatsQuery()))

      const { data, refresh } = useQuery(publisherStatsQuery())

      await refresh()
      if (data.value?.publishers && data.value.publishers.length > 1) {
        for (let i = 0; i < data.value.publishers.length - 1; i++) {
          expect(data.value.publishers[i].totalBooks).toBeGreaterThanOrEqual(
            data.value.publishers[i + 1].totalBooks,
          )
        }
      }
    })
  })

  describe('languageStats', () => {
    test('when language stats query succeeds then language data is returned', async () => {
      createMockColada(() => useQuery(languageStatsQuery()))

      const { data, refresh } = useQuery(languageStatsQuery())

      await refresh()
      expect(data.value).toBeDefined()
      expect(Array.isArray(data.value?.languages)).toBe(true)
    })

    test('language data is sorted by count descending', async () => {
      createMockColada(() => useQuery(languageStatsQuery()))

      const { data, refresh } = useQuery(languageStatsQuery())

      await refresh()
      if (data.value?.languages && data.value.languages.length > 1) {
        for (let i = 0; i < data.value.languages.length - 1; i++) {
          expect(data.value.languages[i].value).toBeGreaterThanOrEqual(
            data.value.languages[i + 1].value,
          )
        }
      }
    })
  })

  describe('publicationTimeline', () => {
    test('when publication timeline query succeeds then timeline data is returned', async () => {
      createMockColada(() => useQuery(publicationTimelineQuery()))

      const { data, refresh } = useQuery(publicationTimelineQuery())

      await refresh()
      expect(data.value).toBeDefined()
      expect(Array.isArray(data.value?.timeline)).toBe(true)
      expect(data.value?.totalPublished).toBeGreaterThanOrEqual(0)
    })

    test('timeline is sorted by decade ascending', async () => {
      createMockColada(() => useQuery(publicationTimelineQuery()))

      const { data, refresh } = useQuery(publicationTimelineQuery())

      await refresh()
      if (data.value?.timeline && data.value.timeline.length > 1) {
        for (let i = 0; i < data.value.timeline.length - 1; i++) {
          const currentDecade = parseInt(data.value.timeline[i].decade)
          const nextDecade = parseInt(data.value.timeline[i + 1].decade)
          expect(currentDecade).toBeLessThanOrEqual(nextDecade)
        }
      }
    })
  })

  describe('completionByGenre', () => {
    test('when completion by genre query succeeds then genre completion data is returned', async () => {
      createMockColada(() => useQuery(completionByGenreQuery()))

      const { data, refresh } = useQuery(completionByGenreQuery())

      await refresh()
      expect(data.value).toBeDefined()
      expect(Array.isArray(data.value?.genres)).toBe(true)
      expect(Array.isArray(data.value?.topGenres)).toBe(true)
      expect(Array.isArray(data.value?.bottomGenres)).toBe(true)
    })

    test('genre completion percentages are valid', async () => {
      createMockColada(() => useQuery(completionByGenreQuery()))

      const { data, refresh } = useQuery(completionByGenreQuery())

      await refresh()
      if (data.value?.genres) {
        for (const genre of data.value.genres) {
          expect(genre.completionPercent).toBeGreaterThanOrEqual(0)
          expect(genre.completionPercent).toBeLessThanOrEqual(100)
        }
      }
    })
  })

  describe('userLibraryComparison', () => {
    test('when user library comparison query succeeds then comparison data is returned', async () => {
      createMockColada(() => useQuery(userLibraryComparisonQuery()))

      const { data, refresh } = useQuery(userLibraryComparisonQuery())

      await refresh()
      expect(data.value).toBeDefined()
      expect(data.value?.user).toBeDefined()
      expect(data.value?.library).toBeDefined()
      expect(data.value?.stats).toBeDefined()
    })

    test('comparison data contains valid percentages', async () => {
      createMockColada(() => useQuery(userLibraryComparisonQuery()))

      const { data, refresh } = useQuery(userLibraryComparisonQuery())

      await refresh()
      if (data.value?.user) {
        expect(data.value.user.booksReadPercent).toBeGreaterThanOrEqual(0)
        expect(data.value.user.booksReadPercent).toBeLessThanOrEqual(100)
      }
    })
  })

  describe('readingStreak', () => {
    test('when reading streak query succeeds then streak data is returned', async () => {
      createMockColada(() => useQuery(readingStreakQuery()))

      const { data, refresh } = useQuery(readingStreakQuery())

      await refresh()
      expect(data.value).toBeDefined()
      expect(data.value?.currentStreak).toBeGreaterThanOrEqual(0)
      expect(data.value?.totalActiveDays).toBeGreaterThanOrEqual(0)
    })

    test('current streak is less than or equal to total active days', async () => {
      createMockColada(() => useQuery(readingStreakQuery()))

      const { data, refresh } = useQuery(readingStreakQuery())

      await refresh()
      expect(data.value?.currentStreak).toBeLessThanOrEqual(data.value?.totalActiveDays ?? 0)
    })
  })
})
