<template>
  <v-container
    fluid
    class="pa-0 pa-sm-4 h-100 h-sm-auto"
  >
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center gap-3">
            <v-icon icon="i-mdi:book-open-page-variant" />
            {{
              $formatMessage({
                description: 'Reading history page title',
                defaultMessage: 'Reading History',
                id: 'rh-title-001',
              })
            }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6 ga-4">
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <StatCard
          :label="
            $formatMessage({
              description: 'Books read stat label',
              defaultMessage: 'Books Read',
              id: 'rh-stat-001',
            })
          "
          :value="stats?.totalRead ?? 0"
          icon="i-mdi:book-check"
          color="success"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <StatCard
          :label="
            $formatMessage({
              description: 'Current reading streak stat label',
              defaultMessage: 'Current Streak',
              id: 'rh-stat-002',
            })
          "
          :value="`${streak?.currentStreak ?? 0} days`"
          icon="i-mdi:fire"
          color="warning"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <StatCard
          :label="
            $formatMessage({
              description: 'Longest reading streak stat label',
              defaultMessage: 'Longest Streak',
              id: 'rh-stat-003',
            })
          "
          :value="`${streak?.longestStreak ?? 0} days`"
          icon="i-mdi:trophy"
          color="info"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <StatCard
          :label="
            $formatMessage({
              description: 'Average books per month stat label',
              defaultMessage: 'Avg/Month',
              id: 'rh-stat-004',
            })
          "
          :value="String(stats?.averagePerMonth ?? 0)"
          icon="i-mdi:chart-line"
          color="primary"
        />
      </v-col>
    </v-row>

    <!-- Reading Stats Chart -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{
              $formatMessage({
                description: 'Reading stats chart title',
                defaultMessage: 'Books Read Per Month',
                id: 'rh-chart-001',
              })
            }}
          </v-card-title>
          <v-card-text>
            <ReadingStatsChart
              :monthly-stats="stats?.monthlyStats ?? []"
              :yearly-stats="stats?.yearlyStats ?? []"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Currently Reading Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{
              $formatMessage({
                description: 'Currently reading section title',
                defaultMessage: 'Currently Reading',
                id: 'rh-section-001',
              })
            }}
          </v-card-title>
          <v-card-text v-if="currentlyReading?.content?.length ?? 0 > 0">
            <v-row class="ga-4">
              <v-col
                v-for="series in currentlyReading?.content ?? []"
                :key="series.id"
                cols="12"
                sm="6"
                md="4"
              >
                <CurrentlyReadingCard :series="series" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-else>
            {{
              $formatMessage({
                description: 'Empty currently reading state',
                defaultMessage: 'No books currently being read',
                id: 'rh-empty-001',
              })
            }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reading Timeline -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{
              $formatMessage({
                description: 'Reading timeline section title',
                defaultMessage: 'Reading Timeline',
                id: 'rh-timeline-001',
              })
            }}
          </v-card-title>
          <v-card-text>
            <ReadingTimeline
              :reading-history="readingHistory"
              :is-loading="historyLoading"
              @update:pagination="updatePagination"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import {
  readingHistoryQuery,
  readingStatsQuery,
  currentlyReadingQuery,
  readingStreakQuery,
} from '@/colada/history'
import StatCard from '@/components/reading-history/StatCard.vue'
import ReadingStatsChart from '@/components/reading-history/ReadingStatsChart.vue'
import CurrentlyReadingCard from '@/components/reading-history/CurrentlyReadingCard.vue'
import ReadingTimeline from '@/components/reading-history/ReadingTimeline.vue'

const { data: readingHistory, isLoading: historyLoading } = useQuery(() =>
  readingHistoryQuery({ page: 0, size: 50 }),
)

const { data: stats } = useQuery(() => readingStatsQuery())

const { data: currentlyReading } = useQuery(() => currentlyReadingQuery())

const { data: streak } = useQuery(() => readingStreakQuery())

const updatePagination = (page: number, size: number) => {
  // Can implement pagination if needed
}
</script>

<route lang="yaml">
meta:
  layout: 'default'
</route>
