import { AxiosInstance } from 'axios'
import { BookDto } from '@/types/komga-books'
import { SeriesDto } from '@/types/komga-series'

export interface RecommendationScore {
  bookId: string
  book: BookDto
  score: number
  reasons: string[]
}

export interface UserPreferences {
  favoriteGenres: Map<string, number>
  favoriteAuthors: Map<string, number>
  favoriteTagss: Map<string, number>
  readSeriesIds: Set<string>
  readBookIds: Set<string>
  averageRating: number
}

export class KomgaRecommendationsService {
  private http: AxiosInstance
  private readonly CACHE_DURATION = 60 * 60 * 1000 // 1 hour
  private cache: Map<string, { data: any; timestamp: number }> = new Map()

  constructor(http: AxiosInstance) {
    this.http = http
  }

  /**
   * Analyze user reading history to build preference profile
   */
  async analyzeUserPreferences(
    readBooks: BookDto[],
    allBooks: BookDto[],
  ): Promise<UserPreferences> {
    const preferences: UserPreferences = {
      favoriteGenres: new Map(),
      favoriteAuthors: new Map(),
      favoriteTagss: new Map(),
      readSeriesIds: new Set(),
      readBookIds: new Set(readBooks.map((b) => b.id)),
      averageRating: 0,
    }

    // Analyze genres from read books
    readBooks.forEach((book) => {
      if (book.metadata?.tags) {
        book.metadata.tags.forEach((tag) => {
          preferences.favoriteTagss.set(tag, (preferences.favoriteTagss.get(tag) || 0) + 1)
        })
      }

      if (book.metadata?.authors) {
        book.metadata.authors.forEach((author) => {
          preferences.favoriteAuthors.set(
            author.name,
            (preferences.favoriteAuthors.get(author.name) || 0) + 1,
          )
        })
      }

      preferences.readSeriesIds.add(book.seriesId)
    })

    // Sort by frequency
    preferences.favoriteGenres = new Map(
      [...preferences.favoriteTagss.entries()].sort((a, b) => b[1] - a[1]),
    )
    preferences.favoriteAuthors = new Map(
      [...preferences.favoriteAuthors.entries()].sort((a, b) => b[1] - a[1]),
    )

    return preferences
  }

  /**
   * Get genre-based recommendations
   */
  async getGenreRecommendations(
    preferences: UserPreferences,
    allBooks: BookDto[],
    limit: number = 10,
  ): Promise<RecommendationScore[]> {
    const recommendations = this.scoreBooks(
      allBooks,
      preferences,
      (book, prefs) => {
        if (!book.metadata?.tags) return 0
        let score = 0
        prefs.favoriteTagss.forEach((count, tag) => {
          if (book.metadata.tags.includes(tag)) {
            score += count * 0.3
          }
        })
        return score
      },
      'You like this genre',
    )

    return recommendations.slice(0, limit)
  }

  /**
   * Get author-based recommendations
   */
  async getAuthorRecommendations(
    preferences: UserPreferences,
    allBooks: BookDto[],
    limit: number = 10,
  ): Promise<RecommendationScore[]> {
    const recommendations = this.scoreBooks(
      allBooks,
      preferences,
      (book, prefs) => {
        if (!book.metadata?.authors) return 0
        let score = 0
        book.metadata.authors.forEach((author) => {
          const authorCount = prefs.favoriteAuthors.get(author.name)
          if (authorCount) {
            score += authorCount * 0.5
          }
        })
        return score
      },
      'By author you love',
    )

    return recommendations.slice(0, limit)
  }

  /**
   * Get series continuation recommendations
   */
  async getSeriesContinuation(
    preferences: UserPreferences,
    allBooks: BookDto[],
    series: Map<string, BookDto[]>,
    limit: number = 10,
  ): Promise<RecommendationScore[]> {
    const recommendations: RecommendationScore[] = []

    preferences.readSeriesIds.forEach((seriesId) => {
      const seriesBooks = series.get(seriesId) || []
      const unreadBooks = seriesBooks.filter((b) => !preferences.readBookIds.has(b.id))

      if (unreadBooks.length > 0) {
        // Get the next unread book in the series
        const nextBook = unreadBooks[0]
        recommendations.push({
          bookId: nextBook.id,
          book: nextBook,
          score: 1.0,
          reasons: ['Continue series you\'re reading'],
        })
      }
    })

    return recommendations.slice(0, limit)
  }

