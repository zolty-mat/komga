<template>
  <v-card
    :to="`/media/series/${series.id}`"
    variant="flat"
  >
    <v-row class="pa-4" no-gutters>
      <!-- Thumbnail -->
      <v-col cols="auto" class="mr-4">
        <v-img
          :src="`/api/v1/series/${series.id}/thumbnail`"
          width="80"
          height="120"
          aspect-ratio="2/3"
          class="bg-surface"
        />
      </v-col>

      <!-- Content -->
      <v-col>
        <div class="d-flex flex-column h-100">
          <!-- Title & Series -->
          <div class="flex-grow-1">
            <v-card-title class="text-subtitle-1 pb-1">
              {{ series.metadata?.title }}
            </v-card-title>

            <div
              v-if="series.name"
              class="text-caption text-medium-emphasis pl-4 mb-2"
            >
              {{
                $formatMessage(
                  { defaultMessage: 'Series: {name}', id: 'rh-timeline-series' },
                  { name: series.name },
                )
              }}
            </div>

            <!-- Reading Progress -->
            <div class="text-caption pl-4 mb-2">
              <v-chip
                v-if="series.booksReadCount >= series.booksCount"
                size="small"
                color="success"
                text-color="white"
              >
                <v-icon start icon="i-mdi:check-circle" />
                {{
                  $formatMessage({
                    description: 'Completed label',
                    defaultMessage: 'Completed',
                    id: 'rh-timeline-completed',
                  })
                }}
              </v-chip>
              <v-chip
                v-else-if="series.booksInProgressCount > 0"
                size="small"
                color="info"
              >
                {{
                  $formatMessage(
                    { defaultMessage: '{percent}% Read', id: 'rh-timeline-progress' },
                    { percent: progressPercentage },
                  )
                }}
              </v-chip>
              <v-chip
                v-else
                size="small"
                color="warning"
              >
                {{
                  $formatMessage({
                    description: 'Not started label',
                    defaultMessage: 'Not Started',
                    id: 'rh-timeline-notstarted',
                  })
                }}
              </v-chip>
            </div>

            <!-- Stats -->
            <div class="text-caption text-medium-emphasis pl-4">
              {{
                $formatMessage(
                  {
                    defaultMessage: 'Read: {read}/{total}',
                    id: 'rh-timeline-stats',
                  },
                  { read: series.booksReadCount || 0, total: series.booksCount || 0 },
                )
              }}
            </div>
          </div>

          <!-- Date Footer -->
          <div class="text-caption text-medium-emphasis mt-3 pt-3 border-t">
            {{
              $formatMessage(
                { defaultMessage: 'Modified: {date}', id: 'rh-timeline-finished' },
                {
                  date: $formatDate(series.lastModified, {
                    dateStyle: 'medium',
                  }),
                },
              )
            }}
          </div>
        </div>
      </v-col>

      <!-- Action Menu -->
      <v-col cols="auto">
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              icon="i-mdi:dots-vertical"
              variant="text"
              size="small"
              v-bind="props"
              @click.prevent
            />
          </template>

          <v-list>
            <v-list-item
              :to="`/media/series/${series.id}`"
              prepend-icon="i-mdi:open-in-new"
            >
              <v-list-item-title>
                {{
                  $formatMessage({
                    description: 'View details action',
                    defaultMessage: 'View Details',
                    id: 'rh-action-view',
                  })
                }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  series: any
}>()

const progressPercentage = computed(() => {
  if (!props.series.booksCount) return 0
  return Math.round((props.series.booksReadCount / props.series.booksCount) * 100)
})
</script>

<style scoped>
.border-t {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
