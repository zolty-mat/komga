<template>
  <v-container
    fluid
    class="pa-4"
  >
    <EmptyStateNetworkError v-if="bookError" />

    <template v-else-if="book">
      <v-row class="mb-6">
        <!-- Book Cover -->
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
              :src="`/api/v1/books/${bookId}/thumbnail`"
              aspect-ratio="2/3"
              class="bg-surface"
            />
          </v-card>
        </v-col>

        <!-- Book Info -->
        <v-col
          cols="12"
          sm="8"
          md="9"
        >
          <div class="d-flex justify-space-between align-start">
            <div class="flex-grow-1">
              <v-card-title class="text-h4 mb-2">
                {{ book.metadata.title }}
              </v-card-title>

              <v-card-subtitle class="text-body-2 mb-2">
                {{
                  $formatMessage({
                    description: 'Book detail: series link',
                    defaultMessage: 'Book {number}',
                    id: 'pQ3xKl',
                  })
                }}
                <v-btn
                  v-if="book.seriesTitle"
                  variant="text"
                  size="small"
                  :text="book.seriesTitle"
                  @click="goToSeries"
                />
              </v-card-subtitle>

              <!-- Read Status -->
              <div class="mb-4">
                <v-chip
                  v-if="book.readProgress?.completed"
                  prepend-icon="i-mdi:check-circle"
                  color="success"
                  variant="outlined"
                  size="small"
                >
                  {{
                    $formatMessage({
                      description: 'Book detail: read status',
                      defaultMessage: 'Read',
                      id: 'wN5yKm',
                    })
                  }}
                </v-chip>
                <v-chip
                  v-else-if="book.readProgress?.page"
                  size="small"
                  variant="outlined"
                >
                  {{
                    $formatMessage(
                      {
                        description: 'Book detail: progress',
                        defaultMessage: '{page} of {total} pages',
                        id: 'vL2jPq',
                      },
                      { page: book.readProgress.page, total: book.media.pagesCount },
                    )
                  }}
                </v-chip>
              </div>
            </div>

            <!-- Back button -->
            <v-btn
              icon="i-mdi:arrow-left"
              variant="text"
              @click="goBack"
            />
          </div>

          <!-- Summary -->
          <v-card-text
            v-if="book.metadata.summary"
            class="text-body-2 mb-4"
          >
            {{ book.metadata.summary }}
          </v-card-text>

          <!-- Action Buttons -->
          <div class="d-flex gap-2 flex-wrap mb-4">
            <v-btn
              icon="i-mdi:book-open"
              color="primary"
              @click="handleRead"
            />
            <v-btn
              v-if="!book.readProgress?.completed"
              icon="i-mdi:check-circle"
              @click="handleMarkRead"
              :loading="markReadLoading"
            />
            <v-btn
              v-if="book.readProgress?.completed"
              icon="i-mdi:close-circle"
              @click="handleMarkUnread"
              :loading="markUnreadLoading"
            />
          </div>

          <v-divider class="my-4" />

          <!-- Metadata Grid -->
          <div class="d-flex flex-wrap gap-4">
            <div v-if="book.metadata.number">
              <span class="text-overline">{{
                $formatMessage({
                  description: 'Book metadata: number label',
                  defaultMessage: 'Book Number',
                  id: 'tK9jPx',
                })
              }}</span>
              <div class="text-body-2">{{ book.metadata.number }}</div>
            </div>

            <div v-if="book.metadata.releaseDate">
              <span class="text-overline">{{
                $formatMessage({
                  description: 'Book metadata: release date label',
                  defaultMessage: 'Release Date',
                  id: 'qL3hOk',
                })
              }}</span>
              <div class="text-body-2">{{ formatDate(book.metadata.releaseDate) }}</div>
            </div>

            <div v-if="book.media.pagesCount">
              <span class="text-overline">{{
                $formatMessage({
                  description: 'Book metadata: pages label',
                  defaultMessage: 'Pages',
                  id: 'mN8jKx',
                })
              }}</span>
              <div class="text-body-2">{{ book.media.pagesCount }}</div>
            </div>

            <div v-if="book.size">
              <span class="text-overline">{{
                $formatMessage({
                  description: 'Book metadata: file size label',
                  defaultMessage: 'File Size',
                  id: 'nP2vLm',
                })
              }}</span>
              <div class="text-body-2">{{ book.size }}</div>
            </div>
          </div>

          <!-- Authors -->
          <div
            v-if="authorsList && authorsList.length"
            class="mt-4"
          >
            <span class="text-overline">{{
              $formatMessage({
                description: 'Book metadata: authors label',
                defaultMessage: 'Authors',
                id: 'kR4jOx',
              })
            }}</span>
            <div class="d-flex gap-1 flex-wrap mt-2">
              <v-chip
                v-for="author in authorsList"
                :key="authorKey(author)"
                size="small"
              >
                {{ authorDisplay(author) }}
              </v-chip>
            </div>
          </div>

          <!-- Tags -->
          <div
            v-if="book.metadata.tags && book.metadata.tags.length"
            class="mt-4"
          >
            <span class="text-overline">{{
              $formatMessage({
                description: 'Book metadata: tags label',
                defaultMessage: 'Tags',
                id: 'jQ5mNx',
              })
            }}</span>
            <div class="d-flex gap-1 flex-wrap mt-2">
              <v-chip
                v-for="tag in book.metadata.tags"
                :key="tag"
                size="small"
                variant="outlined"
              >
                {{ tag }}
              </v-chip>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Related Books in Series -->
      <template v-if="relatedBooks && relatedBooks.length > 1">
        <v-divider class="my-6" />

        <h3 class="text-h5 mb-4">
          {{
            $formatMessage({
              description: 'Book detail: related books section',
              defaultMessage: 'Other Books in Series',
              id: 'pM9kLx',
            })
          }}
        </h3>

        <v-table
          density="comfortable"
          class="book-navigation-table"
        >
          <thead>
            <tr>
              <th class="text-left">
                {{
                  $formatMessage({
                    description: 'Related books table: title',
                    defaultMessage: 'Title',
                    id: 'nJ7qKx',
                  })
                }}
              </th>
              <th
                class="text-center"
                style="width: 80px"
              >
                {{
                  $formatMessage({
                    description: 'Related books table: number',
                    defaultMessage: '#',
                    id: 'mK2pLx',
                  })
                }}
              </th>
              <th
                class="text-center"
                style="width: 100px"
              >
                {{
                  $formatMessage({
                    description: 'Related books table: progress',
                    defaultMessage: 'Progress',
                    id: 'kL3nMx',
                  })
                }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="relBook in relatedBooks"
              :key="relBook.id"
              :class="{ 'bg-primary-opacity': relBook.id === bookId }"
            >
              <td>
                <v-btn
                  variant="text"
                  :text="relBook.metadata.title"
                  @click="goToBook(relBook.id)"
                />
              </td>
              <td class="text-center">{{ relBook.metadata.number }}</td>
              <td class="text-center">
                <v-icon
                  v-if="relBook.readProgress?.completed"
                  icon="i-mdi:check-circle"
                  color="success"
                />
                <span v-else-if="relBook.readProgress?.page">
                  {{ relBook.readProgress.page }} / {{ relBook.media.pagesCount }}
                </span>
              </td>
            </tr>
          </tbody>
        </v-table>
      </template>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { useQuery } from '@pinia/colada'
import { bookDetailQuery, useMarkBookRead, useMarkBookUnread } from '@/colada/books'
import { seriesBooksListQuery } from '@/colada/series'
import { computed, ref } from 'vue'
import { useIntl } from 'vue-intl'
import { useRoute, useRouter } from 'vue-router'
import EmptyStateNetworkError from '@/components/EmptyStateNetworkError.vue'
import { PageRequest } from '@/types/PageRequest'

const route = useRoute() as any
const router = useRouter()
const intl = useIntl()

const bookId = computed(() => route.params.bookId)

const { data: book, error: bookError } = useQuery(() => bookDetailQuery({ bookId: bookId.value! }))

// Fetch related books in the series (when seriesId is available)
const { data: relatedBooksData } = useQuery(() => {
  if (!book.value?.seriesId) {
    return {
      key: ['books', 'empty'],
      query: async () => ({ content: [] }),
    }
  }

  return seriesBooksListQuery({
    seriesId: book.value.seriesId,
    search: {
      condition: {
        allOf: [{ seriesId: book.value.seriesId }],
      },
    } as any,
    pageRequest: PageRequest.FromPageSize(100, 0, []),
  })
})

const relatedBooks = computed(() => {
  const books = relatedBooksData.value?.content
  // Sort by number to maintain series order
  return books
    ? [...books].sort(
        (a, b) =>
          (a.metadata.numberSort || parseFloat(a.metadata.number || '0')) -
          (b.metadata.numberSort || parseFloat(b.metadata.number || '0')),
      )
    : []
})

const authorsList = computed(() => {
  const authors = book.value?.metadata.authors
  return Array.isArray(authors) ? authors : []
})

function authorKey(author: any): string {
  if (typeof author === 'string') return author
  if (typeof author === 'object' && author !== null) {
    return `${author.name || ''}-${author.role || ''}`
  }
  return JSON.stringify(author)
}

function authorDisplay(author: any): string {
  if (typeof author === 'string') return author
  if (typeof author === 'object' && author !== null) {
    const parts = []
    if (author.name) parts.push(author.name)
    if (author.role) parts.push(`(${author.role})`)
    return parts.join(' ')
  }
  return String(author)
}

const { mutate: markRead } = useMarkBookRead()
const { mutate: markUnread } = useMarkBookUnread()

const markReadLoading = ref(false)
const markUnreadLoading = ref(false)

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}

async function handleRead() {
  // This would open the reader - placeholder for now
  console.log('Open reader for book:', bookId.value)
}

async function handleMarkRead() {
  markReadLoading.value = true
  try {
    await markRead(bookId.value!)
  } finally {
    markReadLoading.value = false
  }
}

async function handleMarkUnread() {
  markUnreadLoading.value = true
  try {
    await markUnread(bookId.value!)
  } finally {
    markUnreadLoading.value = false
  }
}

function goBack() {
  router.back()
}

function goToSeries() {
  if (book.value?.seriesId) {
    router.push(`/libraries/${book.value.libraryId}/series/${book.value.seriesId}`)
  }
}

function goToBook(id: string) {
  router.push(`/media/books/${id}`)
}
</script>

<route lang="yaml">
meta:
  requiresRole: USER
  scrollable: true
</route>

<style scoped>
.book-navigation-table :deep(.bg-primary-opacity) {
  background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>
