<template>
  <v-container
    fluid
    class="pa-4"
  >
    <div class="d-flex justify-space-between align-center mb-6 gap-4 flex-wrap">
      <h1 class="text-h4">
        {{
          $formatMessage({
            description: 'Readlists page: title',
            defaultMessage: 'Reading Lists',
            id: 'rgaklTI',
          })
        }}
      </h1>

      <div class="d-flex gap-2 align-center flex-wrap">
        <v-text-field
          v-model="searchQuery"
          :placeholder="
            $formatMessage({
              description: 'Readlists page: search placeholder',
              defaultMessage: 'Search readlists',
              id: 'rdr5/R5',
            })
          "
          size="small"
          hide-details
          class="flex-grow-1"
          style="max-width: 300px"
        />
        <v-btn
          icon="i-mdi:plus"
          size="small"
          @click="showCreateDialog = true"
        />
      </div>
    </div>

    <template v-if="readlistsLoading">
      <v-skeleton-loader
        type="card-heading, image, table-heading, table-row, table-row, table-row"
        class="mb-4"
      />
    </template>

    <template v-else-if="filteredReadlists.length === 0">
      <EmptyStateConstruction />
    </template>

    <template v-else>
      <v-row class="mb-6">
        <v-col
          v-for="rl in filteredReadlists"
          :key="rl.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="h-100 d-flex flex-column cursor-pointer"
            :to="`/libraries/${libraryId}/readlists/${rl.id}`"
          >
            <v-card-title class="text-h6">
              {{ rl.name }}
            </v-card-title>

            <v-card-subtitle
              v-if="rl.summary"
              class="text-body-2"
            >
              {{ rl.summary }}
            </v-card-subtitle>

            <v-card-text class="flex-grow-1">
              <div class="text-caption text-medium-emphasis">
                {{
                  $formatMessage({
                    description: 'Readlist card: book count',
                    defaultMessage: '{count} books',
                    id: 'raQyH9D',
                  },
                  { count: rl.bookIds?.length || 0 })
                }}
              </div>
              <div
                v-if="rl.lastModifiedDate"
                class="text-caption text-medium-emphasis mt-2"
              >
                {{
                  $formatMessage({
                    description: 'Readlist card: last modified',
                    defaultMessage: 'Last modified',
                    id: 'romWZYS',
                  })
                }}
                {{ formatDate(rl.lastModifiedDate) }}
              </div>
            </v-card-text>

            <v-card-actions class="pt-0">
              <v-spacer />
              <v-chip
                v-if="rl.ordered"
                size="small"
                variant="outlined"
              >
                {{
                  $formatMessage({
                    description: 'Readlist card: ordered badge',
                    defaultMessage: 'Ordered',
                    id: 'r7HxUs4',
                  })
                }}
              </v-chip>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <ReadlistCreateDialog
      v-model="showCreateDialog"
      :library-id="libraryId"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@pinia/colada'
import { readListsListQuery } from '@/colada/readlists'
import ReadlistCreateDialog from '@/components/ReadlistCreateDialog.vue'

const route = useRoute()
const libraryId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : id[0]
})

const searchQuery = ref('')
const showCreateDialog = ref(false)

const { data: readlistsData, isPending: readlistsLoading } = useQuery(
  readListsListQuery({
    search: undefined,
    libraryIds: computed(() => [libraryId.value]).value,
    pageRequest: { page: 0, size: 100, unpaged: false },
  }),
)

const readlists = computed(() => readlistsData.value?.content || [])

const filteredReadlists = computed(() => {
  if (!searchQuery.value) return readlists.value
  const query = searchQuery.value.toLowerCase()
  return readlists.value.filter((rl) =>
    rl.name.toLowerCase().includes(query),
  )
})

const formatDate = (date: string | Date | undefined) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<route lang="yaml">
meta:
  requiresRole: USER
  scrollable: true
</route>
