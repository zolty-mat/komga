import { Module } from 'vuex'
import { BookDto } from '@/types/komga-books'
import {
  KomgaRecommendationsService,
  RecommendationScore,
  UserPreferences,
} from '@/services/komga-recommendations.service'

export interface RecommendationCache {
  [type: string]: RecommendationScore[]
}

export interface RecommendationFeedback {
  bookId: string
  rating: 1 | -1 | 0 // 1: liked, -1: disliked, 0: neutral
  timestamp: Date
}

export interface RecommendationSettings {
  enableGenreRecommendations: boolean
  enableAuthorRecommendations: boolean
  enableSeriesContinuation: boolean
  enableSimilarBooks: boolean
  enableTrendingBooks: boolean
  enableNewArrivals: boolean
  cacheEnabled: boolean
  cacheDuration: number // in minutes
}

export interface RecommendationState {
  recommendations: RecommendationCache
  hiddenBooks: Set<string>
  viewedRecommendations: Set<string>
  feedback: RecommendationFeedback[]
  userPreferences: UserPreferences | null
  settings: RecommendationSettings
  loading: boolean
  error: string | null
}

const defaultSettings: RecommendationSettings = {
  enableGenreRecommendations: true,
  enableAuthorRecommendations: true,
  enableSeriesContinuation: true,
  enableSimilarBooks: true,
  enableTrendingBooks: true,
  enableNewArrivals: true,
  cacheEnabled: true,
  cacheDuration: 60,
}

