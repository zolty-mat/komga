<template>
  <v-list>
    <v-list-subheader>
      <div class="d-flex ga-2 align-center">
        <span>{{ intl.formatMessage(commonMessages.filterPanelHeader) }}</span>
        <v-chip
          v-if="hasFilters"
          color="primary"
          rounded
          closable
          variant="elevated"
          size="small"
          @click:close="$emit('clear')"
        >
          {{ filterCount }}
        </v-chip>
      </div>
    </v-list-subheader>

    <v-expansion-panels variant="accordion" flat tile>
      <!-- Library Filter -->
      <FilterExpansionPanel
        :title="intl.formatMessage(commonMessages.library)"
        :count="libraryId?.length || 0"
        @clear="libraryId = undefined"
      >
        <v-combobox
          v-model="libraryId"
          :items="libraries || []"
          item-title="name"
          item-value="id"
          multiple
          chips
          clearable
          density="compact"
          hide-details
          hide-no-data
        />
      </FilterExpansionPanel>

      <!-- Genre Filter -->
      <FilterExpansionPanel
        :title="intl.formatMessage(commonMessages.genre)"
        :count="genres?.length || 0"
        @clear="genres = undefined"
      >
        <v-combobox
          v-model="genres"
          :items="genresList || []"
          item-title="name"
          item-value="id"
          multiple
          chips
          clearable
          density="compact"
          hide-details
          :loading="genresLoading"
        />
      </FilterExpansionPanel>

      <!-- Language Filter -->
      <FilterExpansionPanel
        :title="intl.formatMessage(commonMessages.language)"
        :count="languages?.length || 0"
        @clear="languages = undefined"
      >
        <v-combobox
          v-model="languages"
          :items="languagesList || []"
          item-title="name"
          item-value="id"
          multiple
          chips
          clearable
          density="compact"
          hide-details
          :loading="languagesLoading"
        />
      </FilterExpansionPanel>

      <!-- Publisher Filter -->
      <FilterExpansionPanel
        :title="intl.formatMessage(commonMessages.publisher)"
        :count="publishers?.length || 0"
        @clear="publishers = undefined"
      >
        <v-combobox
          v-model="publishers"
          :items="publishersList || []"
          item-title="name"
          item-value="id"
          multiple
          chips
          clearable
          density="compact"
          hide-details
          :loading="publishersLoading"
        />
      </FilterExpansionPanel>

      <!-- Tag Filter -->
      <FilterExpansionPanel
        :title="intl.formatMessage(commonMessages.tag)"
        :count="tags?.length || 0"
        @clear="tags = undefined"
      >
        <v-combobox
          v-model="tags"
          :items="tagsList || []"
          item-title="name"
          item-value="id"
          multiple
          chips
          clearable
          density="compact"
          hide-details
          :loading="tagsLoading"
        />
      </FilterExpansionPanel>

      <!-- Content Options -->
      <v-expansion-panel :title="intl.formatMessage(commonMessages.options)">
        <template #text>
          <v-checkbox
            :model-value="oneshot === true"
            :label="intl.formatMessage(commonMessages.oneshot)"
            density="compact"
            hide-details
            @update:model-value="oneshot = $event ? true : undefined"
          />
          <v-checkbox
            :model-value="complete === true"
            :label="intl.formatMessage(commonMessages.complete)"
            density="compact"
            hide-details
            @update:model-value="complete = $event ? true : undefined"
          />
        </template>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-list>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useQuery } from '@pinia/colada'
import {
  genresQuery,
  languagesQuery,
  publishersQuery,
  authorsQuery,
  tagsQuery,
} from '@/colada/referential'
import { useGetLibrariesById } from '@/composables/libraries'
import FilterExpansionPanel from '@/components/filter/ExpansionPanel.vue'
import type { components } from '@/generated/openapi/komga'
import { useIntl } from 'vue-intl'

interface Props {
  libraryId?: string[]
  seriesStatus?: components['schemas']['SeriesStatus'][]
  genres?: components['schemas']['Genre'][]
  languages?: components['schemas']['Language'][]
  publishers?: components['schemas']['Publisher'][]
  authors?: components['schemas']['Author'][]
  tags?: components['schemas']['Tag'][]
  readStatus?: components['schemas']['ReadStatus'][]
  oneshot?: boolean
  complete?: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  'update:libraryId': [value: string[] | undefined]
  'update:seriesStatus': [value: components['schemas']['SeriesStatus'][] | undefined]
  'update:genres': [value: components['schemas']['Genre'][] | undefined]
  'update:languages': [value: components['schemas']['Language'][] | undefined]
  'update:publishers': [value: components['schemas']['Publisher'][] | undefined]
  'update:authors': [value: components['schemas']['Author'][] | undefined]
  'update:tags': [value: components['schemas']['Tag'][] | undefined]
  'update:readStatus': [value: components['schemas']['ReadStatus'][] | undefined]
  'update:oneshot': [value: boolean | undefined]
  'update:complete': [value: boolean | undefined]
  clear: []
}>()

