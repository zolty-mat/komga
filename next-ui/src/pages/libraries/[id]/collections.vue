<template>
  <v-container
    fluid
    class="pa-4"
  >
    <div class="d-flex justify-space-between align-center mb-6 gap-4 flex-wrap">
      <h1 class="text-h4">
        {{
          $formatMessage({
            description: 'Collections page: title',
            defaultMessage: 'Collections',
            id: 'o2mVW4',
          })
        }}
      </h1>

      <v-text-field
        v-model="searchQuery"
        :placeholder="
          $formatMessage({
            description: 'Collections page: search placeholder',
            defaultMessage: 'Search collections',
            id: 'ZWsslI',
          })
        "
        size="small"
        hide-details
        class="flex-grow-1"
        style="max-width: 300px"
      />
    </div>

    <template v-if="collectionsLoading">
      <v-skeleton-loader
        type="card-heading, image, table-heading, table-row, table-row, table-row"
        class="mb-4"
      />
    </template>

    <template v-else-if="filteredCollections.length === 0">
      <EmptyStateConstruction />
    </template>

    <template v-else>
      <v-row class="mb-6">
        <v-col
          v-for="coll in filteredCollections"
          :key="coll.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="h-100 d-flex flex-column cursor-pointer"
            :to="`/libraries/${libraryId}/collections/${coll.id}`"
          >
            <v-card-title class="text-h6">
              {{ coll.name }}
            </v-card-title>

            <v-card-subtitle class="text-body-2">
              {{ coll.seriesIds?.length || 0 }}
              {{
                $formatMessage({
                  description: 'Collection card: series count',
                  defaultMessage: 'series',
                  id: 'nstp+w',
                })
              }}
            </v-card-subtitle>

            <v-card-text class="flex-grow-1">
              <div class="text-caption text-medium-emphasis">
                {{
                  $formatMessage({
                    description: 'Collection card: last modified',
                    defaultMessage: 'Last modified',
                    id: 'UmcXND',
                  })
                }}
                {{ formatDate(coll.lastModifiedDate) }}
              </div>
            </v-card-text>

            <v-card-actions class="pt-0">
              <v-spacer />
              <v-chip
                v-if="coll.ordered"
                size="small"
                variant="outlined"
              >
                {{
                  $formatMessage({
                    description: 'Collection card: ordered badge',
                    defaultMessage: 'Ordered',
                    id: 'Wz020G',
                  })
                }}
              </v-chip>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@pinia/colada'
import { collectionsListQuery } from '@/colada/collections'

const route = useRoute()
const libraryId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : id[0]
})

const searchQuery = ref('')

const { data: collectionsData, isPending: collectionsLoading } = useQuery(
  collectionsListQuery({
    search: undefined,
    libraryIds: computed(() => [libraryId.value]).value,
    pageRequest: { page: 0, size: 100, unpaged: false },
  }),
)

const collections = computed(() => collectionsData.value?.content || [])

const filteredCollections = computed(() => {
  if (!searchQuery.value) return collections.value
  const query = searchQuery.value.toLowerCase()
  return collections.value.filter((coll) =>
    coll.name.toLowerCase().includes(query),
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
