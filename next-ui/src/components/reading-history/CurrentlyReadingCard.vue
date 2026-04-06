<template>
  <v-card
    :to="`/media/series/${series.id}`"
    class="h-100 d-flex flex-column cursor-pointer hover:shadow-lg transition-shadow"
  >
    <!-- Cover -->
    <v-img
      :src="`/api/v1/series/${series.id}/thumbnail`"
      aspect-ratio="2/3"
      class="bg-surface"
    />

    <!-- Info -->
    <v-card-text class="flex-grow-1 d-flex flex-column">
      <v-card-title class="text-subtitle-1 line-clamp-2">
        {{ series.metadata?.title }}
      </v-card-title>

      <!-- Progress Bar -->
      <div class="mb-3">
        <div class="text-caption text-medium-emphasis mb-1">
          {{
            $formatMessage(
              { defaultMessage: 'Progress: {read}/{total}', id: 'rh-progress-001' },
              {
                read: series.booksReadCount || 0,
                total: series.booksCount || 0,
              },
            )
          }}
        </div>
        <v-progress-linear
          :model-value="progressPercentage"
          rounded
          height="8"
        />
      </div>

      <!-- Dates -->
      <div class="text-caption text-medium-emphasis">
        <div>
          {{
            $formatMessage(
              { defaultMessage: 'Created', id: 'rh-dates-001' },
              {
                date: $formatDate(series.created, {
                  dateStyle: 'short',
                }),
              },
            )
          }}
        </div>
        <div>
          {{
            $formatMessage(
              { defaultMessage: 'Last modified', id: 'rh-dates-002' },
              {
                date: $formatDate(series.lastModified, {
                  dateStyle: 'short',
                }),
              },
            )
          }}
        </div>
      </div>
    </v-card-text>

    <!-- Actions -->
    <v-card-actions class="pt-0">
      <v-btn
        size="small"
        variant="text"
        @click.prevent="markAsFinished"
      >
        {{
          $formatMessage({
            description: 'View series button',
            defaultMessage: 'View',
            id: 'rh-action-001',
          })
        }}
      </v-btn>
    </v-card-actions>
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

const markAsFinished = async () => {
  // Navigation handled by card link
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