const intl = useIntl()

const commonMessages = {
  filterPanelHeader: { id: 'common.filterPanelHeader', defaultMessage: 'Filters' },
  library: { id: 'common.library', defaultMessage: 'Library' },
  seriesStatus: { id: 'common.seriesStatus', defaultMessage: 'Series Status' },
  readStatus: { id: 'common.readStatus', defaultMessage: 'Read Status' },
  genre: { id: 'common.genre', defaultMessage: 'Genre' },
  language: { id: 'common.language', defaultMessage: 'Language' },
  publisher: { id: 'common.publisher', defaultMessage: 'Publisher' },
  author: { id: 'common.author', defaultMessage: 'Author' },
  tag: { id: 'common.tag', defaultMessage: 'Tag' },
  options: { id: 'common.options', defaultMessage: 'Options' },
  oneshot: { id: 'common.oneshot', defaultMessage: 'Oneshot Only' },
  complete: { id: 'common.complete', defaultMessage: 'Complete Only' },
}

// v-models
const libraryId = computed({
  get: () => props.libraryId,
  set: (value) => emit('update:libraryId', value),
})

const seriesStatus = computed({
  get: () => props.seriesStatus,
  set: (value) => emit('update:seriesStatus', value),
})

const genres = computed({
  get: () => props.genres,
  set: (value) => emit('update:genres', value),
})

const languages = computed({
  get: () => props.languages,
  set: (value) => emit('update:languages', value),
})

const publishers = computed({
  get: () => props.publishers,
  set: (value) => emit('update:publishers', value),
})

const authors = computed({
  get: () => props.authors,
  set: (value) => emit('update:authors', value),
})

const tags = computed({
  get: () => props.tags,
  set: (value) => emit('update:tags', value),
})


const oneshot = computed({
  get: () => props.oneshot,
  set: (value) => emit('update:oneshot', value),
})

const complete = computed({
  get: () => props.complete,
  set: (value) => emit('update:complete', value),
})

const hasFilters = computed(() => {
  return !!(
    libraryId.value?.length ||
    genres.value?.length ||
    languages.value?.length ||
    publishers.value?.length ||
    authors.value?.length ||
    tags.value?.length ||
    oneshot.value ||
    complete.value
  )
})

const filterCount = computed(() => {
  let count = 0
  if (libraryId.value?.length) count++
  if (genres.value?.length) count++
  if (languages.value?.length) count++
  if (publishers.value?.length) count++
  if (authors.value?.length) count++
  if (tags.value?.length) count++
  if (oneshot.value) count++
  if (complete.value) count++
  return count
})

// Load libraries
const { libraries } = useGetLibrariesById(
  computed(() => libraryId.value),
)

// Load referential data
const genresQuery_ = useQuery(computed(() => genresQuery({ library_id: libraryId.value })))
const languagesQuery_ = useQuery(computed(() => languagesQuery({ library_id: libraryId.value })))
const publishersQuery_ = useQuery(computed(() => publishersQuery({ library_id: libraryId.value })))
const authorsQuery_ = useQuery(computed(() => authorsQuery({ library_id: libraryId.value })))
const tagsQuery_ = useQuery(computed(() => tagsQuery({ library_id: libraryId.value })))

const genresList = computed(() => genresQuery_.data.value?.content)
const languagesList = computed(() => languagesQuery_.data.value?.content)
const publishersList = computed(() => publishersQuery_.data.value?.content)
const authorsList = computed(() => authorsQuery_.data.value?.content)
const tagsList = computed(() => tagsQuery_.data.value?.content)

const genresLoading = computed(() => genresQuery_.isLoading.value)
const languagesLoading = computed(() => languagesQuery_.isLoading.value)
const publishersLoading = computed(() => publishersQuery_.isLoading.value)
const authorsLoading = computed(() => authorsQuery_.isLoading.value)
const tagsLoading = computed(() => tagsQuery_.isLoading.value)
</script>
