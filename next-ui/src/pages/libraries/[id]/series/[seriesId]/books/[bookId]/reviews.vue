<template>
  <div class="reviews-page">
    <div class="reviews-container">
      <!-- Header -->
      <div class="reviews-header">
        <h1 class="page-title">
          {{
            $formatMessage({
              description: 'Reviews page: title',
              defaultMessage: 'Reviews & Ratings',
              id: 'eCLRXYW',
            })
          }}
        </h1>
        <v-btn
          v-if="isLoggedIn"
          color="primary"
          prepend-icon="mdi-plus"
          @click="showReviewForm = true"
        >
          {{
            $formatMessage({
              description: 'Reviews page: write review button',
              defaultMessage: 'Write Review',
              id: 'eCLRXYX',
            })
          }}
        </v-btn>
      </div>

      <!-- Rating Summary Section -->
      <v-card
        class="rating-summary"
        variant="outlined"
      >
        <v-card-item>
          <div class="summary-content">
            <!-- Average Rating -->
            <div class="average-rating">
              <div class="average-number">{{ averageRating.toFixed(1) }}</div>
              <v-rating
                :model-value="Math.round(averageRating * 2) / 2"
                readonly
                color="amber"
                size="large"
              />
              <div class="rating-count">
                {{
                  $formatMessage({
                    description: 'Reviews page: based on',
                    defaultMessage: `Based on {count} ratings`,
                    id: 'eCLRXYY',
                  }).replace('{count}', String(totalRatings))
                }}
              </div>
            </div>

            <!-- Rating Distribution -->
            <div class="rating-distribution">
              <div
                v-for="(count, rating) in ratingDistribution"
                :key="rating"
                class="distribution-row"
              >
                <span class="rating-label">{{ rating }} Star</span>
                <v-progress-linear
                  :model-value="(count / totalRatings) * 100"
                  color="amber"
                  class="distribution-bar"
                />
                <span class="distribution-count">{{ count }}</span>
              </div>
            </div>

            <!-- Your Rating -->
            <div
              v-if="isLoggedIn"
              class="your-rating"
            >
              <p class="your-rating-label">
                {{
                  $formatMessage({
                    description: 'Reviews page: your rating',
                    defaultMessage: 'Your Rating',
                    id: 'eCLRXYZ',
                  })
                }}
              </p>
              <RatingStars
                :model-value="userRating"
                interactive
                @update:model-value="handleRateBook"
              />
            </div>
          </div>
        </v-card-item>
      </v-card>

      <!-- Reading Status Section -->
      <v-card
        v-if="isLoggedIn"
        class="reading-status"
        variant="outlined"
      >
        <v-card-item>
          <div class="status-buttons">
            <v-btn
              :variant="readingStatus === 'WANT_TO_READ' ? 'elevated' : 'outlined'"
              :color="readingStatus === 'WANT_TO_READ' ? 'primary' : undefined"
              prepend-icon="mdi-bookmark-outline"
              @click="setReadingStatus('WANT_TO_READ')"
            >
              {{
                $formatMessage({
                  description: 'Reviews page: want to read button',
                  defaultMessage: 'Want to Read',
                  id: 'eCLRXZA',
                })
              }}
            </v-btn>
            <v-btn
              :variant="readingStatus === 'READING' ? 'elevated' : 'outlined'"
              :color="readingStatus === 'READING' ? 'primary' : undefined"
              prepend-icon="mdi-book-open"
              @click="setReadingStatus('READING')"
            >
              {{
                $formatMessage({
                  description: 'Reviews page: currently reading button',
                  defaultMessage: 'Currently Reading',
                  id: 'eCLRXZB',
                })
              }}
            </v-btn>
            <v-btn
              :variant="readingStatus === 'COMPLETED' ? 'elevated' : 'outlined'"
              :color="readingStatus === 'COMPLETED' ? 'primary' : undefined"
              prepend-icon="mdi-check-circle"
              @click="setReadingStatus('COMPLETED')"
            >
              {{
                $formatMessage({
                  description: 'Reviews page: completed button',
                  defaultMessage: 'Completed',
                  id: 'eCLRXZC',
                })
              }}
            </v-btn>
            <v-btn
              v-if="readingStatus"
              variant="text"
              prepend-icon="mdi-close"
              @click="clearReadingStatus"
            >
              {{
                $formatMessage({
                  description: 'Reviews page: clear status button',
                  defaultMessage: 'Clear',
                  id: 'eCLRXZD',
                })
              }}
            </v-btn>
          </div>
        </v-card-item>
      </v-card>

      <!-- Share Button -->
      <div class="share-section">
        <v-btn
          prepend-icon="mdi-share-variant"
          variant="outlined"
          @click="showShareDialog = true"
        >
          {{
            $formatMessage({
              description: 'Reviews page: share button',
              defaultMessage: 'Share',
              id: 'eCLRXZE',
            })
          }}
        </v-btn>
      </div>

      <!-- Reviews Section -->
      <div class="reviews-section">
        <h2 class="section-title">
          {{
            $formatMessage({
              description: 'Reviews page: reviews title',
              defaultMessage: 'Reviews',
              id: 'eCLRXZF',
            })
          }}
        </h2>

        <!-- Sort & Filter Options -->
        <div class="sort-options">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            item-title="label"
            item-value="value"
            label="Sort by"
            density="compact"
          />
          <v-select
            v-model="filterRating"
            :items="filterOptions"
            item-title="label"
            item-value="value"
            label="Filter by rating"
            density="compact"
            clearable
          />
        </div>

        <!-- Review List -->
        <div
          v-if="filteredReviews.length > 0"
          class="review-list"
        >
          <ReviewCard
            v-for="review in filteredReviews"
            :key="review.id"
            :review="review"
            @helpful="markReviewHelpful(review.id)"
            @edit="editReview(review)"
            @delete="deleteReview(review.id)"
          />
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="empty-state"
        >
          <v-icon
            icon="mdi-comment-text-outline"
            size="48"
            color="grey"
          />
          <p>
            {{
              $formatMessage({
                description: 'Reviews page: no reviews',
                defaultMessage: 'No reviews yet. Be the first to review!',
                id: 'eCLRXZG',
              })
            }}
          </p>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalReviews > pageSize"
          class="pagination"
        >
          <v-pagination
            v-model="currentPage"
            :length="Math.ceil(totalReviews / pageSize)"
            @update:model-value="page => currentPage = page"
          />
        </div>
      </div>
    </div>

    <!-- Review Form Dialog -->
    <v-dialog
      v-model="showReviewForm"
      max-width="600px"
    >
      <ReviewForm
        v-if="showReviewForm"
        :is-editing="!!editingReview"
        :initial-data="editingReview"
        @submit="submitReview"
        @cancel="cancelReview"
      />
    </v-dialog>

    <!-- Share Dialog -->
    <ShareDialog
      :model-value="showShareDialog"
      :book-title="bookTitle"
      :book-url="bookId"
      :available-users="availableUsers"
      @update:model-value="showShareDialog = $event"
      @share="handleShare"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ReviewCard from '@/components/social/ReviewCard.vue'
