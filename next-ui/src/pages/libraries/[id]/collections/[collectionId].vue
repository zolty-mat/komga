<template>
  <v-container
    fluid
    class="pa-4"
  >
    <EmptyStateNetworkError v-if="collectionError" />

    <template v-else-if="collection">
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center gap-4 flex-wrap">
            <div class="flex-grow-1">
              <v-card-title class="text-h4 mb-2">
                {{ collection.name }}
              </v-card-title>

              <v-card-subtitle class="text-body-2 mb-4">
                {{ collection.seriesIds?.length || 0 }}
                {{
                  $formatMessage({
                    description: 'Collection detail: series count',
                    defaultMessage: 'series',
                    id: 'PM2mwY',
                  })
                }}
                <span v-if="collection.ordered" class="ml-2">
                  •
                  {{
                    $formatMessage({
                      description: 'Collection detail: ordered indicator',
                      defaultMessage: 'Ordered',
                      id: 'SIFCvO',
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
              description: 'Collection detail: series section title',
              defaultMessage: 'Series',
              id: 'u3lQ9d',
            })
          }}
        </h3>

        <div class="d-flex gap-2">
          <v-text-field
            v-model="searchQuery"
            :placeholder="
              $formatMessage({
                description: 'Collection detail: search series placeholder',
                defaultMessage: 'Search series',
                id: 'ISpWj5',
              })
            "
            size="small"
            hide-details
          />
          <v-btn
            icon="i-mdi:plus"
            size="small"
            @click="showAddSeriesDialog = true"
          />
        </div>
      </div>

      <template v-if="seriesLoading">
        <v-skeleton-loader
          type="table"
          class="mb-4"
        />
      </template>

      <template v-else-if="filteredSeries.length === 0">
        <EmptyStateConstruction />
      </template>

      <template v-else>
        <v-table
          density="comfortable"
          class="mb-4"
        >
          <thead>
            <tr>
              <th class="text-left">
                {{
                  $formatMessage({
                    description: 'Collection series table: title column',
                    defaultMessage: 'Title',
                    id: 'GKI5ut',
                  })
                }}
              </th>
              <th class="text-center" style="width: 100px">
                {{
                  $formatMessage({
                    description: 'Collection series table: count column',
                    defaultMessage: 'Books',
                    id: 'ma338J',
                  })
                }}
              </th>
              <th class="text-center" style="width: 100px">
                {{
                  $formatMessage({
                    description: 'Collection series table: actions column',
                    defaultMessage: 'Actions',
                    id: '0F+7pz',
                  })
                }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="series in filteredSeries"
              :key="series.id"
            >
              <td>
                <v-btn
                  variant="text"
                  :text="series.metadata?.title || series.name"
                  @click="goToSeries(series.id)"
                />
              </td>
              <td class="text-center">
                {{ series.booksCount || 0 }}
              </td>
              <td class="text-center">
                <v-btn
                  icon="i-mdi:close"
                  size="x-small"
                  variant="text"
                  @click="removeSeries(series.id)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </template>

      <!-- Edit Collection Dialog -->
      <v-dialog
        v-model="showEditDialog"
        max-width="500"
      >
        <v-card>
          <v-card-title>
            {{
              $formatMessage({
                description: 'Collection detail: edit dialog title',
                defaultMessage: 'Edit Collection',
                id: 'SoRoQv',
              })
            }}
          </v-card-title>

          <v-card-text class="pt-4">
            <v-text-field
              v-model="editForm.name"
              :label="
                $formatMessage({
                  description: 'Collection detail: name field',
                  defaultMessage: 'Name',
                  id: 'qcBT33',
                })
              "
              class="mb-4"
            />

            <v-checkbox
              v-model="editForm.ordered"
              :label="
                $formatMessage({
                  description: 'Collection detail: ordered checkbox',
                  defaultMessage: 'Ordered collection',
                  id: 'BKuWof',
                })
              "
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              variant="text"
              @click="showEditDialog = false"
            >
              {{
                $formatMessage({
                  description: 'Common: cancel button',
                  defaultMessage: 'Cancel',
                  id: 'tai/U7',
                })
              }}
            </v-btn>
            <v-btn
              variant="tonal"
              :loading="updateLoading"
              @click="handleUpdate"
            >
              {{
                $formatMessage({
                  description: 'Common: save button',
                  defaultMessage: 'Save',
                  id: '8b3afO',
                })
              }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Confirmation Dialog -->
      <v-dialog
        v-model="showDeleteConfirm"
        max-width="400"
      >
        <v-card>
          <v-card-title>
            {{
              $formatMessage({
                description: 'Collection detail: delete dialog title',
                defaultMessage: 'Delete Collection',
                id: 'P3iRgN',
              })
            }}
          </v-card-title>

          <v-card-text>
            {{
              $formatMessage({
                description: 'Collection detail: delete confirmation text',
                defaultMessage: 'Are you sure you want to delete this collection?',
                id: 'aGKB2m',
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
                  description: 'Common: cancel button',
                  defaultMessage: 'Cancel',
                  id: 'tai/U7',
                })
              }}
            </v-btn>
            <v-btn
              variant="tonal"
              color="error"
              :loading="deleteLoading"
              @click="handleDelete"
            >
              {{
                $formatMessage({
                  description: 'Common: delete button',
                  defaultMessage: 'Delete',
                  id: 'LnEVw1',
                })
              }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Add Series Dialog -->
      <v-dialog
        v-model="showAddSeriesDialog"
        max-width="600"
      >
        <v-card>
          <v-card-title>
            {{
              $formatMessage({
                description: 'Collection detail: add series dialog title',
                defaultMessage: 'Add Series to Collection',
                id: 'No+X8s',
              })
            }}
          </v-card-title>

          <v-card-text class="pt-4">
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{
                $formatMessage({
                  description: 'Collection detail: add series not yet implemented',
                  defaultMessage: 'This feature will be implemented in the next phase.',
                  id: '3pLCx4',
                })
              }}
            </p>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              variant="text"
              @click="showAddSeriesDialog = false"
            >
              {{
                $formatMessage({
                  description: 'Common: close button',
                  defaultMessage: 'Close',
                  id: 'Ucnc7P',
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
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuery } from '@pinia/colada'
import { collectionDetailQuery, collectionSeriesQuery, useDeleteCollection, useUpdateCollection } from '@/colada/collections'

const router = useRouter()
const route = useRoute()
const collectionId = computed(() => {
  const id = route.params.collectionId
  return typeof id === 'string' ? id : id[0]
})
const libraryId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : id[0]
})

// Queries
const { data: collection, error: collectionError, refresh: refreshCollection } = useQuery(
  collectionDetailQuery({
    collectionId: collectionId.value,
  }),
)

const { data: seriesData, isPending: seriesLoading } = useQuery(
  collectionSeriesQuery({
    collectionId: collectionId.value,
    pageRequest: undefined,
  }),
)

// Mutations
const deleteCollectionMutation = useDeleteCollection()
const updateCollectionMutation = useUpdateCollection()
const deleteLoading = computed(() => deleteCollectionMutation.isPending)
const updateLoading = computed(() => updateCollectionMutation.isPending)

// UI State
const showEditDialog = ref(false)
const showDeleteConfirm = ref(false)
const showAddSeriesDialog = ref(false)
const searchQuery = ref('')

// Edit form
const editForm = ref({
  name: '',
  ordered: false,
})

const series = computed(() => seriesData.value?.content || [])

const filteredSeries = computed(() => {
  if (!searchQuery.value) return series.value
  const query = searchQuery.value.toLowerCase()
  return series.value.filter((s: any) =>
    (s.metadata?.title || s.name).toLowerCase().includes(query),
  )
})

// Watch for collection changes to populate edit form
watch(
  () => collection.value,
  (newCollection) => {
    if (newCollection) {
      editForm.value = {
        name: newCollection.name,
        ordered: newCollection.ordered || false,
      }
    }
  },
  { immediate: true },
)

const handleUpdate = async () => {
  try {
    await updateCollectionMutation.mutate({
      collectionId: collectionId.value,
      name: editForm.value.name,
      ordered: editForm.value.ordered,
    })
    showEditDialog.value = false
    await refreshCollection()
  } catch (error) {
    console.error('Failed to update collection:', error)
  }
}

const handleDelete = async () => {
  try {
    await deleteCollectionMutation.mutate(collectionId.value)
    showDeleteConfirm.value = false
    router.push(`/libraries/${libraryId.value}`)
  } catch (error) {
    console.error('Failed to delete collection:', error)
  }
}

const goToSeries = (seriesId: string) => {
  router.push(`/libraries/${libraryId.value}/series/${seriesId}`)
}

const removeSeries = async (seriesId: string) => {
  // TODO: Implement remove series mutation in next phase
  console.log('Remove series:', seriesId)
}
</script>

<route lang="yaml">
meta:
  requiresRole: USER
  scrollable: true
</route>
