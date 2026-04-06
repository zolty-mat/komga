<template>
  <v-container
    fluid
    class="dashboard-container pa-4"
  >
    <!-- Page header -->
    <div class="page-header mb-6">
      <h1 class="page-title">Analytics & Statistics</h1>
      <p class="page-subtitle">Comprehensive overview of your library and reading progress</p>
    </div>

    <!-- Loading skeleton -->
    <template v-if="isLoading">
      <v-row>
        <v-col
          v-for="i in 6"
          :key="`skeleton-${i}`"
          cols="12"
          sm="6"
          md="4"
        >
          <v-skeleton-loader
            type="card"
            height="150"
          />
        </v-col>
      </v-row>
    </template>

    <!-- Main content -->
    <template v-else>
      <!-- Overview Cards -->
      <OverviewCards
        :stats="libraryStats"
        :is-loading="isLoadingLibraryStats"
      />

      <!-- Genre Analysis -->
      <section class="analytics-section mb-8">
        <h2 class="section-title mb-4">Genre Analysis</h2>
        <GenreAnalysis
          :genres="genreStats?.genres"
          :is-loading="isLoadingGenreStats"
        />
      </section>

      <!-- Author Insights -->
      <section class="analytics-section mb-8">
        <h2 class="section-title mb-4">Author Insights</h2>
        <AuthorInsights
          :authors="authorStats?.authors"
          :is-loading="isLoadingAuthorStats"
        />
      </section>

      <!-- Library Health -->
      <section class="analytics-section mb-8">
        <h2 class="section-title mb-4">Library Health & Recommendations</h2>
        <LibraryHealth
          :stats="libraryStats"
          :is-loading="isLoadingLibraryStats"
        />
      </section>

      <!-- Additional Sections -->
      <v-row class="mt-8">
        <!-- Language Distribution -->
        <v-col
          cols="12"
          md="6"
        >
          <PieChart
            :items="languageChartItems"
            title="Language Distribution"
            :is-loading="isLoadingLanguageStats"
          />
        </v-col>

        <!-- Publisher Stats -->
        <v-col
          cols="12"
          md="6"
        >
          <BarChart
            :items="publisherChartItems"
            title="Top Publishers"
            :is-loading="isLoadingPublisherStats"
          />
        </v-col>
      </v-row>

      <!-- Publication Timeline -->
      <section class="analytics-section mt-8">
        <h2 class="section-title mb-4">Publishing Timeline</h2>
        <v-card :loading="isLoadingPublicationTimeline">
          <v-card-title>Books by Decade</v-card-title>
          <v-card-text>
            <LineChart
              :items="publicationTimelineChartItems"
              title="Publication Timeline"
              :is-loading="isLoadingPublicationTimeline"
            />

            <div v-if="publicationTimeline" class="timeline-info mt-6">
              <v-row>
                <v-col cols="12" sm="6" class="text-center">
                  <div class="info-label">Oldest Book</div>
                  <div class="info-value">{{ publicationTimeline.oldestYear ?? 'N/A' }}</div>
                </v-col>
                <v-col cols="12" sm="6" class="text-center">
                  <div class="info-label">Newest Book</div>
                  <div class="info-value">{{ publicationTimeline.newestYear ?? 'N/A' }}</div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </section>

      <!-- Completion by Genre -->
      <section class="analytics-section mt-8">
        <h2 class="section-title mb-4">Completion by Genre</h2>
        <v-card :loading="isLoadingCompletionByGenre">
          <v-card-title>Genre Completion Rates</v-card-title>
          <v-card-text>
            <div
              v-if="completionByGenre?.genres"
              class="genre-completion-list"
            >
              <div
                v-for="genre in completionByGenre.genres"
                :key="genre.name"
                class="completion-item"
              >
                <div class="completion-header">
                  <span class="genre-name">{{ genre.name }}</span>
                  <span class="completion-percent">{{ genre.completionPercent }}%</span>
                </div>
                <v-progress-linear
                  :model-value="genre.completionPercent"
                  height="8"
                  rounded
                  class="mt-2"
                />
                <div class="completion-details">
                  {{ genre.completed }}/{{ genre.total }} books read
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </section>

      <!-- User Comparison -->
      <section class="analytics-section mt-8 mb-8">
        <h2 class="section-title mb-4">Your Progress vs Library Average</h2>
        <v-row>
          <v-col
            v-for="metric in comparisonMetrics"
            :key="metric.label"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card :loading="isLoadingUserComparison">
              <v-card-text>
                <div class="comparison-metric">
                  <div class="metric-label">{{ metric.label }}</div>
                  <div class="metric-bars">
                    <div class="bar-row">
                      <span class="bar-label">Your Progress</span>
                      <div class="bar-container">
                        <div
                          class="bar user-bar"
                          :style="{ width: userComparison?.user?.[metric.key] + '%' }"
                        />
                      </div>
                      <span class="bar-value">{{ userComparison?.user?.[metric.key] ?? 0 }}%</span>
                    </div>
                    <div class="bar-row mt-2">
                      <span class="bar-label">Library Avg</span>
                      <div class="bar-container">
                        <div
                          class="bar library-bar"
                          :style="{ width: userComparison?.library?.[metric.key] + '%' }"
                        />
                      </div>
                      <span class="bar-value">{{ userComparison?.library?.[metric.key] ?? 0 }}%</span>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </section>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useQuery } from '@pinia/colada'
