<template>
  <v-container
    fluid
    class="pa-4"
  >
    <EmptyStateNetworkError v-if="seriesError" />

    <template v-else-if="series">
      <v-row class="mb-6">
        <v-col
          cols="12"
          sm="4"
          md="3"
          class="d-flex justify-center"
        >
          <v-card
            class="flex-grow-1"
            flat
          >
            <v-img
              :src="`/api/v1/series/${seriesId}/thumbnail`"
              aspect-ratio="2/3"
              class="bg-surface"
            />
          </v-card>
        </v-col>

        <v-col
          cols="12"
          sm="8"
          md="9"
        >
          <v-card-title class="text-h4 mb-2">
            {{ series.metadata.title }}
          </v-card-title>

          <v-card-subtitle class="text-body-2 mb-4">
            {{ series.booksCount }}
            {{
              $formatMessage({
                description: 'Series detail: books count',
                defaultMessage: 'books',
                id: 'Y4lkPj',
              })
            }}
            •
            {{ series.booksReadCount }}
            {{
              $formatMessage({
                description: 'Series detail: books read',
                defaultMessage: 'read',
                id: 'mxWoAw',
              })
            }}
          </v-card-subtitle>

          <v-card-text
            v-if="series.metadata.summary"
            class="text-body-2 mb-4"
          >
            {{ series.metadata.summary }}
          </v-card-text>

          <div class="d-flex gap-2 flex-wrap">
            <v-btn
              icon="i-mdi:refresh"
              :loading="refreshMetadataLoading"
              @click="handleRefreshMetadata"
            />
            <v-btn
              icon="i-mdi:magnify"
              :loading="analyzeLoading"
              @click="handleAnalyze"
            />
            <v-btn
              v-if="!series.booksReadCount || series.booksReadCount < series.booksCount"
              icon="i-mdi:check-all"
              @click="handleMarkRead"
            />
            <v-btn
              v-if="series.booksReadCount"
              icon="i-mdi:close-circle"
              @click="handleMarkUnread"
            />
          </div>

          <v-divider class="my-4" />

          <div class="d-flex flex-wrap gap-4">
            <div v-if="series.metadata.status">
              <span class="text-overline">{{
                $formatMessage({
                  description: 'Series metadata: status label',
                  defaultMessage: 'Status',
                  id: 'z7pQk2',
                })
              }}</span>
              <div class="text-body-2">{{ series.metadata.status }}</div>
            </div>

            <div v-if="series.metadata.publisher">
              <span class="text-overline">{{
                $formatMessage({
                  description: 'Series metadata: publisher label',
                  defaultMessage: 'Publisher',
                  id: 'xJ9sKm',
                })
              }}</span>
              <div class="text-body-2">{{ series.metadata.publisher }}</div>
            </div>

            <div v-if="series.metadata.language">
              <span class="text-overline">{{
                $formatMessage({
                  description: 'Series metadata: language label',
                  defaultMessage: 'Language',
                  id: 'Q2nRtV',
                })
              }}</span>
              <div class="text-body-2">{{ series.metadata.language }}</div>
            </div>

            <div v-if="series.metadata.genres && series.metadata.genres.length">
              <span class="text-overline">{{
                $formatMessage({
                  description: 'Series metadata: genres label',
                  defaultMessage: 'Genres',
                  id: 'pL3jOk',
                })
              }}</span>
              <div class="d-flex gap-1 flex-wrap">
                <v-chip
                  v-for="genre in series.metadata.genres"
                  :key="genre"
                  size="small"
                  variant="outlined"
                >
                  {{ genre }}
                </v-chip>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <h3 class="text-h5 mb-4">
        {{
          $formatMessage({
            description: 'Series detail: books section title',
            defaultMessage: 'Books',
            id: 'cM8qJx',
          })
        }}
      </h3>

      <v-table
        :loading="booksLoading"
        density="comfortable"
      >
        <thead>
          <tr>
            <th class="text-left">{{
              $formatMessage({
                description: 'Series books table: title column',
                defaultMessage: 'Title',
                id: 'jnKq4w',
              })
            }}</th>
            <th class="text-center" style="width: 80px">
              {{
                $formatMessage({
                  description: 'Series books table: number column',
                  defaultMessage: '#',
                  id: 'pMq2kL',
                })
              }}
            </th>
            <th class="text-center" style="width: 100px">
              {{
                $formatMessage({
                  description: 'Series books table: progress column',
                  defaultMessage: 'Progress',
                  id: 'nJ9xKm',
                })
              }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="book in books"
            :key="book.id"
          >
            <td>
              <v-btn
                variant="text"
                :text="book.metadata.title"
                @click="router.push('/media/books/' + book.id)"
              />
            </td>
            <td class="text-center">{{ book.metadata.number }}</td>
            <td class="text-center">
              <v-icon
                v-if="book.readProgress?.completed"
                icon="i-mdi:check-circle"
                color="success"
              />
              <span v-else-if="book.readProgress?.page">
                {{ book.readProgress.page }} / {{ book.media.pagesCount }}
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-pagination
        v-if="totalBooks > itemsPerPage"
        v-model="page1"
        :length="Math.ceil(totalBooks / itemsPerPage)"
        class="mt-4"
      />
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { useQuery } from '@pinia/colada'
import { seriesDetailQuery, seriesBooksListQuery, useRefreshMetadataSeries, useAnalyzeSeries, useMarkSeriesRead, useMarkSeriesUnread } from '@/colada/series'
import { computed, ref } from 'vue'
import { useIntl } from 'vue-intl'
import { useRoute, useRouter } from 'vue-router'
import EmptyStateNetworkError from '@/components/EmptyStateNetworkError.vue'
import { PageRequest } from '@/types/PageRequest'

const route = useRoute() as any
const router = useRouter()
const intl = useIntl()

const seriesId = computed(() => route.params.seriesId)
const libraryId = computed(() => route.params.id)

const page1 = ref(1)
const itemsPerPage = ref(20)

const { data: series, error: seriesError } = useQuery(() =>
  seriesDetailQuery({ seriesId: seriesId.value! })
)

const { data: booksData, isPending: booksLoading } = useQuery(() =>
  seriesBooksListQuery({
    seriesId: seriesId.value!,
    search: {
      condition: {
        allOf: [{ seriesId: seriesId.value! }],
      },
    } as any,
    pageRequest: PageRequest.FromPageSize(itemsPerPage.value, page1.value - 1, []),
  })
)

const books = computed(() => booksData.value?.content)
const totalBooks = computed(() => booksData.value?.totalElements ?? 0)

const { mutate: refreshMetadata } = useRefreshMetadataSeries()
const { mutate: analyze } = useAnalyzeSeries()
const { mutate: markRead } = useMarkSeriesRead()
const { mutate: markUnread } = useMarkSeriesUnread()

const refreshMetadataLoading = ref(false)
const analyzeLoading = ref(false)

async function handleRefreshMetadata() {
  refreshMetadataLoading.value = true
  try {
    await refreshMetadata(seriesId.value!)
  } finally {
    refreshMetadataLoading.value = false
  }
}

async function handleAnalyze() {
  analyzeLoading.value = true
  try {
    await analyze(seriesId.value!)
  } finally {
    analyzeLoading.value = false
  }
}

async function handleMarkRead() {
  await markRead(seriesId.value!)
}

async function handleMarkUnread() {
  await markUnread(seriesId.value!)
}

</script>

<route lang="yaml">
meta:
  requiresRole: USER
  scrollable: true
</route>
