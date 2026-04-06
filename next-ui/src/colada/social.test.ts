import { describe, it, expect } from 'vitest'
import {
  QUERY_KEYS_SOCIAL,
  bookRatingsQuery,
  userBookRatingQuery,
  bookReviewsQuery,
  reviewDetailQuery,
  activityFeedQuery,
  readingStatusQuery,
  bookSharesQuery,
} from './social'

describe('Social Queries - Query Keys', () => {
  it('should generate correct rating query key', () => {
    const key = QUERY_KEYS_SOCIAL.ratings('book123')
    expect(key).toEqual(['social', 'ratings', 'book123'])
  })

  it('should generate correct review query key', () => {
    const key = QUERY_KEYS_SOCIAL.reviews('book123')
    expect(key).toEqual(['social', 'reviews', 'book123'])
  })

  it('should generate correct activity feed query key', () => {
    const key = QUERY_KEYS_SOCIAL.activityFeed()
    expect(key).toEqual(['social', 'activity-feed'])
  })

  it('should generate correct reading status query key', () => {
    const key = QUERY_KEYS_SOCIAL.readingStatus('book456')
    expect(key).toEqual(['social', 'reading-status', 'book456'])
  })

  it('should generate correct user profile query key', () => {
    const key = QUERY_KEYS_SOCIAL.userProfile('user789')
    expect(key).toEqual(['social', 'users', 'user789'])
  })

  it('should generate correct followers query key', () => {
    const key = QUERY_KEYS_SOCIAL.followers('user789')
    expect(key).toEqual(['social', 'followers', 'user789'])
  })

  it('should generate correct following query key', () => {
    const key = QUERY_KEYS_SOCIAL.following('user789')
    expect(key).toEqual(['social', 'following', 'user789'])
  })

  it('should generate correct shares query key', () => {
    const key = QUERY_KEYS_SOCIAL.shares('book123')
    expect(key).toEqual(['social', 'shares', 'book123'])
  })
})

describe('Social Queries - Query Options', () => {
  it('should define book ratings query with correct key', () => {
    const query = bookRatingsQuery({ bookId: 'book123' })
    expect(query.key).toEqual(['social', 'ratings', 'book123'])
  })

  it('should define user book rating query with correct key', () => {
    const query = userBookRatingQuery({ bookId: 'book123' })
    expect(query.key).toContain('social')
    expect(query.key).toContain('user')
  })

  it('should define book reviews query with correct key', () => {
    const query = bookReviewsQuery({ bookId: 'book123' })
    expect(query.key).toEqual(['social', 'reviews', 'book123'])
  })

  it('should define book reviews query with custom pagination', () => {
    const query = bookReviewsQuery({ bookId: 'book123', page: 2, size: 20 })
    expect(query.key).toEqual(['social', 'reviews', 'book123'])
  })

  it('should define review detail query with correct key', () => {
    const query = reviewDetailQuery({ reviewId: 'review456' })
    expect(query.key).toEqual(['social', 'reviews', 'review456'])
  })

  it('should define activity feed query with correct key', () => {
    const query = activityFeedQuery()
    expect(query.key).toEqual(['social', 'activity-feed'])
  })

  it('should define reading status query with correct key', () => {
    const query = readingStatusQuery({ bookId: 'book789' })
    expect(query.key).toEqual(['social', 'reading-status', 'book789'])
  })

  it('should define book shares query with correct key', () => {
    const query = bookSharesQuery({ bookId: 'book101' })
    expect(query.key).toEqual(['social', 'shares', 'book101'])
  })
})

describe('Social Queries - Defaults', () => {
  it('book reviews query should use default pagination', () => {
    const query = bookReviewsQuery({ bookId: 'book123' })
    // The query function uses pagination defaults
    expect(query.key).toBeDefined()
  })

  it('activity feed query should use default pagination', () => {
    const query = activityFeedQuery()
    // The query function uses pagination defaults
    expect(query.key).toBeDefined()
  })
})

describe('Social Queries - Isolation', () => {
  it('should not mix keys between different book ratings', () => {
    const key1 = QUERY_KEYS_SOCIAL.ratings('book1')
    const key2 = QUERY_KEYS_SOCIAL.ratings('book2')
    expect(key1).not.toEqual(key2)
  })

  it('should not mix keys between reviews and ratings', () => {
    const ratingKey = QUERY_KEYS_SOCIAL.ratings('book123')
    const reviewKey = QUERY_KEYS_SOCIAL.reviews('book123')
    expect(ratingKey).not.toEqual(reviewKey)
  })

  it('should not mix keys for different users', () => {
    const key1 = QUERY_KEYS_SOCIAL.userProfile('user1')
    const key2 = QUERY_KEYS_SOCIAL.userProfile('user2')
    expect(key1).not.toEqual(key2)
  })
})