import ReviewForm from '@/components/social/ReviewForm.vue'
import RatingStars from '@/components/social/RatingStars.vue'
import ShareDialog from '@/components/social/ShareDialog.vue'
import { useSocialStore } from '@/stores/social'
import { useRoute } from 'vue-router'

const route = useRoute()
const socialStore = useSocialStore()

const bookId = route.params.bookId as string
const bookTitle = ref('Current Book')
const isLoggedIn = ref(true) // Would come from auth store

const showReviewForm = ref(false)
const showShareDialog = ref(false)
const editingReview = ref(null)

const currentPage = ref(1)
const pageSize = ref(10)
const totalReviews = ref(0)
const totalRatings = ref(45)

const sortBy = ref('newest')
const filterRating = ref<number | null>(null)

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Highest Rated', value: 'highest-rated' },
  { label: 'Lowest Rated', value: 'lowest-rated' },
  { label: 'Most Helpful', value: 'most-helpful' },
]

const filterOptions = [
  { label: '5 Stars', value: 5 },
  { label: '4 Stars', value: 4 },
  { label: '3 Stars', value: 3 },
  { label: '2 Stars', value: 2 },
  { label: '1 Star', value: 1 },
]

const availableUsers = [
  { id: 'user1', name: 'Friend 1' },
  { id: 'user2', name: 'Friend 2' },
  { id: 'user3', name: 'Friend 3' },
]

