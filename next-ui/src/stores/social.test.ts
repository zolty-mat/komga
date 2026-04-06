import { beforeEach, describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSocialStore } from './social'

describe('Social Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Ratings', () => {
    it('should set and get book rating', () => {
      const store = useSocialStore()
      store.setBookRating('book-1', 4)
      expect(store.getBookRating('book-1')).toBe(4)
    })

    it('should remove book rating', () => {
      const store = useSocialStore()
      store.setBookRating('book-1', 5)
      store.removeBookRating('book-1')
      expect(store.getBookRating('book-1')).toBeNull()
    })

    it('should handle multiple ratings', () => {
      const store = useSocialStore()
      store.setBookRating('book-1', 4)
      store.setBookRating('book-2', 5)
      store.setBookRating('book-3', 3)

      expect(store.getBookRating('book-1')).toBe(4)
      expect(store.getBookRating('book-2')).toBe(5)
      expect(store.getBookRating('book-3')).toBe(3)
    })

    it('should update existing rating', () => {
      const store = useSocialStore()
      store.setBookRating('book-1', 3)
      store.setBookRating('book-1', 5)
      expect(store.getBookRating('book-1')).toBe(5)
    })
  })

  describe('Reviews', () => {
    it('should add review', () => {
      const store = useSocialStore()
      const review = {
        id: 'review-1',
        bookId: 'book-1',
        title: 'Great Book',
        text: 'This is a great book that I really enjoyed reading.',
        rating: 5,
        author: { id: 'user-1', name: 'John Doe' },
        createdAt: new Date(),
        updatedAt: new Date(),
        helpfulCount: 0,
        isHelpful: false,
        isAuthor: true,
      }

      store.addReview('book-1', review)
      expect(store.getBookReviews('book-1')).toHaveLength(1)
      expect(store.getBookReviews('book-1')[0].id).toBe('review-1')
    })

    it('should add multiple reviews', () => {
      const store = useSocialStore()
      const review1 = {
        id: 'review-1',
        bookId: 'book-1',
        title: 'Great Book',
        text: 'This is great.',
        author: { id: 'user-1', name: 'John' },
        createdAt: new Date(),
        updatedAt: new Date(),
        helpfulCount: 0,
        isHelpful: false,
        isAuthor: true,
      }
      const review2 = {
        id: 'review-2',
        bookId: 'book-1',
        title: 'Good Book',
        text: 'This is good.',
        author: { id: 'user-2', name: 'Jane' },
        createdAt: new Date(),
        updatedAt: new Date(),
        helpfulCount: 5,
        isHelpful: false,
        isAuthor: false,
      }

      store.addReview('book-1', review1)
      store.addReview('book-1', review2)
      expect(store.getBookReviews('book-1')).toHaveLength(2)
    })

    it('should update review', () => {
      const store = useSocialStore()
      const review = {
        id: 'review-1',
        bookId: 'book-1',
        title: 'Great Book',
        text: 'Original text',
        author: { id: 'user-1', name: 'John' },
        createdAt: new Date(),
        updatedAt: new Date(),
        helpfulCount: 0,
        isHelpful: false,
        isAuthor: true,
      }

      store.addReview('book-1', review)
      store.updateReview('book-1', 'review-1', { text: 'Updated text' })

      const updated = store.getBookReviews('book-1')[0]
      expect(updated.text).toBe('Updated text')
    })

    it('should remove review', () => {
      const store = useSocialStore()
      const review = {
        id: 'review-1',
        bookId: 'book-1',
        title: 'Great Book',
        text: 'This is great.',
        author: { id: 'user-1', name: 'John' },
        createdAt: new Date(),
        updatedAt: new Date(),
        helpfulCount: 0,
        isHelpful: false,
        isAuthor: true,
      }

      store.addReview('book-1', review)
      store.removeReview('book-1', 'review-1')
      expect(store.getBookReviews('book-1')).toHaveLength(0)
    })
  })

  describe('Reading Status', () => {
    it('should set reading status', () => {
      const store = useSocialStore()
      store.setReadingStatus('book-1', 'READING')
      expect(store.getReadingStatus('book-1')).toBe('READING')
    })

    it('should set want to read status', () => {
      const store = useSocialStore()
      store.setReadingStatus('book-1', 'WANT_TO_READ')
      expect(store.getReadingStatus('book-1')).toBe('WANT_TO_READ')
    })

    it('should set completed status', () => {
      const store = useSocialStore()
      store.setReadingStatus('book-1', 'COMPLETED')
      expect(store.getReadingStatus('book-1')).toBe('COMPLETED')
    })

    it('should clear reading status', () => {
      const store = useSocialStore()
      store.setReadingStatus('book-1', 'READING')
      store.clearReadingStatus('book-1')
      expect(store.getReadingStatus('book-1')).toBeNull()
    })

    it('should update status for multiple books', () => {
      const store = useSocialStore()
      store.setReadingStatus('book-1', 'READING')
      store.setReadingStatus('book-2', 'WANT_TO_READ')
      store.setReadingStatus('book-3', 'COMPLETED')

      expect(store.getReadingStatus('book-1')).toBe('READING')
      expect(store.getReadingStatus('book-2')).toBe('WANT_TO_READ')
      expect(store.getReadingStatus('book-3')).toBe('COMPLETED')
    })
  })

  describe('Activity Feed', () => {
    it('should add activity item', () => {
      const store = useSocialStore()
      const item = {
        id: 'activity-1',
        userId: 'user-1',
        userName: 'John Doe',
        type: 'RATED' as const,
        bookId: 'book-1',
        bookTitle: 'Great Book',
        ratingValue: 5,
        timestamp: new Date(),
      }

      store.addActivityItem(item)
      expect(store.activityFeed).toHaveLength(1)
      expect(store.activityFeed[0].id).toBe('activity-1')
    })

    it('should set activity feed', () => {
      const store = useSocialStore()
      const items = [
        {
          id: 'activity-1',
          userId: 'user-1',
          userName: 'John',
          type: 'RATED' as const,
          bookId: 'book-1',
          bookTitle: 'Book 1',
          ratingValue: 5,
          timestamp: new Date(),
        },
        {
          id: 'activity-2',
          userId: 'user-2',
          userName: 'Jane',
          type: 'REVIEWED' as const,
          bookId: 'book-2',
          bookTitle: 'Book 2',
          reviewTitle: 'Great!',
          timestamp: new Date(),
        },
      ]

      store.setActivityFeed(items)
      expect(store.activityFeed).toHaveLength(2)
    })

    it('should clear activity feed', () => {
      const store = useSocialStore()
      const item = {
        id: 'activity-1',
        userId: 'user-1',
        userName: 'John',
        type: 'RATED' as const,
        timestamp: new Date(),
      }

      store.addActivityItem(item)
      store.clearActivityFeed()
      expect(store.activityFeed).toHaveLength(0)
    })
  })

  describe('Following', () => {
    it('should follow user', () => {
      const store = useSocialStore()
      const userProfile = {
        id: 'user-1',
        name: 'John Doe',
        isPublic: true,
        followersCount: 100,
        followingCount: 50,
        booksRatedCount: 25,
        reviewsCount: 10,
        isFollowing: false,
      }

      store.followUser(userProfile)
      expect(store.isFollowing('user-1')).toBe(true)
    })

    it('should unfollow user', () => {
      const store = useSocialStore()
      const userProfile = {
        id: 'user-1',
        name: 'John Doe',
        isPublic: true,
        followersCount: 100,
        followingCount: 50,
        booksRatedCount: 25,
        reviewsCount: 10,
        isFollowing: false,
      }

      store.followUser(userProfile)
      store.unfollowUser('user-1')
      expect(store.isFollowing('user-1')).toBe(false)
    })
  })

  describe('User Profiles', () => {
    it('should cache user profile', () => {
      const store = useSocialStore()
      const profile = {
        id: 'user-1',
        name: 'John Doe',
        isPublic: true,
        followersCount: 100,
        followingCount: 50,
        booksRatedCount: 25,
        reviewsCount: 10,
        isFollowing: false,
      }

      store.cacheUserProfile(profile)
      expect(store.getUserProfile('user-1')).toEqual(profile)
    })
  })

  describe('Shares', () => {
    it('should share book with users', () => {
      const store = useSocialStore()
      store.shareBook('book-1', ['user-1', 'user-2', 'user-3'])
      expect(store.shares['book-1']).toEqual(['user-1', 'user-2', 'user-3'])
    })

    it('should share with different users per book', () => {
      const store = useSocialStore()
      store.shareBook('book-1', ['user-1', 'user-2'])
      store.shareBook('book-2', ['user-3', 'user-4'])

      expect(store.shares['book-1']).toEqual(['user-1', 'user-2'])
      expect(store.shares['book-2']).toEqual(['user-3', 'user-4'])
    })
  })

  describe('Getters', () => {
    it('should calculate average rating', () => {
      const store = useSocialStore()
      store.addReview('book-1', {
        id: 'review-1',
        bookId: 'book-1',
        title: 'Great',
        text: 'Great book',
        rating: 5,
        author: { id: 'user-1', name: 'John' },
        createdAt: new Date(),
        updatedAt: new Date(),
        helpfulCount: 0,
        isHelpful: false,
        isAuthor: true,
      })
      store.addReview('book-1', {
        id: 'review-2',
        bookId: 'book-1',
        title: 'Good',
        text: 'Good book',
        rating: 3,
        author: { id: 'user-2', name: 'Jane' },
        createdAt: new Date(),
        updatedAt: new Date(),
        helpfulCount: 0,
        isHelpful: false,
        isAuthor: false,
      })

      expect(store.getAverageRating('book-1')).toBe(4)
    })

    it('should get reading statistics', () => {
      const store = useSocialStore()
      store.setReadingStatus('book-1', 'WANT_TO_READ')
      store.setReadingStatus('book-2', 'READING')
      store.setReadingStatus('book-3', 'READING')
      store.setReadingStatus('book-4', 'COMPLETED')

      const stats = store.$state.readingStatus
      let wantToRead = 0
      let reading = 0
      let completed = 0
      Object.values(stats).forEach((s) => {
        if (s.status === 'WANT_TO_READ') wantToRead++
        else if (s.status === 'READING') reading++
        else if (s.status === 'COMPLETED') completed++
      })
      expect(wantToRead).toBe(1)
      expect(reading).toBe(2)
      expect(completed).toBe(1)
    })
  })

  describe('Reset', () => {
    it('should reset all state', () => {
      const store = useSocialStore()
      store.setBookRating('book-1', 5)
      store.addActivityItem({
        id: 'activity-1',
        userId: 'user-1',
        userName: 'John',
        type: 'RATED' as const,
        timestamp: new Date(),
      })
      store.setReadingStatus('book-1', 'READING')

      store.reset()

      expect(store.ratings).toEqual({})
      expect(store.activityFeed).toEqual([])
      expect(store.readingStatus).toEqual({})
    })
  })
})
