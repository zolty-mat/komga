import { defineMutation, defineQueryOptions, useMutation } from '@pinia/colada'
import { komgaClient } from '@/api/komga-client'

// Query Keys
export const QUERY_KEYS_SOCIAL = {
  root: ['social'] as const,
  ratings: (bookId: string) => [...QUERY_KEYS_SOCIAL.root, 'ratings', bookId] as const,
  reviews: (bookId: string) => [...QUERY_KEYS_SOCIAL.root, 'reviews', bookId] as const,
  reviewDetail: (reviewId: string) => [...QUERY_KEYS_SOCIAL.root, 'reviews', reviewId] as const,
  activityFeed: () => [...QUERY_KEYS_SOCIAL.root, 'activity-feed'] as const,
  userProfile: (userId: string) => [...QUERY_KEYS_SOCIAL.root, 'users', userId] as const,
  followers: (userId: string) => [...QUERY_KEYS_SOCIAL.root, 'followers', userId] as const,
  following: (userId: string) => [...QUERY_KEYS_SOCIAL.root, 'following', userId] as const,
  readingStatus: (bookId: string) => [...QUERY_KEYS_SOCIAL.root, 'reading-status', bookId] as const,
  shares: (bookId: string) => [...QUERY_KEYS_SOCIAL.root, 'shares', bookId] as const,
}

// Rating Queries
export const bookRatingsQuery = defineQueryOptions(({ bookId }: { bookId: string }) => ({
  key: QUERY_KEYS_SOCIAL.ratings(bookId),
  query: () =>
    komgaClient
      .GET('/api/v1/books/{bookId}/ratings', {
        params: { path: { bookId } },
      })
      .then((res) => res.data),
}))

export const userBookRatingQuery = defineQueryOptions(({ bookId }: { bookId: string }) => ({
  key: [...QUERY_KEYS_SOCIAL.ratings(bookId), 'user'] as const,
  query: () =>
    komgaClient
      .GET('/api/v1/books/{bookId}/ratings/me', {
        params: { path: { bookId } },
      })
      .then((res) => res.data),
}))

// Review Queries
export const bookReviewsQuery = defineQueryOptions(
  ({ bookId, page = 0, size = 10, sort = ['created,desc'] }: {
    bookId: string
    page?: number
    size?: number
    sort?: string[]
  }) => ({
    key: QUERY_KEYS_SOCIAL.reviews(bookId),
    query: () =>
      komgaClient
        .GET('/api/v1/books/{bookId}/reviews', {
          params: {
            path: { bookId },
            query: { page, size, sort },
          },
        })
        .then((res) => res.data),
  }),
)

export const reviewDetailQuery = defineQueryOptions(({ reviewId }: { reviewId: string }) => ({
  key: QUERY_KEYS_SOCIAL.reviewDetail(reviewId),
  query: () =>
    komgaClient
      .GET('/api/v1/reviews/{reviewId}', {
        params: { path: { reviewId } },
      })
      .then((res) => res.data),
}))

// Activity Feed Query
export const activityFeedQuery = defineQueryOptions(
  (params?: { page?: number; size?: number }) => ({
    key: QUERY_KEYS_SOCIAL.activityFeed(),
    query: () => {
      const page = params?.page ?? 0
      const size = params?.size ?? 20
      return komgaClient
        .GET('/api/v1/activity-feed', {
          params: { query: { page, size } },
        })
        .then((res) => res.data)
    },
  }),
)

// Reading Status Query
export const readingStatusQuery = defineQueryOptions(({ bookId }: { bookId: string }) => ({
  key: QUERY_KEYS_SOCIAL.readingStatus(bookId),
  query: () =>
    komgaClient
      .GET('/api/v1/books/{bookId}/reading-status', {
        params: { path: { bookId } },
      })
      .then((res) => res.data),
}))

// Share Query
export const bookSharesQuery = defineQueryOptions(({ bookId }: { bookId: string }) => ({
  key: QUERY_KEYS_SOCIAL.shares(bookId),
  query: () =>
    komgaClient
      .GET('/api/v1/books/{bookId}/shares', {
        params: { path: { bookId } },
      })
      .then((res) => res.data),
}))

// Rating Mutations
export const useRateBook = defineMutation(() =>
  useMutation({
    mutation: ({ bookId, rating }: { bookId: string; rating: number }) =>
      komgaClient.POST('/api/v1/books/{bookId}/ratings', {
        params: { path: { bookId } },
        body: { rating },
      }),
  }),
)

