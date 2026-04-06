<template>
  <div class="overview-grid">
    <v-card
      class="stat-card"
      :loading="isLoading"
    >
      <v-card-text>
        <div class="stat-label">Total Series</div>
        <div class="stat-value">{{ stats?.totalSeries ?? 0 }}</div>
        <div class="stat-change positive">
          <v-icon
            icon="mdi-book-multiple"
            size="small"
          />
        </div>
      </v-card-text>
    </v-card>

    <v-card
      class="stat-card"
      :loading="isLoading"
    >
      <v-card-text>
        <div class="stat-label">Total Books</div>
        <div class="stat-value">{{ stats?.totalBooks ?? 0 }}</div>
        <div class="stat-change positive">
          <v-icon
            icon="mdi-book"
            size="small"
          />
        </div>
      </v-card-text>
    </v-card>

    <v-card
      class="stat-card"
      :loading="isLoading"
    >
      <v-card-text>
        <div class="stat-label">Books Read</div>
        <div class="stat-value">{{ stats?.booksRead ?? 0 }}</div>
        <div class="stat-percentage">{{ stats?.completionRate ?? 0 }}%</div>
      </v-card-text>
    </v-card>

    <v-card
      class="stat-card"
      :loading="isLoading"
    >
      <v-card-text>
        <div class="stat-label">Unread Backlog</div>
        <div class="stat-value">{{ stats?.unreadBooks ?? 0 }}</div>
        <div class="stat-change negative">
          <v-icon
            icon="mdi-alert-circle"
            size="small"
          />
        </div>
      </v-card-text>
    </v-card>

    <v-card
      class="stat-card"
      :loading="isLoading"
    >
      <v-card-text>
        <div class="stat-label">Series with Progress</div>
        <div class="stat-value">{{ stats?.seriesWithProgress ?? 0 }}</div>
        <div class="stat-percentage">
          {{
            stats?.totalSeries
              ? Math.round((stats.seriesWithProgress / stats.totalSeries) * 100)
              : 0
          }}%
        </div>
      </v-card-text>
    </v-card>

    <v-card
      class="stat-card"
      :loading="isLoading"
    >
      <v-card-text>
        <div class="stat-label">Avg Series Length</div>
        <div class="stat-value">{{ stats?.avgSeriesLength ?? 0 }}</div>
        <div class="stat-change positive">
          <v-icon
            icon="mdi-chart-line"
            size="small"
          />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
interface Stats {
  totalSeries: number
  totalBooks: number
  booksRead: number
  seriesWithProgress: number
  completionRate: number
  unreadBooks: number
  avgSeriesLength: number
}

withDefaults(
  defineProps<{
    stats: Stats | null
    isLoading?: boolean
  }>(),
  {
    isLoading: false,
  },
)
</script>

<style scoped>
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  position: relative;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-percentage {
  font-size: 16px;
  font-weight: 500;
  color: #4caf50;
}

.stat-change {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.positive {
  color: #4caf50;
}

.stat-change.negative {
  color: #ff9800;
}
</style>
