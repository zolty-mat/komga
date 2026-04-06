<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <GaugeChart
        :value="stats?.booksRead ?? 0"
        :total="stats?.totalBooks ?? 1"
        title="Library Completion"
        label="Overall Progress"
        value-label="Books Read"
        total-label="Total Books"
        :is-loading="isLoading"
        gauge-color="#4CAF50"
      />
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <v-card :loading="isLoading">
        <v-card-title>Library Health Metrics</v-card-title>
        <v-card-text>
          <div class="health-metric">
            <div class="metric-header">
              <span class="metric-label">Completion Rate</span>
              <span class="metric-value">{{ stats?.completionRate ?? 0 }}%</span>
            </div>
            <v-progress-linear
              :model-value="stats?.completionRate ?? 0"
              height="8"
              rounded
              color="success"
            />
          </div>

          <div class="health-metric mt-4">
            <div class="metric-header">
              <span class="metric-label">Unread Backlog</span>
              <span class="metric-value">{{ stats?.unreadBooks ?? 0 }}</span>
            </div>
            <div class="metric-description">
              {{ ((stats?.unreadBooks ?? 0) / (stats?.totalBooks ?? 1) * 100).toFixed(1) }}% of library
            </div>
          </div>

          <div class="health-metric mt-4">
            <div class="metric-header">
              <span class="metric-label">Series in Progress</span>
              <span class="metric-value">{{ stats?.seriesWithProgress ?? 0 }}/{{ stats?.totalSeries ?? 0 }}</span>
            </div>
            <div class="metric-description">
              {{
                stats?.totalSeries
                  ? ((stats.seriesWithProgress / stats.totalSeries) * 100).toFixed(1)
                  : 0
              }}% of series
            </div>
          </div>

          <div class="health-metric mt-4">
            <div class="metric-header">
              <span class="metric-label">Average Series Length</span>
              <span class="metric-value">{{ stats?.avgSeriesLength ?? 0 }}</span>
            </div>
            <div class="metric-description">
              Books per series
            </div>
          </div>

          <v-divider class="my-4" />

          <div class="health-recommendations">
            <h4 class="recommendations-title">Recommendations</h4>
            <ul class="recommendations-list">
              <li v-if="(stats?.completionRate ?? 0) < 50">
                <v-icon
                  icon="mdi-lightbulb"
                  size="small"
                  class="mr-2"
                />
                Consider focusing on completing series you've started
              </li>
              <li v-if="(stats?.unreadBooks ?? 0) > (stats?.booksRead ?? 0)">
                <v-icon
                  icon="mdi-lightbulb"
                  size="small"
                  class="mr-2"
                />
                You have more unread books than read — prioritize!
              </li>
              <li v-if="(stats?.seriesWithProgress ?? 0) / (stats?.totalSeries ?? 1) < 0.3">
                <v-icon
                  icon="mdi-lightbulb"
                  size="small"
                  class="mr-2"
                />
                Explore more series in your collection
              </li>
            </ul>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import GaugeChart from '@/components/charts/GaugeChart.vue'

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
.health-metric {
  padding: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.metric-label {
  font-weight: 500;
  font-size: 13px;
}

.metric-value {
  font-weight: 600;
  font-size: 16px;
}

.metric-description {
  font-size: 11px;
  opacity: 0.6;
  margin-top: 4px;
}

.health-recommendations {
  margin-top: 12px;
}

.recommendations-title {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 600;
}

.recommendations-list {
  margin: 0;
  padding-left: 20px;
  font-size: 12px;
  line-height: 1.6;
}

.recommendations-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 6px;
}
</style>
