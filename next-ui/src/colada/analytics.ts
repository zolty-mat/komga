import { defineQueryOptions } from '@pinia/colada'
import { komgaClient } from '@/api/komga-client'

/**
 * Comprehensive library and reading analytics queries
 * Aggregates data from series, books, and reading history for dashboard insights
 */

// Library-wide statistics
export const libraryStatsQuery = defineQueryOptions(() => ({
  key: ['libraryStats'],
  query: async () => {
    const seriesResponse = await komgaClient.POST('/api/v1/series/list', {
      params: {
        query: { page: 0, size: 10000 },
      },
      body: {},
    })

    const booksResponse = await komgaClient.POST('/api/v1/books/list', {
      params: {
        query: { page: 0, size: 10000 },
      },
      body: {},
    })

    const series = seriesResponse.data?.content ?? []
    const books = booksResponse.data?.content ?? []

    const totalSeries = series.length
    const totalBooks = books.length
    const booksRead = books.filter((b: any) => b.readProgress?.some((p: any) => p.completed)).length
    const seriesWithProgress = series.filter((s: any) => s.booksReadCount > 0).length
    const completionRate = totalBooks > 0 ? Math.round((booksRead / totalBooks) * 100) : 0
    const unreadBooks = totalBooks - booksRead

    // Calculate average series length
    const avgSeriesLength = totalSeries > 0 ? Math.round(totalBooks / totalSeries * 10) / 10 : 0

    return {
      totalSeries,
      totalBooks,
      booksRead,
      seriesWithProgress,
      completionRate,
      unreadBooks,
      avgSeriesLength,
    }
  },
  placeholderData: (previousData) => previousData,
}))