export const useDeleteBookRating = defineMutation(() =>
  useMutation({
    mutation: (bookId: string) =>
      komgaClient.DELETE('/api/v1/books/{bookId}/ratings/me', {
        params: { path: { bookId } },
      }),
  }),
)

// Review Mutations
export const useWriteReview = defineMutation(() =>
  useMutation({
    mutation: ({
      bookId,
      title,
      text,
      rating,
      isPublic,
    }: {
      bookId: string
      title: string
      text: string
      rating?: number
      isPublic: boolean
    }) =>
      komgaClient.POST('/api/v1/books/{bookId}/reviews', {
        params: { path: { bookId } },
        body: { title, text, rating, isPublic },
      }),
  }),
)

export const useUpdateReview = defineMutation(() =>
  useMutation({
    mutation: ({
      reviewId,
      title,
      text,
      rating,
    }: {
      reviewId: string
      title: string
      text: string
      rating?: number
    }) =>
      komgaClient.PATCH('/api/v1/reviews/{reviewId}', {
        params: { path: { reviewId } },
        body: { title, text, rating },
      }),
  }),
)

export const useDeleteReview = defineMutation(() =>
  useMutation({
    mutation: (reviewId: string) =>
      komgaClient.DELETE('/api/v1/reviews/{reviewId}', {
        params: { path: { reviewId } },
      }),
  }),
)

export const useMarkReviewHelpful = defineMutation(() =>
  useMutation({
    mutation: (reviewId: string) =>
      komgaClient.POST('/api/v1/reviews/{reviewId}/helpful', {
        params: { path: { reviewId } },
      }),
  }),
)

// Reading Status Mutations
export const useSetReadingStatus = defineMutation(() =>
  useMutation({
    mutation: ({ bookId, status }: { bookId: string; status: 'WANT_TO_READ' | 'READING' | 'COMPLETED' }) =>
      komgaClient.PATCH('/api/v1/books/{bookId}/reading-status', {
        params: { path: { bookId } },
        body: { status },
      }),
  }),
)

export const useClearReadingStatus = defineMutation(() =>
  useMutation({
    mutation: (bookId: string) =>
      komgaClient.DELETE('/api/v1/books/{bookId}/reading-status', {
        params: { path: { bookId } },
      }),
  }),
)

// Share Mutations
export const useShareBook = defineMutation(() =>
  useMutation({
    mutation: ({
      bookId,
      userIds,
      isPublic,
      message,
    }: {
      bookId: string
      userIds?: string[]
      isPublic: boolean
      message?: string
    }) =>
      komgaClient.POST('/api/v1/books/{bookId}/shares', {
        params: { path: { bookId } },
        body: { userIds, isPublic, message },
      }),
  }),
)

// Follow Mutations
export const useFollowUser = defineMutation(() =>
  useMutation({
    mutation: (userId: string) =>
      komgaClient.POST('/api/v1/users/{userId}/follow', {
        params: { path: { userId } },
      }),
  }),
)

export const useUnfollowUser = defineMutation(() =>
  useMutation({
    mutation: (userId: string) =>
      komgaClient.DELETE('/api/v1/users/{userId}/follow', {
        params: { path: { userId } },
      }),
  }),
)

// User Profile Query
export const userProfileQuery = defineQueryOptions(({ userId }: { userId: string }) => ({
  key: QUERY_KEYS_SOCIAL.userProfile(userId),
  query: () =>
    komgaClient
      .GET('/api/v1/users/{userId}', {
        params: { path: { userId } },
      })
      .then((res) => res.data),
}))

// Following Query
export const userFollowingQuery = defineQueryOptions(({ userId }: { userId: string }) => ({
  key: QUERY_KEYS_SOCIAL.following(userId),
  query: () =>
    komgaClient
      .GET('/api/v1/users/{userId}/following', {
        params: { path: { userId } },
      })
      .then((res) => res.data),
}))

// Followers Query
export const userFollowersQuery = defineQueryOptions(({ userId }: { userId: string }) => ({
  key: QUERY_KEYS_SOCIAL.followers(userId),
  query: () =>
    komgaClient
      .GET('/api/v1/users/{userId}/followers', {
        params: { path: { userId } },
      })
      .then((res) => res.data),
}))
