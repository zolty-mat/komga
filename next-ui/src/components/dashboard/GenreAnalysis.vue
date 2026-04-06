<template>
  <div class="genre-analysis">
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <PieChart
          :items="chartItems"
          title="Genre Distribution"
          :is-loading="isLoading"
          @item-selected="selectedGenre = $event"
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-card :loading="isLoading">
          <v-card-title>Top Genres</v-card-title>
          <v-card-text>
            <div
              v-if="!isLoading && (!genreData || genreData.length === 0)"
              class="text-center pa-6"
            >
              <v-icon
                icon="mdi-information"
                size="large"
                class="mb-2"
              />
              <p>No genre data available</p>
            </div>

            <div
              v-else
              class="genre-table"
            >
              <div
                v-for="(genre, i) in genreData"
                :key="`genre-${i}`"
                class="genre-row"
              >
                <div class="genre-header">
                  <span class="genre-name">{{ genre.name }}</span>
                  <span class="genre-count">{{ genre.value }} books</span>
                </div>
                <div class="genre-stats">
                  <div class="stat-item">
                    <span class="stat-label">Read:</span>
                    <span class="stat-value">{{ genre.read }}/{{ genre.value }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Completion:</span>
                    <span class="stat-value">{{ genre.readPercent }}%</span>
                  </div>
                </div>
                <v-progress-linear
                  :model-value="genre.readPercent"
                  height="6"
                  class="mt-2"
                  rounded
                />
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PieChart from '@/components/charts/PieChart.vue'

interface GenreData {
  name: string
  value: number
  read: number
  unread: number
  readPercent: number
}

const props = withDefaults(
  defineProps<{
    genres: GenreData[] | null
    isLoading?: boolean
  }>(),
  {
    isLoading: false,
  },
)

const genreData = computed(() => props.genres ?? [])

const chartItems = computed(() =>
  genreData.value.map(g => ({
    name: g.name,
    value: g.value,
  })),
)
</script>

<style scoped>
.genre-analysis {
  margin-bottom: 32px;
}

.genre-table {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.genre-row {
  padding: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.genre-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.genre-name {
  font-weight: 500;
}

.genre-count {
  font-size: 12px;
  opacity: 0.6;
}

.genre-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 13px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
}

.stat-label {
  opacity: 0.6;
}

.stat-value {
  font-weight: 500;
}
</style>