// Genre distribution statistics
export const genreStatsQuery = defineQueryOptions(() => ({
  key: ['genreStats'],
  query: async () => {
    const booksResponse = await komgaClient.POST('/api/v1/books/list', {
      params: {
        query: { page: 0, size: 10000 },
      },
      body: {},
    })

    const books = booksResponse.data?.content ?? []
    const genreMap = new Map<string, { count: number; read: number }>()

    for (const book of books) {
      // Genres can be in metadata.genres array
      const genres = (book.metadata?.genres as string[]) ?? []
      const isRead = book.readProgress?.some((p: any) => p.completed) ?? false

      for (const genre of genres) {
        const current = genreMap.get(genre) ?? { count: 0, read: 0 }
        current.count++
        if (isRead) current.read++
        genreMap.set(genre, current)
      }
    }

    const genreData = Array.from(genreMap.entries())
      .map(([genre, { count, read }]) => ({
        name: genre,
        value: count,
        read,
        unread: count - read,
        readPercent: count > 0 ? Math.round((read / count) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value)

    return {
      genres: genreData,
      topGenres: genreData.slice(0, 5),
      totalGenres: genreMap.size,
    }
  },
  placeholderData: (previousData) => previousData,
}))

// Author statistics
export const authorStatsQuery = defineQueryOptions(() => ({
  key: ['authorStats'],
  query: async () => {
    const booksResponse = await komgaClient.POST('/api/v1/books/list', {
      params: {
        query: { page: 0, size: 10000 },
      },
      body: {},
    })

    const books = booksResponse.data?.content ?? []
    const authorMap = new Map<string, { count: number; read: number; books: any[] }>()

    for (const book of books) {
      const authors = (book.metadata?.authors as any[]) ?? []
      const isRead = book.readProgress?.some((p: any) => p.completed) ?? false

      for (const author of authors) {
        const authorName = typeof author === 'string' ? author : author.name ?? 'Unknown'
        const current = authorMap.get(authorName) ?? { count: 0, read: 0, books: [] }
        current.count++
        if (isRead) current.read++
        current.books.push({
          id: book.id,
          name: book.metadata?.title ?? book.name,
          read: isRead,
        })
        authorMap.set(authorName, current)
      }
    }

    const authorData = Array.from(authorMap.entries())
      .map(([name, { count, read, books }]) => ({
        name,
        totalBooks: count,
        booksRead: read,
        completionPercent: count > 0 ? Math.round((read / count) * 100) : 0,
        books,
      }))
      .sort((a, b) => b.totalBooks - a.totalBooks)

    return {
      authors: authorData,
      topAuthors: authorData.slice(0, 10),
      totalAuthors: authorMap.size,
    }
  },
  placeholderData: (previousData) => previousData,
}))

// Publisher statistics
export const publisherStatsQuery = defineQueryOptions(() => ({
  key: ['publisherStats'],
  query: async () => {
    const booksResponse = await komgaClient.POST('/api/v1/books/list', {
      params: {
        query: { page: 0, size: 10000 },
      },
      body: {},
    })

    const books = booksResponse.data?.content ?? []
    const publisherMap = new Map<string, { count: number; read: number }>()

    for (const book of books) {
      const publisher = (book.metadata?.publisher as string) ?? 'Unknown Publisher'
      const isRead = book.readProgress?.some((p: any) => p.completed) ?? false

      const current = publisherMap.get(publisher) ?? { count: 0, read: 0 }
      current.count++
      if (isRead) current.read++
      publisherMap.set(publisher, current)
    }

    const publisherData = Array.from(publisherMap.entries())
      .map(([name, { count, read }]) => ({
        name,
        totalBooks: count,
        booksRead: read,
        completionPercent: count > 0 ? Math.round((read / count) * 100) : 0,
      }))
      .sort((a, b) => b.totalBooks - a.totalBooks)

    return {
      publishers: publisherData,
      topPublishers: publisherData.slice(0, 10),
      totalPublishers: publisherMap.size,
    }
  },
  placeholderData: (previousData) => previousData,
}))

// Language distribution
export const languageStatsQuery = defineQueryOptions(() => ({
  key: ['languageStats'],
  query: async () => {
    const booksResponse = await komgaClient.POST('/api/v1/books/list', {
      params: {
        query: { page: 0, size: 10000 },
      },
      body: {},
    })

    const books = booksResponse.data?.content ?? []
    const languageMap = new Map<string, { count: number; read: number }>()

    for (const book of books) {
      const language = (book.metadata?.language as string) ?? 'Unknown'
      const isRead = book.readProgress?.some((p: any) => p.completed) ?? false

      const current = languageMap.get(language) ?? { count: 0, read: 0 }
      current.count++
      if (isRead) current.read++
      languageMap.set(language, current)
    }

    const languageData = Array.from(languageMap.entries())
      .map(([name, { count, read }]) => ({
        name,
        value: count,
        read,
        unread: count - read,
      }))
      .sort((a, b) => b.value - a.value)

    return {
      languages: languageData,
      totalLanguages: languageMap.size,
    }
  },
  placeholderData: (previousData) => previousData,
}))

// Publication timeline - books by decade
export const publicationTimelineQuery = defineQueryOptions(() => ({
  key: ['publicationTimeline'],
  query: async () => {
    const booksResponse = await komgaClient.POST('/api/v1/books/list', {
      params: {
        query: { page: 0, size: 10000 },
      },
      body: {},
    })

    const books = booksResponse.data?.content ?? []
    const decadeMap = new Map<string, number>()
    const publishedBooks: any[] = []

    for (const book of books) {
      const releaseDate = book.metadata?.releaseDate
      if (releaseDate) {
        const date = new Date(releaseDate)
        const year = date.getFullYear()
        const decade = `${Math.floor(year / 10) * 10}s`

        decadeMap.set(decade, (decadeMap.get(decade) ?? 0) + 1)
        publishedBooks.push({
          name: book.metadata?.title ?? book.name,
          year,
          decade,
        })
      }
    }

    const timeline = Array.from(decadeMap.entries())
      .map(([decade, count]) => ({
        decade,
        count,
      }))
      .sort((a, b) => a.decade.localeCompare(b.decade))

    const oldestYear = publishedBooks.length > 0
      ? Math.min(...publishedBooks.map(b => b.year))
      : null
    const newestYear = publishedBooks.length > 0
      ? Math.max(...publishedBooks.map(b => b.year))
      : null

    return {
      timeline,
      totalPublished: publishedBooks.length,
      oldestYear,
      newestYear,
      books: publishedBooks.sort((a, b) => a.year - b.year),
    }
  },
  placeholderData: (previousData) => previousData,
}))

// Completion rate by genre
export const completionByGenreQuery = defineQueryOptions(() => ({
  key: ['completionByGenre'],
  query: async () => {
    const booksResponse = await komgaClient.POST('/api/v1/books/list', {
      params: {
        query: { page: 0, size: 10000 },
      },
      body: {},
    })

    const books = booksResponse.data?.content ?? []
    const genreMap = new Map<string, { total: number; completed: number }>()

    for (const book of books) {
      const genres = (book.metadata?.genres as string[]) ?? []
      const isRead = book.readProgress?.some((p: any) => p.completed) ?? false

      for (const genre of genres) {
        const current = genreMap.get(genre) ?? { total: 0, completed: 0 }
        current.total++
        if (isRead) current.completed++
        genreMap.set(genre, current)
      }
    }

    const completionData = Array.from(genreMap.entries())
      .map(([genre, { total, completed }]) => ({
        name: genre,
        total,
        completed,
        unread: total - completed,
        completionPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
      }))
      .sort((a, b) => b.completionPercent - a.completionPercent)

    return {
      genres: completionData,
      topGenres: completionData.slice(0, 10),
      bottomGenres: completionData.slice(-5).reverse(),
    }
  },
  placeholderData: (previousData) => previousData,
}))

// User progress comparison
export const userLibraryComparisonQuery = defineQueryOptions(() => ({
  key: ['userLibraryComparison'],
  query: async () => {
    const seriesResponse = await komgaClient.GET('/api/v1/series', {
      params: {
        query: { page: 0, size: 10000 },
      },
    })

    const booksResponse = await komgaClient.POST('/api/v1/books/list', {
      params: {
        query: { page: 0, size: 10000 },
      },
      body: {},
    })

    const series = seriesResponse.data?.content ?? []
    const books = booksResponse.data?.content ?? []

    const totalBooks = books.length
    const totalSeries = series.length
    const booksRead = books.filter((b: any) => b.readProgress?.some((p: any) => p.completed)).length
    const seriesStarted = series.filter((s: any) => s.booksReadCount > 0).length
    const seriesCompleted = series.filter((s: any) => s.booksReadCount === s.booksCount).length

    const userProgress = {
      booksReadPercent: totalBooks > 0 ? Math.round((booksRead / totalBooks) * 100) : 0,
      seriesStartedPercent: totalSeries > 0 ? Math.round((seriesStarted / totalSeries) * 100) : 0,
      seriesCompletedPercent: totalSeries > 0 ? Math.round((seriesCompleted / totalSeries) * 100) : 0,
    }

    // Global/library averages (mock values)
    const libraryAverages = {
      booksReadPercent: 35,
      seriesStartedPercent: 40,
      seriesCompletedPercent: 15,
    }

    return {
      user: userProgress,
      library: libraryAverages,
      stats: {
        booksRead,
        totalBooks,
        seriesCompleted,
        totalSeries,
        seriesStarted,
      },
    }
  },
  placeholderData: (previousData) => previousData,
}))

// Reading streak and activity
export const readingStreakQuery = defineQueryOptions(() => ({
  key: ['readingStreak'],
  query: async () => {
    const seriesResponse = await komgaClient.POST('/api/v1/series/list', {
      params: {
        query: { page: 0, size: 10000 },
      },
      body: {},
    })

    const series = seriesResponse.data?.content ?? []
    const dateSet = new Set<string>()

    for (const s of series) {
      if (s.lastModified && s.booksReadCount > 0) {
        const date = new Date(s.lastModified).toISOString().split('T')[0]
        dateSet.add(date)
      }
    }

    // Calculate current streak (last consecutive days with activity)
    const sortedDates = Array.from(dateSet).sort().reverse()
    let currentStreak = 0

    if (sortedDates.length > 0) {
      const today = new Date().toISOString().split('T')[0]
      let lastDate = today

      for (const date of sortedDates) {
        const lastDateObj = new Date(lastDate)
        const currentDateObj = new Date(date)
        const dayDiff = Math.floor((lastDateObj.getTime() - currentDateObj.getTime()) / (1000 * 60 * 60 * 24))

        if (dayDiff === 0 || dayDiff === 1) {
          currentStreak++
          lastDate = date
        } else {
          break
        }
      }
    }

    return {
      currentStreak,
      totalActiveDays: dateSet.size,
      lastActivityDate: sortedDates[0] ?? null,
    }
  },
  placeholderData: (previousData) => previousData,
}))
