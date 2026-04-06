<template>
  <v-card
    class="review-card"
    variant="outlined"
  >
    <v-card-item>
      <template #prepend>
        <v-avatar
          v-if="review.author.avatar"
          :image="review.author.avatar"
          size="40"
        />
        <v-avatar
          v-else
          color="primary"
          size="40"
        >
          {{ review.author.name.charAt(0).toUpperCase() }}
        </v-avatar>
      </template>

      <div class="review-header">
        <div class="author-info">
          <p class="author-name">{{ review.author.name }}</p>
          <p class="review-date">{{ formatDate(review.createdAt) }}</p>
        </div>
        <div
          v-if="isAuthor"
          class="author-badge"
        >
          <v-chip
            size="small"
            variant="outlined"
            label
          >
            {{
              $formatMessage({
                description: 'Review card: author badge',
                defaultMessage: 'Your review',
                id: 'eCLRXYZ',
              })
            }}
          </v-chip>
        </div>
      </div>
    </v-card-item>

    <v-card-text>
      <div v-if="review.rating" class="review-rating mb-3">
        <v-rating
          :model-value="review.rating"
          readonly
          color="amber"
          size="small"
        />
      </div>

      <h3
        v-if="review.title"
        class="review-title"
      >
        {{ review.title }}
      </h3>

      <div class="review-text">
        {{ review.text }}
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        :prepend-icon="isHelpful ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'"
        variant="text"
        size="small"
        :color="isHelpful ? 'primary' : undefined"
        @click="toggleHelpful"
      >
        {{
          $formatMessage({
            description: 'Review card: helpful button',
            defaultMessage: 'Helpful',
            id: 'eCLRXYB',
          })
        }}
        <span v-if="review.helpfulCount > 0" class="ml-1">({{ review.helpfulCount }})</span>
      </v-btn>

      <v-spacer />

      <v-menu
        v-if="isAuthor"
        location="end"
      >
        <template #activator="{ props }">
          <v-btn
            icon="mdi-dots-vertical"
            variant="text"
            size="small"
            v-bind="props"
          />
        </template>

        <v-list>
          <v-list-item
            prepend-icon="mdi-pencil"
            @click="$emit('edit')"
          >
            {{
              $formatMessage({
                description: 'Review card: edit action',
                defaultMessage: 'Edit',
                id: 'eCLRXYC',
              })
            }}
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-delete"
            @click="$emit('delete')"
          >
            {{
              $formatMessage({
                description: 'Review card: delete action',
                defaultMessage: 'Delete',
                id: 'eCLRXYD',
              })
            }}
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Review {
  id: string
  title: string
  text: string
  rating?: number
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: Date
  helpfulCount: number
  isHelpful: boolean
  isAuthor: boolean
}

interface Props {
  review: Review
}

interface Emits {
  (e: 'helpful'): void
  (e: 'edit'): void
  (e: 'delete'): void
}

defineProps<Props>()
defineEmits<Emits>()

const isHelpful = ref(false)

const formatDate = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

const toggleHelpful = () => {
  isHelpful.value = !isHelpful.value
}
</script>

<style scoped>
.review-card {
  margin-bottom: 16px;
  transition: box-shadow 0.2s;
}

.review-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  margin: 0;
  font-weight: 600;
  font-size: 14px;
}

.review-date {
  margin: 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
}

.author-badge {
  display: flex;
  align-items: flex-start;
}

.review-rating {
  display: flex;
  align-items: center;
}

.review-title {
  margin: 12px 0 8px;
  font-size: 16px;
  font-weight: 500;
}

.review-text {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.87);
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
