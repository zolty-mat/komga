<template>
  <v-card
    class="activity-card"
    variant="outlined"
  >
    <v-card-item>
      <template #prepend>
        <v-avatar
          v-if="activity.userAvatar"
          :image="activity.userAvatar"
          size="40"
        />
        <v-avatar
          v-else
          color="primary"
          size="40"
        >
          {{ activity.userName.charAt(0).toUpperCase() }}
        </v-avatar>
      </template>

      <div class="activity-content">
        <p class="activity-text">
          <strong>{{ activity.userName }}</strong>
          {{ activityDescription }}
        </p>
        <p class="activity-time">{{ formatTime(activity.timestamp) }}</p>
      </div>
    </v-card-item>

    <v-card-actions
      v-if="activity.bookId"
      class="pt-0"
    >
      <v-btn
        variant="text"
        size="small"
        :to="`/book/${activity.bookId}`"
      >
        {{
          $formatMessage({
            description: 'Activity card: view book button',
            defaultMessage: 'View Book',
            id: 'eCLRXYL',
          })
        }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Activity {
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

interface Props {
  activity: Activity
}

defineProps<Props>()

const activityDescription = computed(() => {
  const { type, bookTitle, status, ratingValue, reviewTitle } = activity.value

  switch (type) {
    case 'RATED':
      return `rated ${bookTitle} with ${ratingValue} star${ratingValue !== 1 ? 's' : ''}`
    case 'REVIEWED':
      return `wrote a review for ${bookTitle}: "${reviewTitle}"`
    case 'READING_STATUS_CHANGED':
      return `is ${getStatusLabel(status)}`
    case 'SHARED':
      return `shared ${bookTitle}`
    case 'FOLLOWED':
      return 'started following you'
    default:
      return 'did something'
  }
})

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'WANT_TO_READ':
      return 'wanting to read'
    case 'READING':
      return 'currently reading'
    case 'COMPLETED':
      return 'completed reading'
    default:
      return 'reading'
  }
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

const activity = computed(() => props.activity)
</script>

<style scoped>
.activity-card {
  margin-bottom: 12px;
  transition: box-shadow 0.2s;
}

.activity-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.activity-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.activity-time {
  margin: 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
}
</style>
