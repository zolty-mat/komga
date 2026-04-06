<template>
  <v-app-bar>
    <v-text-field
      v-model="searchQuery"
      placeholder="Search series, books, authors..."
      variant="outlined"
      density="compact"
      prepend-inner-icon="i-mdi:magnify"
      clearable
      :loading="isSearching"
      class="flex-grow-1 mx-4"
      @update:model-value="onSearchChange"
    />

    <v-spacer />

    <PosterSizeSlider />

    <PresentationSelector
      v-if="display.smAndUp.value"
      v-model="presentationMode"
      :modes="['grid', 'list']"
      toggle
    />

    <PageSizeSelector
      v-if="appStore.isBrowsingPaged"
      v-model="appStore.browsingPageSize"
      :sizes="[10, 20, 50]"
    />

    <v-badge
      location="top right"
      color="primary"
      :content="filterCount"
      :model-value="filterCount > 0"
      class="pe-4"
      offset-x="7"
      offset-y="7"
    >
      <v-icon-btn
        icon="i-mdi:filter-variant"
        @click="filterDrawer = true"
      />
    </v-badge>
  </v-app-bar>

  <div class="d-flex ga-4 pa-4">
    <!-- Filter Sidebar -->
    <TempDrawer
      v-model="filterDrawer"
      width="400"
    >
      <SearchFilters
        v-model:library-id="filters.libraryId"
        v-model:series-status="filters.seriesStatus"
        v-model:genres="filters.genres"
        v-model:languages="filters.languages"
        v-model:publishers="filters.publishers"
        v-model:authors="filters.authors"
        v-model:tags="filters.tags"
        v-model:read-status="filters.readStatus"
        v-model:oneshot="filters.oneshot"
        v-model:complete="filters.complete"
        @clear="clearFilters"
      />
    </TempDrawer>

    <!-- Main Content -->
    <div
      class="flex-grow-1"
      style="overflow-y: auto"
    >
      <div
        v-if="!searchQuery"
        class="text-center pa-8"
      >
        <v-icon
          size="64"
          color="grey"
          class="mb-4"
        >
          i-mdi:magnify
        </v-icon>
        <p class="text-h6 mb-2">{{ intl.formatMessage(searchMessages.emptyState) }}</p>
        <p class="text-caption text-medium-emphasis">
          {{ intl.formatMessage(searchMessages.emptyHint) }}
        </p>
      </div>

      <div v-else-if="isSearching">
        <v-skeleton-loader
          type="image@6"
          :loading="true"
        />
      </div>

      <div v-else-if="hasError">
        <v-alert
          type="error"
          variant="tonal"
        >
          {{ intl.formatMessage(searchMessages.searchError) }}
        </v-alert>
      </div>

      <div v-else-if="!hasResults">
        <v-alert
          type="info"
          variant="tonal"
        >
          {{ intl.formatMessage(searchMessages.noResults, { query: searchQuery }) }}
        </v-alert>
      </div>

      <div v-else>
        <!-- Results Tabs -->
        <v-tabs
          v-model="activeTab"
          class="mb-4"
        >
          <v-tab
            v-if="seriesResults.data.value?.content.length"
            value="series"
          >
            {{ intl.formatMessage(searchMessages.seriesResults, { count: seriesResults.data.value?.totalElements || 0 }) }}
          </v-tab>
          <v-tab
            v-if="booksResults.data.value?.content.length"
            value="books"
          >
            {{ intl.formatMessage(searchMessages.bookResults, { count: booksResults.data.value?.totalElements || 0 }) }}
          </v-tab>
          <v-tab
            v-if="authorsResults.data.value?.content.length"
            value="authors"
          >
            {{ intl.formatMessage(searchMessages.authorResults, { count: authorsResults.data.value?.totalElements || 0 }) }}
          </v-tab>
        </v-tabs>

        <!-- Series Results -->
        <div v-if="activeTab === 'series'">
          <div class="d-flex ga-2 align-center mb-4">
            <span class="text-subtitle2">{{ intl.formatMessage(commonMessages.sortBy) }}</span>
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              density="compact"
              hide-details
              style="max-width: 200px"
            />
          </div>

          <div
            class="gap-4"
            :style="`display: ${presentationMode === 'grid' ? 'grid' : 'flex'}; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); flex-direction: column;`"
          >
            <template v-for="series of seriesSorted" :key="series.id">
              <SeriesCard
                :series="series"
                @click="navigateToSeries(series.id)"
              />
            </template>
          </div>

          <v-pagination
            v-model="currentPage"
            :length="seriesResults.data.value?.totalPages || 1"
            class="mt-6"
          />
        </div>

        <!-- Books Results -->
        <div v-if="activeTab === 'books'">
          <div class="d-flex ga-2 align-center mb-4">
            <span class="text-subtitle2">{{ intl.formatMessage(commonMessages.sortBy) }}</span>
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              density="compact"
              hide-details
              style="max-width: 200px"
            />
          </div>

          <div
            class="gap-4"
            :style="`display: ${presentationMode === 'grid' ? 'grid' : 'flex'}; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); flex-direction: column;`"
          >
            <template v-for="book of booksSorted" :key="book.id">
              <BookCard
                :book="book"
                @click="navigateToBook(book.id)"
              />
            </template>
          </div>

          <v-pagination
            v-model="currentPage"
            :length="booksResults.data.value?.totalPages || 1"
            class="mt-6"
          />
        </div>

        <!-- Authors Results -->
        <div v-if="activeTab === 'authors'">
          <div class="gap-4 d-flex flex-column">
            <template v-for="author of authorsResults.data.value?.content" :key="author.id">
              <AuthorCard
                :author="author"
                @click="navigateToAuthor(author.id)"
              />
            </template>
          </div>

          <v-pagination
            v-model="currentPage"
            :length="authorsResults.data.value?.totalPages || 1"
            class="mt-6"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@pinia/colada'
