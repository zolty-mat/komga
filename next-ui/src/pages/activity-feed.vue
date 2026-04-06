<template>
  <div class="activity-feed-page">
    <div class="feed-container">
      <!-- Header -->
      <div class="feed-header">
        <h1 class="page-title">
          {{
            $formatMessage({
              description: 'Activity feed page: title',
              defaultMessage: 'Activity Feed',
              id: 'eCLRXZH',
            })
          }}
        </h1>
        <div class="feed-controls">
          <v-select
            v-model="filterType"
            :items="filterOptions"
            item-title="label"
            item-value="value"
            label="Filter activity"
            density="compact"
            clearable
          />
          <v-btn
            icon="mdi-refresh"
            variant="text"
            @click="refreshFeed"
          />
        </div>
      </div>

      <!-- Activity Feed List -->
      <div
        v-if="displayedActivity.length > 0"
        class="activity-list"
      >
        <ActivityFeedCard
          v-for="item in displayedActivity"
          :key="item.id"
          :activity="item"
        />

        <!-- Load More -->
        <div
          v-if="hasMore"
          class="load-more"
        >
          <v-btn
            variant="text"
            @click="loadMore"
          >
            {{
              $formatMessage({
                description: 'Activity feed page: load more button',
                defaultMessage: 'Load More',
                id: 'eCLRXZI',
              })
            }}
          </v-btn>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="empty-state"
      >
        <v-icon
          icon="mdi-history"
          size="64"
          color="grey"
        />
        <h2>
          {{
            $formatMessage({
              description: 'Activity feed page: no activity',
              defaultMessage: 'No Activity Yet',
              id: 'eCLRXZJ',
            })
          }}
        </h2>
        <p>
          {{
            $formatMessage({
              description: 'Activity feed page: no activity description',
              defaultMessage:
                'Follow users and interact with books to see activity in your feed.',
              id: 'eCLRXZK',
            })
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ActivityFeedCard from '@/components/social/ActivityFeedCard.vue'
import { useSocialStore } from '@/stores/social'

const socialStore = useSocialStore()

const filterType = ref<string | null>(null)
const currentPage = ref(0)
const pageSize = ref(20)
const hasMore = ref(true)

const filterOptions = [
  { label: 'All Activity', value: null },
  { label: 'Ratings', value: 'RATED' },
  { label: 'Reviews', value: 'REVIEWED' },
  { label: 'Reading Status', value: 'READING_STATUS_CHANGED' },
  { label: 'Shares', value: 'SHARED' },
  { label: 'Following', value: 'FOLLOWED' },
]

const allActivity = computed(() => socialStore.activityFeed)

const displayedActivity = computed(() => {
  let activity = [...allActivity.value]

  // Filter by type
  if (filterType.value) {
    activity = activity.filter((item) => item.type === filterType.value)
  }

  return activity
})

onMounted(() => {
  loadInitialFeed()
})

const loadInitialFeed = () => {
  // Load initial activity - in real app would call API
  const mockActivity = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      type: 'RATED',
      bookId: 'book1',
      bookTitle: 'Amazing Comic Series',
      ratingValue: 5,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      type: 'REVIEWED',
      bookId: 'book2',
      bookTitle: 'Graphic Novel Pro',
      reviewTitle: 'Incredible storytelling!',
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Comic Fan',
      type: 'READING_STATUS_CHANGED',
      bookId: 'book3',
      bookTitle: 'Super Series',
      status: 'READING',
      timestamp: new Date(Date.now() - 10800000),
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Book Lover',
      userAvatar: 'https://i.pravatar.cc/150?img=4',
      type: 'SHARED',
      bookId: 'book1',
      bookTitle: 'Amazing Comic Series',
      timestamp: new Date(Date.now() - 14400000),
    },
    {
      id: '5',
      userId: 'user5',
      userName: 'New Reader',
      userAvatar: 'https://i.pravatar.cc/150?img=5',
      type: 'FOLLOWED',
      timestamp: new Date(Date.now() - 18000000),
    },
  ]

  socialStore.setActivityFeed(mockActivity)
}

const loadMore = () => {
  currentPage.value++
  // In real app would fetch next page from API
  hasMore.value = false
}

const refreshFeed = () => {
  currentPage.value = 0
  loadInitialFeed()
}
</script>

<style scoped>
.activity-feed-page {
  padding: 24px;
  min-height: 100vh;
}

.feed-container {
  max-width: 600px;
  margin: 0 auto;
}

.feed-header {
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

.feed-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.activity-list {
  display: flex;
  flex-direction: column;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}

.empty-state h2 {
  margin: 16px 0 8px;
  font-size: 20px;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  max-width: 300px;
  color: rgba(0, 0, 0, 0.54);
  font-size: 14px;
}

@media (max-width: 768px) {
  .feed-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .feed-controls {
    width: 100%;
  }
}
</style>
