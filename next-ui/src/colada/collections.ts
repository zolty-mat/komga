import { defineMutation, defineQueryOptions, useMutation } from '@pinia/colada'
import { komgaClient } from '@/api/komga-client'
import type { PageRequest } from '@/types/PageRequest'

export const QUERY_KEYS_COLLECTIONS = {
  root: ['collections'] as const,
  bySearch: (request: object) => [...QUERY_KEYS_COLLECTIONS.root, 'list', JSON.stringify(request)] as const,
  byId: (collectionId: string) => [...QUERY_KEYS_COLLECTIONS.root, collectionId] as const,
  books: (collectionId: string) => [...QUERY_KEYS_COLLECTIONS.root, collectionId, 'books'] as const,
  booksBySearch: (collectionId: string, request: object) =>
    [...QUERY_KEYS_COLLECTIONS.books(collectionId), JSON.stringify(request)] as const,
}

export const collectionsListQuery = defineQueryOptions(
  ({
    search,
    libraryIds,
    pageRequest,
  }: {
    search?: string
    libraryIds?: string[]
    pageRequest?: PageRequest
  }) => ({
    key: QUERY_KEYS_COLLECTIONS.bySearch({ search: search, libraryIds, pageRequest: pageRequest }),
    query: () =>
      komgaClient
        .GET('/api/v1/collections', {
          params: {
            query: {
              search: search,
              library_id: libraryIds,
              ...pageRequest,
            },
          },
        })
        // unwrap the openapi-fetch structure on success
        .then((res) => res.data),
    placeholderData: (previousData) => previousData,
  }),
)

export const collectionDetailQuery = defineQueryOptions(
  ({ collectionId }: { collectionId: string }) => ({
    key: QUERY_KEYS_COLLECTIONS.byId(collectionId),
    query: () =>
      komgaClient
        .GET('/api/v1/collections/{id}', {
          params: {
            path: {
              id: collectionId,
            },
          },
        })
        // unwrap the openapi-fetch structure on success
        .then((res) => res.data),
  }),
)

export const collectionSeriesQuery = defineQueryOptions(
  ({
    collectionId,
    pageRequest,
  }: {
    collectionId: string
    pageRequest?: PageRequest
  }) => ({
    key: QUERY_KEYS_COLLECTIONS.booksBySearch(collectionId, { pageRequest }),
    query: () =>
      komgaClient
        .GET('/api/v1/collections/{id}/series', {
          params: {
            path: {
              id: collectionId,
            },
            query: {
              ...pageRequest,
            },
          },
        })
        // unwrap the openapi-fetch structure on success
        .then((res) => res.data),
    placeholderData: (previousData) => previousData,
  }),
)

export const useDeleteCollection = defineMutation(() =>
  useMutation({
    mutation: (collectionId: string) =>
      komgaClient.DELETE('/api/v1/collections/{id}', {
        params: {
          path: {
            id: collectionId,
          },
        },
      }),
  }),
)

export const useUpdateCollection = defineMutation(() =>
  useMutation({
    mutation: async ({
      collectionId,
      name,
      ordered,
    }: {
      collectionId: string
      name: string
      ordered?: boolean
    }) => {
      const response = await komgaClient.PATCH('/api/v1/collections/{id}', {
        params: {
          path: {
            id: collectionId,
          },
        },
        body: {
          name,
          ordered,
        },
      })
      return response.data
    },
  }),
)
