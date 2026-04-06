<template>
  <div>
    <!-- Filters -->
    <v-row class="mb-6">
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-text-field
          v-model="searchQuery"
          :label="
            $formatMessage({
              description: 'Search books label',
              defaultMessage: 'Search',
              id: 'rh-filter-search',
            })
          "
          prepend-icon="i-mdi:magnify"
          density="compact"
          clearable
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-select
          v-model="sortBy"
          :label="
            $formatMessage({
              description: 'Sort by label',
              defaultMessage: 'Sort By',
              id: 'rh-filter-sort',
            })
          "
          :items="[
            { value: 'date-desc', title: 'Newest First' },
            { value: 'date-asc', title: 'Oldest First' },
            { value: 'title', title: 'Title (A-Z)' },
          ]"
          density="compact"
        />
      </v-col>
    </v-row>

    <!-- Timeline -->
    <div v-if="filteredHistory.length > 0">
      <v-timeline
        layout="dense"
      >
        <v-timeline-item
          v-for="(item, index) in filteredHistory"
          :key="`timeline-${index}`"
          :dot-color="getDotColor(index)"
          size="small"
        >
          <template #opposite>
            <div class="text-caption text-medium-emphasis">
              {{ $formatDate(item.lastModified, { dateStyle: 'short' }) }}
            </div>
          </template>

          <ReadingTimelineItem :series="item" />
        </v-timeline-item>
      </v-timeline>
    </div>
    <div
      v-else
      class="text-center py-8"
    >
      <v-icon
        icon="i-mdi:book-open"
        size="48"
        opacity="0.3"
        class="mb-4 d-block"
      />
      {{
        $formatMessage({
          description: 'Empty reading timeline',
          defaultMessage: 'Start reading to see your timeline',
          id: 'rh-timeline-empty',
        })
      }}
    </div>

    <!-- Pagination -->
    <v-row
      v-if="totalPages > 1"
      class="mt-6"
      justify="center"
    >
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        @update:model-value="onPageChange"
      />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import ReadingTimelineItem from './ReadingTimelineItem.vue'

const props = defineProps<{
  readingHistory: any
  isLoading: boolean
}>()

const emit = defineEmits<{
  'update:pagination': [page: number, size: number]
}>()

const searchQuery = ref('')
const sortBy = ref('date-desc')
const currentPage = ref(1)
const itemsPerPage = 20

const filteredHistory = computed(() => {
  let items = props.readingHistory?.content || []

  // Filter by search
  if (searchQuery.value) {
    items = items.filter((item: any) =>
      item.metadata?.title?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  // Sort
  switch (sortBy.value) {
    case 'date-asc':
      items.sort(
        (a: any, b: any) =>
          new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime(),
      )
      break
    case 'title':
      items.sort((a: any, b: any) =>
        (a.metadata?.title || '').localeCompare(b.metadata?.title || ''),
      )
      break
    case 'date-desc':
    default:
      items.sort(
        (a: any, b: any) =>
          new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
      )
  }

  return items
})

const totalPages = computed(() =>
  Math.ceil((filteredHistory.value?.length || 0) / itemsPerPage),
)

const getDotColor = (index: number | string): string => {
  const colors: string[] = ['primary', 'success', 'warning', 'info', 'error']
  const numIndex = typeof index === 'string' ? parseInt(index, 10) : index
  return colors[numIndex % colors.length] ?? 'primary'
}

const onPageChange = (page: number) => {
  emit('update:pagination', page - 1, itemsPerPage)
}
</script>
