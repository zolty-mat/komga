<template>
  <v-card :loading="isLoading">
    <v-card-title>Top Authors by Book Count</v-card-title>
    <v-card-text>
      <div
        v-if="!isLoading && (!authors || authors.length === 0)"
        class="text-center pa-6"
      >
        <v-icon
          icon="mdi-information"
          size="large"
          class="mb-2"
        />
        <p>No author data available</p>
      </div>

      <v-row
        v-else
        dense
        class="mb-4"
      >
        <v-col cols="12">
          <BarChart
            :items="chartItems"
            title="Author Book Counts"
            :is-loading="isLoading"
          />
        </v-col>
      </v-row>

      <div
        v-if="authors && authors.length > 0"
        class="author-list"
      >
        <div
          v-for="author in authors"
          :key="author.name"
          class="author-item"
        >
          <div class="author-name-section">
            <h4 class="author-name">{{ author.name }}</h4>
            <span class="book-count">{{ author.totalBooks }} books</span>
          </div>

          <div class="author-stats">
            <div class="stat">
              <span class="label">Read:</span>
              <span class="value">{{ author.booksRead }}/{{ author.totalBooks }}</span>
            </div>
            <div class="stat">
              <span class="label">Completion:</span>
              <span class="value">{{ author.completionPercent }}%</span>
            </div>
          </div>

          <v-progress-linear
            :model-value="author.completionPercent"
            height="6"
            rounded
            class="mt-2"
          />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import BarChart from '@/components/charts/BarChart.vue'

interface AuthorData {
  name: string
  totalBooks: number
  booksRead: number
  completionPercent: number
  books: any[]
}

const props = withDefaults(
  defineProps<{
    authors: AuthorData[] | null
    isLoading?: boolean
  }>(),
  {
    isLoading: false,
  },
)

const authors = computed(() => props.authors?.slice(0, 10) ?? [])

const chartItems = computed(() =>
  authors.value.map(a => ({
    name: a.name,
    value: a.totalBooks,
  })),
)
</script>

<style scoped>
.author-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
  max-height: 400px;
  overflow-y: auto;
}

.author-item {
  padding: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.author-name-section {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.author-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.book-count {
  font-size: 12px;
  opacity: 0.6;
}

.author-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 12px;
}

.stat {
  display: flex;
  justify-content: space-between;
}

.label {
  opacity: 0.6;
}

.value {
  font-weight: 500;
}
</style>
