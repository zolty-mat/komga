<template>
  <v-container
    fluid
    class="pa-4"
  >
    <EmptyStateNetworkError v-if="readlistError" />

    <template v-else-if="readlist">
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center gap-4 flex-wrap">
            <div class="flex-grow-1">
              <v-card-title class="text-h4 mb-2">
                {{ readlist.name }}
              </v-card-title>

              <v-card-subtitle
                v-if="readlist.summary"
                class="text-body-2 mb-4"
              >
                {{ readlist.summary }}
              </v-card-subtitle>

              <v-card-subtitle class="text-body-2 mb-4">
                {{ readlist.bookIds?.length || 0 }}
                {{
                  $formatMessage({
                    description: 'Readlist detail: book count',
                    defaultMessage: 'books',
                    id: 'rnCf8fq',
                  })
                }}
                <span v-if="readlist.ordered" class="ml-2">
                  •
                  {{
                    $formatMessage({
                      description: 'Readlist detail: ordered indicator',
                      defaultMessage: 'Ordered',
                      id: 'r/in7Iu',
                    })
                  }}
                </span>
              </v-card-subtitle>
            </div>

            <div class="d-flex gap-2">
              <v-btn
                icon="i-mdi:pencil"
                size="small"
                @click="showEditDialog = true"
              />
              <v-btn
                icon="i-mdi:delete"
                size="small"
                color="error"
                @click="showDeleteConfirm = true"
              />
            </div>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <div class="d-flex justify-space-between align-center mb-4 gap-2 flex-wrap">
        <h3 class="text-h5">
          {{
            $formatMessage({
              description: 'Readlist detail: books section title',
              defaultMessage: 'Books',
              id: 'rOYAgh0',
            })
          }}
        </h3>

        <v-btn
          icon="i-mdi:plus"
          size="small"
          @click="showAddBookDialog = true"
        />
      </div>

      <template v-if="booksLoading">
        <v-skeleton-loader
          type="table"
          class="mb-4"
        />
      </template>

      <template v-else-if="books.length === 0">
        <EmptyStateConstruction />
      </template>

      <template v-else>
        <v-table
          density="comfortable"
          class="mb-4"
        >
          <thead>
            <tr>
              <th class="text-left" style="width: 50px">
                {{
                  $formatMessage({
                    description: 'Readlist books table: number column',
                    defaultMessage: '#',
                    id: 'r5Ra7XT',
                  })
                }}
              </th>
              <th class="text-left">
                {{
                  $formatMessage({
                    description: 'Readlist books table: title column',
                    defaultMessage: 'Title',
                    id: 'rexfZxo',
                  })
                }}
              </th>
              <th class="text-center" style="width: 100px">
                {{
                  $formatMessage({
                    description: 'Readlist books table: series column',
                    defaultMessage: 'Series',
                    id: 'rxYdd49',
                  })
                }}
              </th>
              <th class="text-center" style="width: 100px">
                {{
                  $formatMessage({
                    description: 'Readlist books table: actions column',
                    defaultMessage: 'Actions',
                    id: 'rc+8cSO',
                  })
                }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(book, idx) in books"
              :key="book.id"
            >
              <td class="text-center">{{ idx + 1 }}</td>
              <td>
                <v-btn
                  variant="text"
                  :text="book.metadata?.title || book.name"
                  @click="goToBook(book.id)"
                />
              </td>
              <td class="text-center">
                {{ book.seriesTitle }}
              </td>
              <td class="text-center">
                <v-btn
                  icon="i-mdi:delete"
                  size="small"
                  color="error"
                  @click="removeBook(book.id)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </template>

      <!-- Edit dialog -->
      <ReadlistEditDialog
        v-model="showEditDialog"
        :readlist="readlist"
        @updated="refreshReadlist"
      />

      <!-- Delete confirmation -->
      <v-dialog
        v-model="showDeleteConfirm"
        max-width="400px"
      >
        <v-card>
          <v-card-title>
            {{
              $formatMessage({
                description: 'Delete readlist confirmation: title',
                defaultMessage: 'Delete Reading List?',
                id: 'rjzG2le',
              })
            }}
          </v-card-title>

          <v-card-text>
            {{
              $formatMessage({
                description: 'Delete readlist confirmation: message',
                defaultMessage:
                  'This action cannot be undone. Are you sure you want to delete this reading list?',
                id: 'rWBjxyS',
              })
            }}
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              variant="text"
              @click="showDeleteConfirm = false"
            >
              {{
                $formatMessage({
                  description: 'Delete readlist confirmation: cancel',
                  defaultMessage: 'Cancel',
                  id: 'rUYzDK3',
                })
              }}
            </v-btn>
            <v-btn
              color="error"
              :loading="isDeleting"
              @click="handleDelete"
            >
              {{
                $formatMessage({
                  description: 'Delete readlist confirmation: delete',
                  defaultMessage: 'Delete',
                  id: 'rOkU9Fv',
                })
              }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@pinia/colada'
import { readlistDetailQuery, readlistBooksQuery, useDeleteReadList } from '@/colada/readlists'
import ReadlistEditDialog from '@/components/ReadlistEditDialog.vue'

const route = useRoute()
const router = useRouter()

const readlistId = computed(() => {
  const id = route.params.readlistId
  return typeof id === 'string' ? id : id[0]
})

const libraryId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : id[0]
})

const showEditDialog = ref(false)
const showDeleteConfirm = ref(false)
const showAddBookDialog = ref(false)
const isDeleting = ref(false)

const { data: readlist, error: readlistError, refresh: refreshReadlist } = useQuery(
  readlistDetailQuery({ readlistId: readlistId.value }),
)

const { data: booksData, isPending: booksLoading } = useQuery(
  readlistBooksQuery({
    readlistId: readlistId.value,
    pageRequest: { page: 0, size: 100, unpaged: false },
  }),
)

const books = computed(() => booksData.value?.content || [])

const { mutate: deleteReadlist } = useDeleteReadList()

const goToBook = (bookId: string) => {
  // Assuming there's a book detail route
  void router.push(`/libraries/${libraryId.value}/books/${bookId}`)
}

const removeBook = (bookId: string) => {
  // TODO: Implement book removal from readlist
  console.log('Remove book:', bookId)
}

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await deleteReadlist(readlistId.value)
    // Navigate back to readlists list
    void router.push(`/libraries/${libraryId.value}/readlists`)
  } catch (error) {
    console.error('Failed to delete readlist:', error)
  } finally {
    isDeleting.value = false
  }
}
</script>

<route lang="yaml">
meta:
  requiresRole: USER
  scrollable: true
</route>