  /**
   * Get books similar to recently read ones
   */
  async getSimilarBooks(
    preferences: UserPreferences,
    allBooks: BookDto[],
    recentBooks: BookDto[],
    limit: number = 10,
  ): Promise<RecommendationScore[]> {
    if (recentBooks.length === 0) return []

    const recommendations = this.scoreBooks(
      allBooks,
      preferences,
      (book, prefs, baseBooks) => {
        let similarityScore = 0

        recentBooks.forEach((recent) => {
          // Genre similarity
          const recentGenres = new Set(recent.metadata?.tags || [])
          if (book.metadata?.tags) {
            const overlap = book.metadata.tags.filter((tag) => recentGenres.has(tag)).length
            similarityScore += (overlap / Math.max(recentGenres.size, 1)) * 0.4
          }

          // Author similarity
          if (book.metadata?.authors && recent.metadata?.authors) {
            const recentAuthors = new Set(recent.metadata.authors.map((a) => a.name))
            const authorOverlap = book.metadata.authors.filter((a) =>
              recentAuthors.has(a.name),
            ).length
            similarityScore += (authorOverlap / Math.max(recentAuthors.size, 1)) * 0.3
          }

          // Tag similarity
          const recentTags = new Set(recent.metadata?.tags || [])
          if (book.metadata?.tags) {
            const tagOverlap = book.metadata.tags.filter((tag) => recentTags.has(tag)).length
            similarityScore += (tagOverlap / Math.max(recentTags.size, 1)) * 0.3
          }
        })

        return similarityScore / recentBooks.length
      },
      'Similar to recent reads',
    )

    return recommendations.slice(0, limit)
  }

  /**
   * Get trending/popular books in library
   */
  async getTrendingBooks(
    preferences: UserPreferences,
    allBooks: BookDto[],
    limit: number = 10,
  ): Promise<RecommendationScore[]> {
    const recommendations = this.scoreBooks(
      allBooks,
      preferences,
      (book, prefs, baseBooks) => {
        // Use number of times a book appears in series read count as proxy for popularity
        const totalBooks = baseBooks.length
        return 1.0 / (totalBooks / 100) // Normalize
      },
      'Popular in library',
    )

    return recommendations.slice(0, limit)
  }

  /**
   * Get new arrivals matching user interests
   */
  async getNewArrivals(
    preferences: UserPreferences,
    allBooks: BookDto[],
    daysOld: number = 30,
    limit: number = 10,
  ): Promise<RecommendationScore[]> {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)
    const newBooks = allBooks.filter((b) => new Date(b.created) > cutoffDate)

    const recommendations = this.scoreBooks(
      newBooks,
      preferences,
      (book, prefs) => {
        let score = 0

        // Match with user's preferred genres
        if (book.metadata?.tags) {
          book.metadata.tags.forEach((tag) => {
            if (prefs.favoriteTagss.has(tag)) {
              score += 0.5
            }
          })
        }

        // Match with user's favorite authors
        if (book.metadata?.authors) {
          book.metadata.authors.forEach((author) => {
            if (prefs.favoriteAuthors.has(author.name)) {
              score += 0.5
            }
          })
        }

        // Boost for very new books
        const daysOldBook = (Date.now() - new Date(book.created).getTime()) / (24 * 60 * 60 * 1000)
        score += Math.max(0, 0.2 * (1 - daysOldBook / daysOld))

        return score
      },
      'New arrival matching interests',
    )

    return recommendations.slice(0, limit)
  }

  /**
   * Core scoring algorithm - weights multiple factors
   */
  private scoreBooks(
    books: BookDto[],
    preferences: UserPreferences,
    customScorer: (
      book: BookDto,
      prefs: UserPreferences,
      allBooks: BookDto[]
    ) => number,
    reason: string,
  ): RecommendationScore[] {
    return books
      .filter((b) => !preferences.readBookIds.has(b.id))
      .map((book) => ({
        bookId: book.id,
        book: book,
        score: customScorer(book, preferences, books),
        reasons: [reason],
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
  }

  /**
   * Get cached recommendations or generate new ones
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  /**
   * Store recommendations in cache
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Clear specific cache entry
   */
  clearCacheEntry(key: string): void {
    this.cache.delete(key)
  }
}