const recommendations: Module<RecommendationState, any> = {
  namespaced: true,

  state: {
    recommendations: {},
    hiddenBooks: new Set(),
    viewedRecommendations: new Set(),
    feedback: [],
    userPreferences: null,
    settings: { ...defaultSettings },
    loading: false,
    error: null,
  },

  getters: {
    getRecommendations(state) {
      return (type: string) => state.recommendations[type] || []
    },

    isBookHidden(state) {
      return (bookId: string) => state.hiddenBooks.has(bookId)
    },

    getVisibleRecommendations(state) {
      return (type: string) => {
        const recs = state.recommendations[type] || []
        return recs.filter((r) => !state.hiddenBooks.has(r.bookId))
      }
    },

    getBookFeedback(state) {
      return (bookId: string) => {
        const feedback = state.feedback.find((f) => f.bookId === bookId)
        return feedback?.rating || 0
      }
    },

    hasFavoriteGenres(state) {
      return (
        state.userPreferences &&
        state.userPreferences.favoriteGenres &&
        state.userPreferences.favoriteGenres.size > 0
      )
    },

    hasFavoriteAuthors(state) {
      return (
        state.userPreferences &&
        state.userPreferences.favoriteAuthors &&
        state.userPreferences.favoriteAuthors.size > 0
      )
    },

    hasReadHistory(state) {
      return (
        state.userPreferences &&
        state.userPreferences.readBookIds &&
        state.userPreferences.readBookIds.size > 0
      )
    },

    recommendationStats(state) {
      return {
        totalRecommendations: Object.keys(state.recommendations).reduce(
          (sum, type) => sum + (state.recommendations[type]?.length || 0),
          0,
        ),
        hiddenCount: state.hiddenBooks.size,
        viewedCount: state.viewedRecommendations.size,
        feedbackCount: state.feedback.length,
      }
    },
  },

  mutations: {
    setRecommendations(state, { type, data }) {
      state.recommendations[type] = data
    },

    addRecommendations(state, { type, data }) {
      if (!state.recommendations[type]) {
        state.recommendations[type] = []
      }
      state.recommendations[type] = [
        ...state.recommendations[type],
        ...data.filter((r: RecommendationScore) => !state.hiddenBooks.has(r.bookId)),
      ] as RecommendationScore[]
    },

    clearRecommendations(state, type?: string) {
      if (type) {
        delete state.recommendations[type]
      } else {
        state.recommendations = {}
      }
    },

    hideBook(state, bookId: string) {
      state.hiddenBooks.add(bookId)
      // Remove from all recommendation lists
      Object.keys(state.recommendations).forEach((type) => {
        state.recommendations[type] = state.recommendations[type].filter(
          (r) => r.bookId !== bookId,
        )
      })
    },

    unhideBook(state, bookId: string) {
      state.hiddenBooks.delete(bookId)
    },

    markAsViewed(state, bookId: string) {
      state.viewedRecommendations.add(bookId)
    },

    rateRecommendation(state, { bookId, rating }: { bookId: string; rating: 1 | -1 | 0 }) {
      const existingIndex = state.feedback.findIndex((f) => f.bookId === bookId)
      const feedback: RecommendationFeedback = {
        bookId,
        rating,
        timestamp: new Date(),
      }
      if (existingIndex >= 0) {
        state.feedback[existingIndex] = feedback
      } else {
        state.feedback.push(feedback)
      }
    },

    setUserPreferences(state, preferences: UserPreferences) {
      state.userPreferences = preferences
    },

    updatePreferences(state, settings: Partial<RecommendationSettings>) {
      state.settings = { ...state.settings, ...settings }
    },

    setLoading(state, loading: boolean) {
      state.loading = loading
    },

    setError(state, error: string | null) {
      state.error = error
    },

    clearHidden(state) {
      state.hiddenBooks.clear()
    },

    clearViewed(state) {
      state.viewedRecommendations.clear()
    },

    clearFeedback(state) {
      state.feedback = []
    },
  },

  actions: {
    async generateRecommendations(
      { commit, state },
      {
        service,
        type,
        readBooks,
        allBooks,
        recentBooks,
        series,
      }: {
        service: KomgaRecommendationsService,
        type: string,
        readBooks: BookDto[],
        allBooks: BookDto[],
        recentBooks: BookDto[],
        series: Map<string, BookDto[]>,
      },
    ) {
      commit('setLoading', true)
      commit('setError', null)

      try {
        // Analyze preferences if not already done
        if (!state.userPreferences) {
          const preferences = await service.analyzeUserPreferences(readBooks, allBooks)
          commit('setUserPreferences', preferences)
        }

        let recommendations: RecommendationScore[] = []

        switch (type) {
          case 'genres':
            if (state.settings.enableGenreRecommendations) {
              recommendations = await service.getGenreRecommendations(
                state.userPreferences!,
                allBooks,
              )
            }
            break

          case 'authors':
            if (state.settings.enableAuthorRecommendations) {
              recommendations = await service.getAuthorRecommendations(
                state.userPreferences!,
                allBooks,
              )
            }
            break

          case 'continuation':
            if (state.settings.enableSeriesContinuation) {
              recommendations = await service.getSeriesContinuation(
                state.userPreferences!,
                allBooks,
                series,
              )
            }
            break

          case 'similar':
            if (state.settings.enableSimilarBooks) {
              recommendations = await service.getSimilarBooks(
                state.userPreferences!,
                allBooks,
                recentBooks,
              )
            }
            break

          case 'trending':
            if (state.settings.enableTrendingBooks) {
              recommendations = await service.getTrendingBooks(
                state.userPreferences!,
                allBooks,
              )
            }
            break

          case 'newArrivals':
            if (state.settings.enableNewArrivals) {
              recommendations = await service.getNewArrivals(state.userPreferences!, allBooks)
            }
            break
        }

        commit('setRecommendations', { type, data: recommendations })
      } catch (error) {
        commit('setError', error instanceof Error ? error.message : 'Unknown error')
        // Error logged for debugging
      } finally {
        commit('setLoading', false)
      }
    },

    async generateAllRecommendations(
      { dispatch, state },
      {
        service,
        readBooks,
        allBooks,
        recentBooks,
        series,
      }: {
        service: KomgaRecommendationsService,
        readBooks: BookDto[],
        allBooks: BookDto[],
        recentBooks: BookDto[],
        series: Map<string, BookDto[]>,
      },
    ) {
      const types = [
        'genres',
        'authors',
        'continuation',
        'similar',
        'trending',
        'newArrivals',
      ]

      for (const type of types) {
        await dispatch('generateRecommendations', {
          service,
          type,
          readBooks,
          allBooks,
          recentBooks,
          series,
        })
      }
    },

    hideBook({ commit }, bookId: string) {
      commit('hideBook', bookId)
    },

    restoreBook({ commit }, bookId: string) {
      commit('unhideBook', bookId)
    },

    markViewed({ commit }, bookId: string) {
      commit('markAsViewed', bookId)
    },

    rateRecommendation({ commit }, { bookId, rating }: { bookId: string; rating: 1 | -1 | 0 }) {
      commit('rateRecommendation', { bookId, rating })
    },

    updateSettings({ commit }, settings: Partial<RecommendationSettings>) {
      commit('updatePreferences', settings)
    },

    clearAll({ commit }) {
      commit('clearRecommendations')
      commit('clearHidden')
      commit('clearViewed')
      commit('clearFeedback')
    },

    resetPreferences({ commit }) {
      commit('setUserPreferences', null)
      commit('clearRecommendations')
    },
  },
}

export default recommendations