import { seriesSearchQuery, booksSearchQuery, authorsSearchQuery, type SearchFilters as SearchFilterParams } from '@/colada/search'
import { useAppStore } from '@/stores/app'
import { useDisplay } from 'vuetify'
import SearchFilters from '@/components/search/SearchFilters.vue'
import AuthorCard from '@/components/search/AuthorCard.vue'
import TempDrawer from '@/components/TempDrawer.vue'
import PosterSizeSlider from '@/components/PosterSizeSlider.vue'
import PresentationSelector from '@/components/PresentationSelector.vue'
import PageSizeSelector from '@/components/PageSizeSelector.vue'
import { useIntl } from 'vue-intl'

const intl = useIntl()

// i18n messages
const searchMessages = {
  emptyState: { id: 'search.empty', defaultMessage: 'Start searching' },
  emptyHint: { id: 'search.emptyHint', defaultMessage: 'Enter series, book, or author name' },
  noResults: { id: 'search.noResults', defaultMessage: 'No results for "{query}"' },
  searchError: { id: 'search.error', defaultMessage: 'Failed to search. Please try again.' },
  seriesResults: { id: 'search.seriesResults', defaultMessage: 'Series ({count})' },
  bookResults: { id: 'search.bookResults', defaultMessage: 'Books ({count})' },
  authorResults: { id: 'search.authorResults', defaultMessage: 'Authors ({count})' },
}

const commonMessages = {
  sortBy: { id: 'common.sortBy', defaultMessage: 'Sort by' },
  filterPanelHeader: { id: 'common.filterPanelHeader', defaultMessage: 'Filters' },
}

const router = useRouter()
const appStore = useAppStore()
const display = useDisplay()

const searchQuery = ref('')
const filterDrawer = ref(false)
const activeTab = ref('series')
const currentPage = ref(1)
const presentationMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('relevance')
const isSearching = ref(false)

const filters = reactive<SearchFilterParams>({
  libraryId: undefined,
  seriesStatus: undefined,
  genres: undefined,
  languages: undefined,
  publishers: undefined,
  authors: undefined,
  tags: undefined,
  readStatus: undefined,
  oneshot: undefined,
  complete: undefined,
})

const sortOptions = [
  { title: 'Relevance', value: 'relevance' },
  { title: 'Title (A-Z)', value: 'title-asc' },
  { title: 'Title (Z-A)', value: 'title-desc' },
  { title: 'Date Added (Newest)', value: 'date-desc' },
  { title: 'Date Added (Oldest)', value: 'date-asc' },
]

