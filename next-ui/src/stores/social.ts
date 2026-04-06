import { defineStore } from 'pinia'

interface Rating {
  bookId: string
  rating: number
  ratedAt: Date
}

interface Review {
  id: string
  bookId: string
  title: string
  text: string
  rating?: number
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: Date
  updatedAt: Date
  helpfulCount: number
  isHelpful: boolean
  isAuthor: boolean
}

interface ActivityItem {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  type: 'RATED' | 'REVIEWED' | 'READING_STATUS_CHANGED' | 'SHARED' | 'FOLLOWED'
  bookId?: string
  bookTitle?: string
  status?: 'WANT_TO_READ' | 'READING' | 'COMPLETED'
  ratingValue?: number
  reviewTitle?: string
  timestamp: Date
}

interface ReadingStatus {
  bookId: string
  status: 'WANT_TO_READ' | 'READING' | 'COMPLETED' | null
  startedAt?: Date
  completedAt?: Date
}

interface UserProfile {
  id: string
  name: string
  avatar?: string
  bio?: string
  isPublic: boolean
  followersCount: number
  followingCount: number
  booksRatedCount: number
  reviewsCount: number
  isFollowing: boolean
}

export const useSocialStore = defineStore('social', {
  state: () => ({
    // User's ratings (by bookId)
    ratings: {} as Record<string, Rating>,

    // User's reviews (by bookId)
    reviews: {} as Record<string, Review[]>,

    // Reading status (by bookId)
    readingStatus: {} as Record<string, ReadingStatus>,

    // Activity feed items
    activityFeed: [] as ActivityItem[],

    // Following list (userId -> UserProfile)
    following: {} as Record<string, UserProfile>,

    // User profiles cache
    userProfiles: {} as Record<string, UserProfile>,

    // Shares (by bookId)
    shares: {} as Record<string, string[]>,

    // Loading states
    loadingRatings: false,
    loadingReviews: false,
    loadingActivityFeed: false,
  }),

  getters: {
    // Get rating for a book
    getBookRating: (state) => (bookId: string) => {
      return state.ratings[bookId]?.rating ?? null
    },

    // Get all reviews for a book
    getBookReviews: (state) => (bookId: string) => {
      return state.reviews[bookId] ?? []
    },

    // Get reading status for a book
    getReadingStatus: (state) => (bookId: string) => {
      return state.readingStatus[bookId]?.status ?? null
    },

    // Get average rating (mock calculation)
    getAverageRating: (state) => (bookId: string) => {
      const reviews = state.reviews[bookId] ?? []
      if (reviews.length === 0) return 0
      const sum = reviews.reduce((acc, review) => acc + (review.rating ?? 0), 0)
      return sum / reviews.length
    },

    // Get rating distribution
    getRatingDistribution: (state) => (bookId: string) => {
      const reviews = state.reviews[bookId] ?? []
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      reviews.forEach((review) => {
        if (review.rating) {
          distribution[review.rating as keyof typeof distribution]++
        }
      })
      return distribution
    },

    // Check if user is following someone
    isFollowing: (state) => (userId: string) => {
      return userId in state.following
    },

    // Get user's followers count from profile
    getFollowersCount: (state) => (userId: string) => {
      return state.userProfiles[userId]?.followersCount ?? 0
    },

  },

  actions: {
    // Rating actions
    setBookRating(bookId: string, rating: number) {
      this.ratings[bookId] = {
        bookId,
        rating,
        ratedAt: new Date(),
      }
    },

    removeBookRating(bookId: string) {
      delete this.ratings[bookId]
    },

    // Review actions
    addReview(bookId: string, review: Review) {
      if (!this.reviews[bookId]) {
        this.reviews[bookId] = []
      }
      this.reviews[bookId].unshift(review)
    },

    updateReview(bookId: string, reviewId: string, updates: Partial<Review>) {
      const reviews = this.reviews[bookId]
      if (reviews) {
        const index = reviews.findIndex((r) => r.id === reviewId)
        if (index >= 0) {
          reviews[index] = { ...reviews[index], ...updates, updatedAt: new Date() }
        }
      }
    },

    removeReview(bookId: string, reviewId: string) {
      if (this.reviews[bookId]) {
        this.reviews[bookId] = this.reviews[bookId].filter((r) => r.id !== reviewId)
      }
    },

    // Reading status actions
    setReadingStatus(bookId: string, status: ReadingStatus['status']) {
      this.readingStatus[bookId] = {
        bookId,
        status,
        startedAt: status === 'READING' ? new Date() : undefined,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
      }
    },

    clearReadingStatus(bookId: string) {
      delete this.readingStatus[bookId]
    },

    // Activity feed actions
    addActivityItem(item: ActivityItem) {
      this.activityFeed.unshift(item)
    },

    setActivityFeed(items: ActivityItem[]) {
      this.activityFeed = items
    },

    clearActivityFeed() {
      this.activityFeed = []
    },

    // Follow actions
    followUser(userProfile: UserProfile) {
      this.following[userProfile.id] = userProfile
    },

    unfollowUser(userId: string) {
      delete this.following[userId]
    },

    // User profile caching
    cacheUserProfile(profile: UserProfile) {
      this.userProfiles[profile.id] = profile
    },

    getUserProfile(userId: string) {
      return this.userProfiles[userId]
    },

    // Share actions
    shareBook(bookId: string, userIds: string[]) {
      this.shares[bookId] = userIds
    },

    // Loading states
    setLoadingRatings(loading: boolean) {
      this.loadingRatings = loading
    },

    setLoadingReviews(loading: boolean) {
      this.loadingReviews = loading
    },

    setLoadingActivityFeed(loading: boolean) {
      this.loadingActivityFeed = loading
    },

    // Reset all social data
    reset() {
      this.ratings = {}
      this.reviews = {}
      this.readingStatus = {}
      this.activityFeed = []
      this.following = {}
      this.userProfiles = {}
      this.shares = {}
      this.loadingRatings = false
      this.loadingReviews = false
      this.loadingActivityFeed = false
    },
  },
})