const userRating = computed(() => socialStore.getBookRating(bookId) ?? 0)
const readingStatus = computed(() => socialStore.getReadingStatus(bookId))
const averageRating = computed(() => socialStore.getAverageRating(bookId))
const ratingDistribution = computed(() => socialStore.getRatingDistribution(bookId))

const allReviews = computed(() => socialStore.getBookReviews(bookId))

const filteredReviews = computed(() => {
  let reviews = [...allReviews.value]

  // Filter by rating
  if (filterRating.value) {
    reviews = reviews.filter((r) => r.rating === filterRating.value)
  }

  // Sort
  switch (sortBy.value) {
    case 'oldest':
      reviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'highest-rated':
      reviews.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      break
    case 'lowest-rated':
      reviews.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0))
      break
    case 'most-helpful':
      reviews.sort((a, b) => b.helpfulCount - a.helpfulCount)
      break
    case 'newest':
    default:
      reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return reviews
})

// Computed properties for store actions
const handleRateBook = (rating: number) => {
  if (rating > 0) {
    socialStore.setBookRating(bookId, rating)
  } else {
    socialStore.removeBookRating(bookId)
  }
}

const setReadingStatus = (status: 'WANT_TO_READ' | 'READING' | 'COMPLETED') => {
  socialStore.setReadingStatus(bookId, status)
}

const clearReadingStatus = () => {
  socialStore.clearReadingStatus(bookId)
}

const submitReview = (data: any) => {
  if (editingReview.value) {
    socialStore.updateReview(bookId, editingReview.value.id, data)
  } else {
    socialStore.addReview(bookId, {
      id: `review-${Date.now()}`,
      bookId,
      ...data,
      author: {
        id: 'user-current',
        name: 'You',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      helpfulCount: 0,
      isHelpful: false,
      isAuthor: true,
    })
  }
  showReviewForm.value = false
  editingReview.value = null
}

const cancelReview = () => {
  showReviewForm.value = false
  editingReview.value = null
}

const editReview = (review: any) => {
  editingReview.value = review
  showReviewForm.value = true
}

const deleteReview = (reviewId: string) => {
  socialStore.removeReview(bookId, reviewId)
}

const markReviewHelpful = (reviewId: string) => {
  // Update in store
}

const handleShare = (data: any) => {
  socialStore.shareBook(bookId, data.userIds)
  showShareDialog.value = false
}
</script>

<style scoped>
.reviews-page {
  padding: 24px;
}

.reviews-container {
  max-width: 900px;
  margin: 0 auto;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.rating-summary {
  margin-bottom: 24px;
}

.summary-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 32px;
}

.average-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.average-number {
  font-size: 48px;
  font-weight: bold;
  color: #ffc107;
}

.rating-count {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
}

.rating-distribution {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.distribution-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-label {
  width: 50px;
  font-size: 12px;
}

.distribution-bar {
  flex: 1;
  min-width: 100px;
}

.distribution-count {
  width: 30px;
  text-align: right;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
}

.your-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.your-rating-label {
  margin: 0;
  font-weight: 500;
  font-size: 14px;
}

.reading-status {
  margin-bottom: 24px;
}

.status-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.share-section {
  margin-bottom: 32px;
}

.reviews-section {
  margin-top: 32px;
}

.section-title {
  margin: 0 0 24px;
  font-size: 20px;
  font-weight: 600;
}

.sort-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.review-list {
  margin-bottom: 24px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-state p {
  margin: 16px 0 0;
  color: rgba(0, 0, 0, 0.54);
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .reviews-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-content {
    grid-template-columns: 1fr;
  }

  .sort-options {
    grid-template-columns: 1fr;
  }
}
</style>