import {
  libraryStatsQuery,
  genreStatsQuery,
  authorStatsQuery,
  publisherStatsQuery,
  languageStatsQuery,
  publicationTimelineQuery,
  completionByGenreQuery,
  userLibraryComparisonQuery,
} from '@/colada/analytics'
import OverviewCards from '@/components/dashboard/OverviewCards.vue'
import GenreAnalysis from '@/components/dashboard/GenreAnalysis.vue'
import AuthorInsights from '@/components/dashboard/AuthorInsights.vue'
import LibraryHealth from '@/components/dashboard/LibraryHealth.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import LineChart from '@/components/charts/LineChart.vue'

// Library stats
const { data: libraryStats, pending: isLoadingLibraryStats } = useQuery(libraryStatsQuery())

// Genre stats
const { data: genreStats, pending: isLoadingGenreStats } = useQuery(genreStatsQuery())

// Author stats
const { data: authorStats, pending: isLoadingAuthorStats } = useQuery(authorStatsQuery())

// Publisher stats
const { data: publisherStats, pending: isLoadingPublisherStats } = useQuery(publisherStatsQuery())

// Language stats
const { data: languageStats, pending: isLoadingLanguageStats } = useQuery(languageStatsQuery())

// Publication timeline
const { data: publicationTimeline, pending: isLoadingPublicationTimeline } = useQuery(
  publicationTimelineQuery(),
)

// Completion by genre
const { data: completionByGenre, pending: isLoadingCompletionByGenre } = useQuery(
  completionByGenreQuery(),
)

// User comparison
const { data: userComparison, pending: isLoadingUserComparison } = useQuery(
  userLibraryComparisonQuery(),
)

// Chart data computations
const languageChartItems = computed(() =>
  languageStats.value?.languages?.map(l => ({
    name: l.name,
    value: l.value,
  })) ?? [],
)

const publisherChartItems = computed(() =>
  publisherStats.value?.topPublishers?.map(p => ({
    name: p.name,
    value: p.totalBooks,
  })) ?? [],
)

const publicationTimelineChartItems = computed(() =>
  publicationTimeline.value?.timeline?.map(t => ({
    label: t.decade,
    value: t.count,
  })) ?? [],
)

const comparisonMetrics = computed(() => [
  {
    label: 'Books Read %',
    key: 'booksReadPercent',
  },
  {
    label: 'Series Started %',
    key: 'seriesStartedPercent',
  },
  {
    label: 'Series Completed %',
    key: 'seriesCompletedPercent',
  },
])

const isLoading = computed(
  () =>
    isLoadingLibraryStats.value ||
    isLoadingGenreStats.value ||
    isLoadingAuthorStats.value ||
    isLoadingPublisherStats.value ||
    isLoadingLanguageStats.value ||
    isLoadingPublicationTimeline.value ||
    isLoadingCompletionByGenre.value ||
    isLoadingUserComparison.value,
)
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  opacity: 0.7;
  margin: 0;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.analytics-section {
  scroll-margin-top: 20px;
}

.timeline-info {
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.info-label {
  font-size: 12px;
  opacity: 0.6;
  margin-bottom: 4px;
}

.info-value {
  font-size: 20px;
  font-weight: 600;
}

.genre-completion-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.completion-item {
  padding: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.completion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.genre-name {
  font-weight: 500;
}

.completion-percent {
  font-weight: 600;
  font-size: 14px;
}

.completion-details {
  font-size: 11px;
  opacity: 0.6;
  margin-top: 6px;
}

.comparison-metric {
  padding: 4px;
}

.metric-label {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 12px;
}

.metric-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bar-row {
  display: grid;
  grid-template-columns: 80px 1fr 50px;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.bar-label {
  opacity: 0.6;
}

.bar-container {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  height: 20px;
  overflow: hidden;
}

.bar {
  height: 100%;
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
}

.user-bar {
  background: linear-gradient(90deg, #4caf50, #45a049);
}

.library-bar {
  background: linear-gradient(90deg, #2196f3, #1976d2);
}

.bar-value {
  text-align: right;
  font-weight: 500;
}
</style>

<route lang="yaml">
meta:
  title: Analytics & Statistics
</route>
