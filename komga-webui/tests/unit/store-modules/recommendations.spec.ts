import Vuex, { Store } from 'vuex'
import Vue from 'vue'
import recommendations from '@/store-modules/recommendations'
import { RecommendationScore } from '@/services/komga-recommendations.service'
import { ContextOrigin } from '@/types/context'

Vue.use(Vuex)

describe('recommendations store module', () => {
  let store: Store<any>

  const createMockRecommendation = (id: string, score = 0.8): RecommendationScore => ({
    bookId: id,
    book: {
      id,
      seriesId: `series-${id}`,
      seriesTitle: 'Test Series',
      libraryId: 'lib-1',
      name: `Book ${id}`,
      url: `/books/${id}`,
      number: 1,
      created: new Date(),
      lastModified: new Date(),
      sizeBytes: 1000,
      size: '1MB',
      media: {
        status: 'READY',
        mediaType: 'application/pdf',
        pagesCount: 100,
        comment: '',
        mediaProfile: '',
        epubDivinaCompatible: false,
        epubIsKepub: false,
      },
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        title: `Book ${id}`,
        titleLock: false,
        summary: 'Summary',
        summaryLock: false,
        number: '1',
        numberLock: false,
        numberSort: 1,
        numberSortLock: false,
        releaseDate: new Date().toISOString(),
        releaseDateLock: false,
        authors: [],
        authorsLock: false,
        tags: [],
        tagsLock: false,
        isbn: '',
        isbnLock: false,
      },
      deleted: false,
      oneshot: false,
      context: {
        origin: ContextOrigin.LIBRARY,
        id: 'lib-1',
      },
    },
    score,
    reasons: ['Test reason'],
  })

  beforeEach(() => {
    store = new Store({
      modules: {
        recommendations,
      },
    })
  })

  describe('getters', () => {
    it('should return recommendations by type', () => {
      const recs = [createMockRecommendation('1'), createMockRecommendation('2')]
      store.commit('recommendations/setRecommendations', { type: 'genres', data: recs })

      const result = store.getters['recommendations/getRecommendations']('genres')
      expect(result).toEqual(recs)
    })

    it('should check if book is hidden', () => {
      store.commit('recommendations/hideBook', 'book-1')

      expect(store.getters['recommendations/isBookHidden']('book-1')).toBe(true)
      expect(store.getters['recommendations/isBookHidden']('book-2')).toBe(false)
    })

    it('should return visible recommendations excluding hidden books', () => {
      const recs = [createMockRecommendation('1'), createMockRecommendation('2')]
      store.commit('recommendations/setRecommendations', { type: 'genres', data: recs })
      store.commit('recommendations/hideBook', '1')

      const result = store.getters['recommendations/getVisibleRecommendations']('genres')
      expect(result.length).toBe(1)
      expect(result[0].bookId).toBe('2')
    })

    it('should get book feedback rating', () => {
      store.commit('recommendations/rateRecommendation', { bookId: 'book-1', rating: 1 })

      const feedback = store.getters['recommendations/getBookFeedback']('book-1')
      expect(feedback).toBe(1)
    })

    it('should check if user has favorite genres', () => {
      const prefs = {
        favoriteGenres: new Map([['Fantasy', 2]]),
        favoriteAuthors: new Map(),
        favoriteTagss: new Map(),
        readSeriesIds: new Set(),
        readBookIds: new Set(),
        averageRating: 0,
      }

      store.commit('recommendations/setUserPreferences', prefs)

      expect(store.getters['recommendations/hasFavoriteGenres']).toBe(true)
    })

    it('should check if user has read history', () => {
      const prefs = {
        favoriteGenres: new Map(),
        favoriteAuthors: new Map(),
        favoriteTagss: new Map(),
        readSeriesIds: new Set(),
        readBookIds: new Set(['book-1']),
        averageRating: 0,
      }

      store.commit('recommendations/setUserPreferences', prefs)

      expect(store.getters['recommendations/hasReadHistory']).toBe(true)
    })

    it('should return recommendation stats', () => {
      const recs1 = [createMockRecommendation('1'), createMockRecommendation('2')]
      const recs2 = [createMockRecommendation('3')]

      store.commit('recommendations/setRecommendations', { type: 'genres', data: recs1 })
      store.commit('recommendations/setRecommendations', { type: 'authors', data: recs2 })
      store.commit('recommendations/markAsViewed', '2')

      const stats = store.getters['recommendations/recommendationStats']
      expect(stats.totalRecommendations).toBe(3)
      expect(stats.viewedCount).toBe(1)
    })
  })

  describe('mutations', () => {
    it('should set recommendations', () => {
      const recs = [createMockRecommendation('1')]
      store.commit('recommendations/setRecommendations', { type: 'genres', data: recs })

      expect(store.state.recommendations.recommendations['genres']).toEqual(recs)
    })

    it('should add recommendations', () => {
      const recs1 = [createMockRecommendation('1')]
      const recs2 = [createMockRecommendation('2')]

      store.commit('recommendations/setRecommendations', { type: 'genres', data: recs1 })
      store.commit('recommendations/addRecommendations', { type: 'genres', data: recs2 })

      expect(store.state.recommendations.recommendations['genres'].length).toBe(2)
    })

    it('should clear all recommendations', () => {
      const recs = [createMockRecommendation('1')]
      store.commit('recommendations/setRecommendations', { type: 'genres', data: recs })
      store.commit('recommendations/setRecommendations', { type: 'authors', data: recs })

      store.commit('recommendations/clearRecommendations')

      expect(Object.keys(store.state.recommendations.recommendations).length).toBe(0)
    })

    it('should clear specific recommendation type', () => {
      const recs = [createMockRecommendation('1')]
      store.commit('recommendations/setRecommendations', { type: 'genres', data: recs })
      store.commit('recommendations/setRecommendations', { type: 'authors', data: recs })

      store.commit('recommendations/clearRecommendations', 'genres')

      expect(store.state.recommendations.recommendations['genres']).toBeUndefined()
      expect(store.state.recommendations.recommendations['authors']).toBeDefined()
    })

    it('should hide book and remove from all lists', () => {
      const recs = [createMockRecommendation('1'), createMockRecommendation('2')]
      store.commit('recommendations/setRecommendations', { type: 'genres', data: recs })
      store.commit('recommendations/setRecommendations', { type: 'authors', data: recs })

      store.commit('recommendations/hideBook', '1')

      expect(store.state.recommendations.hiddenBooks.has('1')).toBe(true)
      expect(store.state.recommendations.recommendations['genres'].some((r: any) => r.bookId === '1')).toBe(
        false,
      )
      expect(store.state.recommendations.recommendations['authors'].some((r: any) => r.bookId === '1')).toBe(
        false,
      )
    })

    it('should unhide book', () => {
      store.commit('recommendations/hideBook', 'book-1')
      expect(store.state.recommendations.hiddenBooks.has('book-1')).toBe(true)

      store.commit('recommendations/unhideBook', 'book-1')
      expect(store.state.recommendations.hiddenBooks.has('book-1')).toBe(false)
    })

    it('should mark book as viewed', () => {
      store.commit('recommendations/markAsViewed', 'book-1')

      expect(store.state.recommendations.viewedRecommendations.has('book-1')).toBe(true)
    })

    it('should rate recommendation', () => {
      store.commit('recommendations/rateRecommendation', { bookId: 'book-1', rating: 1 })

      expect(store.state.recommendations.feedback.length).toBe(1)
      expect(store.state.recommendations.feedback[0].bookId).toBe('book-1')
      expect(store.state.recommendations.feedback[0].rating).toBe(1)
    })

    it('should update existing rating', () => {
      store.commit('recommendations/rateRecommendation', { bookId: 'book-1', rating: 1 })
      store.commit('recommendations/rateRecommendation', { bookId: 'book-1', rating: -1 })

      expect(store.state.recommendations.feedback.length).toBe(1)
      expect(store.state.recommendations.feedback[0].rating).toBe(-1)
    })

    it('should update settings', () => {
      store.commit('recommendations/updatePreferences', { enableGenreRecommendations: false })

      expect(store.state.recommendations.settings.enableGenreRecommendations).toBe(false)
      expect(store.state.recommendations.settings.enableAuthorRecommendations).toBe(true)
    })

    it('should clear hidden books', () => {
      store.commit('recommendations/hideBook', 'book-1')
      store.commit('recommendations/hideBook', 'book-2')

      store.commit('recommendations/clearHidden')

      expect(store.state.recommendations.hiddenBooks.size).toBe(0)
    })

    it('should clear feedback', () => {
      store.commit('recommendations/rateRecommendation', { bookId: 'book-1', rating: 1 })

      store.commit('recommendations/clearFeedback')

      expect(store.state.recommendations.feedback.length).toBe(0)
    })
  })

  describe('actions', () => {
    it('should hide book', async () => {
      await store.dispatch('recommendations/hideBook', 'book-1')

      expect(store.state.recommendations.hiddenBooks.has('book-1')).toBe(true)
    })

    it('should restore book', async () => {
      store.commit('recommendations/hideBook', 'book-1')

      await store.dispatch('recommendations/restoreBook', 'book-1')

      expect(store.state.recommendations.hiddenBooks.has('book-1')).toBe(false)
    })

    it('should mark as viewed', async () => {
      await store.dispatch('recommendations/markViewed', 'book-1')

      expect(store.state.recommendations.viewedRecommendations.has('book-1')).toBe(true)
    })

    it('should rate recommendation', async () => {
      await store.dispatch('recommendations/rateRecommendation', { bookId: 'book-1', rating: 1 })

      expect(store.state.recommendations.feedback.length).toBe(1)
    })

    it('should update settings', async () => {
      await store.dispatch('recommendations/updateSettings', { enableGenreRecommendations: false })

      expect(store.state.recommendations.settings.enableGenreRecommendations).toBe(false)
    })

    it('should clear all data', async () => {
      store.commit('recommendations/setRecommendations', {
        type: 'genres',
        data: [createMockRecommendation('1')],
      })
      store.commit('recommendations/hideBook', 'book-1')
      store.commit('recommendations/markAsViewed', 'book-2')
      store.commit('recommendations/rateRecommendation', { bookId: 'book-3', rating: 1 })

      await store.dispatch('recommendations/clearAll')

      expect(Object.keys(store.state.recommendations.recommendations).length).toBe(0)
      expect(store.state.recommendations.hiddenBooks.size).toBe(0)
      expect(store.state.recommendations.viewedRecommendations.size).toBe(0)
      expect(store.state.recommendations.feedback.length).toBe(0)
    })

    it('should reset preferences', async () => {
      const prefs = {
        favoriteGenres: new Map([['Fantasy', 2]]),
        favoriteAuthors: new Map(),
        favoriteTagss: new Map(),
        readSeriesIds: new Set(),
        readBookIds: new Set(),
        averageRating: 0,
      }

      store.commit('recommendations/setUserPreferences', prefs)
      store.commit('recommendations/setRecommendations', {
        type: 'genres',
        data: [createMockRecommendation('1')],
      })

      await store.dispatch('recommendations/resetPreferences')

      expect(store.state.recommendations.userPreferences).toBeNull()
      expect(Object.keys(store.state.recommendations.recommendations).length).toBe(0)
    })
  })
})