// Debounced search
let searchTimeout: number
const onSearchChange = () => {
  isSearching.value = true
  clearTimeout(searchTimeout)
  searchTimeout = window.setTimeout(() => {
    currentPage.value = 1
    isSearching.value = false
  }, 500)
}

// Query series
const seriesResults = useQuery(
  computed(() =>
    seriesSearchQuery({
      query: searchQuery.value,
      filters,
      pageRequest: { page: currentPage.value - 1, size: appStore.browsingPageSize },
    }),
  ),
)

// Query books
const booksResults = useQuery(
  computed(() =>
    booksSearchQuery({
      query: searchQuery.value,
      filters,
      pageRequest: { page: currentPage.value - 1, size: appStore.browsingPageSize },
    }),
  ),
)

// Query authors
const authorsResults = useQuery(
  computed(() =>
    authorsSearchQuery({
      query: searchQuery.value,
      filters,
      pageRequest: { page: currentPage.value - 1, size: appStore.browsingPageSize },
    }),
  ),
)

const hasError = computed(
  () => seriesResults.error.value || booksResults.error.value || authorsResults.error.value,
)

const hasResults = computed(() => {
  const series = seriesResults.data.value?.content.length || 0
  const books = booksResults.data.value?.content.length || 0
  const authors = authorsResults.data.value?.content.length || 0
  return series + books + authors > 0
})

const filterCount = computed(() => {
  let count = 0
  if (filters.libraryId?.length) count++
  if (filters.seriesStatus?.length) count++
  if (filters.genres?.length) count++
  if (filters.languages?.length) count++
  if (filters.publishers?.length) count++
  if (filters.authors?.length) count++
  if (filters.tags?.length) count++
  if (filters.readStatus?.length) count++
  if (filters.oneshot !== undefined) count++
  if (filters.complete !== undefined) count++
  return count
})

// Sorting
const seriesSorted = computed(() => {
  const items = seriesResults.data.value?.content || []
  const sorted = [...items]

  if (sortBy.value === 'title-asc') {
    sorted.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title))
  } else if (sortBy.value === 'title-desc') {
    sorted.sort((a, b) => b.metadata.title.localeCompare(a.metadata.title))
  } else if (sortBy.value === 'date-desc') {
    sorted.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
  } else if (sortBy.value === 'date-asc') {
    sorted.sort((a, b) => new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime())
  }

  return sorted
})

const booksSorted = computed(() => {
  const items = booksResults.data.value?.content || []
  const sorted = [...items]

  if (sortBy.value === 'title-asc') {
    sorted.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title))
  } else if (sortBy.value === 'title-desc') {
    sorted.sort((a, b) => b.metadata.title.localeCompare(a.metadata.title))
  } else if (sortBy.value === 'date-desc') {
    sorted.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
  } else if (sortBy.value === 'date-asc') {
    sorted.sort((a, b) => new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime())
  }

  return sorted
})

const clearFilters = () => {
  filters.libraryId = undefined
  filters.seriesStatus = undefined
  filters.genres = undefined
  filters.languages = undefined
  filters.publishers = undefined
  filters.authors = undefined
  filters.tags = undefined
  filters.readStatus = undefined
  filters.oneshot = undefined
  filters.complete = undefined
  currentPage.value = 1
}

const navigateToSeries = (seriesId: string) => {
  const libraryId = filters.libraryId?.[0] || '1'
  void router.push({
    name: '/libraries/[id]/series/[seriesId]',
    params: { id: libraryId, seriesId },
  })
}

const navigateToBook = (bookId: string) => {
  void router.push({
    name: '/media/books/[bookId]',
    params: { bookId },
  })
}

const navigateToAuthor = (authorId: string) => {
  void router.push({
    name: '/media/authors/[authorId]',
    params: { authorId },
  })
}

// Load search from URL on mount
const route = useRoute()
if (route.query.q) {
  searchQuery.value = String(route.query.q)
}
if (route.query.library) {
  filters.libraryId = [String(route.query.library)]
}

// Update URL with search state
watch([searchQuery, filters], () => {
  const params = new URLSearchParams()
  if (searchQuery.value) params.set('q', searchQuery.value)
  if (filters.libraryId?.length) params.set('library', filters.libraryId[0])
  void router.replace({ query: Object.fromEntries(params) })
})
</script>

<route lang="yaml">
meta:
  requiresRole: USER
</route>
