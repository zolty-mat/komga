import { httpTyped } from '@/mocks/api/httpTyped'
import { mockPage } from '@/mocks/api/pageable'
import { PageRequest } from '@/types/PageRequest'

// Mock review data
export const mockReview = {
  id: 'REVIEW001',
  title: 'Amazing Comic Series!',
  text: 'This is a fantastic comic series that keeps you on the edge of your seat. The artwork is stunning and the story is engaging.',
  rating: 5,
  author: {
    id: 'USER001',
    name: 'Comic Lover',
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
  createdAt: new Date('2025-02-15T10:30:00Z'),
  updatedAt: new Date('2025-02-15T10:30:00Z'),
  helpfulCount: 12,
  isHelpful: false,
  isAuthor: false,
}

export function mockReviews(count: number) {
  return [...Array(count).keys()].map((index) =>
    Object.assign({}, mockReview, {
      id: `REVIEW${String(index + 1).padStart(3, '0')}`,
      title: `Review ${index + 1}`,
      rating: Math.ceil(Math.random() * 5),
      author: {
        id: `USER${String(index + 1).padStart(3, '0')}`,
        name: `Reader ${index + 1}`,
        avatar: `https://i.pravatar.cc/40?img=${index}`,
      },
      helpfulCount: Math.floor(Math.random() * 20),
    }),
  )
}

export const mockRating = {
  bookId: '05RKH8CC8B4RW',
  rating: 4,
  ratedAt: new Date('2025-02-10T15:20:00Z'),
}

export const mockReadingStatus = {
  bookId: '05RKH8CC8B4RW',
  status: 'READING',
  startedAt: new Date('2025-02-01T10:00:00Z'),
  completedAt: null,
}

export const mockActivityItem = {
  id: 'ACTIVITY001',
  userId: 'USER001',
  userName: 'Comic Reader',
  userAvatar: 'https://i.pravatar.cc/40?img=1',
  type: 'RATED',
  bookId: '05RKH8CC8B4RW',
  bookTitle: 'Super Duck 001',
  ratingValue: 5,
  timestamp: new Date('2025-02-19T11:29:25Z'),
}

export function mockActivityItems(count: number) {
  const activityTypes = ['RATED', 'REVIEWED', 'READING_STATUS_CHANGED', 'SHARED', 'FOLLOWED']
  return [...Array(count).keys()].map((index) => {
    const type = activityTypes[index % activityTypes.length]
    return Object.assign({}, mockActivityItem, {
      id: `ACTIVITY${String(index + 1).padStart(3, '0')}`,
      userId: `USER${String(index + 1).padStart(3, '0')}`,
      userName: `User ${index + 1}`,
      type,
      ...(type === 'READING_STATUS_CHANGED' && {
        status: ['WANT_TO_READ', 'READING', 'COMPLETED'][index % 3],
      }),
      ...(type === 'RATED' && { ratingValue: Math.ceil(Math.random() * 5) }),
      timestamp: new Date(Date.now() - index * 3600000),
    })
  })
}

export const mockUserProfile = {
  id: 'USER001',
  name: 'Comic Enthusiast',
  avatar: 'https://i.pravatar.cc/150?img=1',
  bio: 'Love comics and graphic novels!',
  isPublic: true,
  followersCount: 42,
  followingCount: 15,
  booksRatedCount: 27,
  reviewsCount: 12,
  isFollowing: false,
}

export const socialHandlers = [
  // Rating endpoints
  httpTyped.get('/api/v1/books/{bookId}/ratings', ({ params, response }) => {
    return response(200).json({
      average: 4.2,
      count: 45,
      distribution: { 5: 25, 4: 12, 3: 5, 2: 2, 1: 1 },
    })
  }),

  httpTyped.get('/api/v1/books/{bookId}/ratings/me', ({ response }) => {
    return response(200).json(mockRating)
  }),

  httpTyped.post('/api/v1/books/{bookId}/ratings', ({ response }) => {
    return response(201).json(mockRating)
  }),

  httpTyped.delete('/api/v1/books/{bookId}/ratings/me', ({ response }) => {
    return response(204).empty()
  }),

  // Review endpoints
  httpTyped.get('/api/v1/books/{bookId}/reviews', ({ query, response }) => {
    return response(200).json(
      mockPage(
        mockReviews(10),
        new PageRequest(Number(query.get('page')) || 0, Number(query.get('size')) || 10, query.getAll('sort')),
      ),
    )
  }),

  httpTyped.get('/api/v1/reviews/{reviewId}', ({ params, response }) => {
    return response(200).json(Object.assign({}, mockReview, { id: params.reviewId }))
  }),

  httpTyped.post('/api/v1/books/{bookId}/reviews', ({ response }) => {
    return response(201).json(mockReview)
  }),

  httpTyped.patch('/api/v1/reviews/{reviewId}', ({ response }) => {
    return response(200).json(mockReview)
  }),

  httpTyped.delete('/api/v1/reviews/{reviewId}', ({ response }) => {
    return response(204).empty()
  }),

  httpTyped.post('/api/v1/reviews/{reviewId}/helpful', ({ response }) => {
    return response(200).json({ helpfulCount: 13 })
  }),

  // Activity feed endpoint
  httpTyped.get('/api/v1/activity-feed', ({ query, response }) => {
    return response(200).json(
      mockPage(
        mockActivityItems(20),
        new PageRequest(Number(query.get('page')) || 0, Number(query.get('size')) || 20, query.getAll('sort')),
      ),
    )
  }),

  // Reading status endpoints
  httpTyped.get('/api/v1/books/{bookId}/reading-status', ({ response }) => {
    return response(200).json(mockReadingStatus)
  }),

  httpTyped.patch('/api/v1/books/{bookId}/reading-status', ({ response }) => {
    return response(200).json(mockReadingStatus)
  }),

  httpTyped.delete('/api/v1/books/{bookId}/reading-status', ({ response }) => {
    return response(204).empty()
  }),

  // Share endpoints
  httpTyped.get('/api/v1/books/{bookId}/shares', ({ response }) => {
    return response(200).json({ shares: [] })
  }),

  httpTyped.post('/api/v1/books/{bookId}/shares', ({ response }) => {
    return response(201).json({ bookId: 'book123', sharedWith: [] })
  }),

  // User follow endpoints
  httpTyped.post('/api/v1/users/{userId}/follow', ({ response }) => {
    return response(201).json(mockUserProfile)
  }),

  httpTyped.delete('/api/v1/users/{userId}/follow', ({ response }) => {
    return response(204).empty()
  }),

  // User profile endpoints
  httpTyped.get('/api/v1/users/{userId}', ({ params, response }) => {
    return response(200).json(
      Object.assign({}, mockUserProfile, {
        id: params.userId,
        name: `User ${params.userId}`,
      }),
    )
  }),

  httpTyped.get('/api/v1/users/{userId}/following', ({ query, response }) => {
    return response(200).json(
      mockPage(
        [...Array(5).keys()].map((i) =>
          Object.assign({}, mockUserProfile, {
            id: `USER${i}`,
            name: `Following ${i}`,
          }),
        ),
        new PageRequest(Number(query.get('page')) || 0, Number(query.get('size')) || 10),
      ),
    )
  }),

  httpTyped.get('/api/v1/users/{userId}/followers', ({ query, response }) => {
    return response(200).json(
      mockPage(
        [...Array(8).keys()].map((i) =>
          Object.assign({}, mockUserProfile, {
            id: `USER${i}`,
            name: `Follower ${i}`,
          }),
        ),
        new PageRequest(Number(query.get('page')) || 0, Number(query.get('size')) || 10),
      ),
    )
  }),
]
