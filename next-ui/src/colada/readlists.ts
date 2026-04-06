import { defineMutation, defineQueryOptions, useMutation } from '@pinia/colada'
import { komgaClient } from '@/api/komga-client'
import type { components } from '@/generated/openapi/komga'
import type { PageRequest } from '@/types/PageRequest'

export const QUERY_KEYS_READLIST = {
  root: ['readlists'] as const,
  bySearch: (request: object) => [...QUERY_KEYS_READLIST.root, 'list', JSON.stringify(request)] as const,
  byId: (readlistId: string) => [...QUERY_KEYS_READLIST.root, readlistId] as const,
  books: (readlistId: string) => [...QUERY_KEYS_READLIST.root, readlistId, 'books'] as const,
  booksBySearch: (readlistId: string, request: object) =>
    [...QUERY_KEYS_READLIST.books(readlistId), JSON.stringify(request)] as const,
}

export const readListsListQuery = defineQueryOptions(
  ({
    search,
    libraryIds,
    pageRequest,
  }: {
    search?: string
    libraryIds?: string[]
    pageRequest?: PageRequest
  }) => ({
    key: QUERY_KEYS_READLIST.bySearch({
      search: search,
      libraryIds: libraryIds,
      pageRequest: pageRequest,
    }),
    query: () =>
      komgaClient
        .GET('/api/v1/readlists', {
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

export const readlistDetailQuery = defineQueryOptions(
  ({ readlistId }: { readlistId: string }) => ({
    key: QUERY_KEYS_READLIST.byId(readlistId),
    query: () =>
      komgaClient
        .GET('/api/v1/readlists/{id}', {
          params: {
            path: {
              id: readlistId,
            },
          },
        })
        .then((res) => res.data),
  }),
)

export const readlistBooksQuery = defineQueryOptions(
  ({
    readlistId,
    pageRequest,
  }: {
    readlistId: string
    pageRequest?: PageRequest
  }) => ({
    key: QUERY_KEYS_READLIST.booksBySearch(readlistId, { pageRequest }),
    query: () =>
      komgaClient
        .GET('/api/v1/readlists/{id}/books', {
          params: {
            path: {
              id: readlistId,
            },
            query: {
              ...pageRequest,
            },
          },
        })
        .then((res) => res.data),
    placeholderData: (previousData) => previousData,
  }),
)

export const useCreateReadList = defineMutation(() => {
  return useMutation({
    mutation: (readList: components['schemas']['ReadListCreationDto']) =>
      komgaClient.POST('/api/v1/readlists', {
        body: readList,
      }),
  })
})

export const useUpdateReadList = defineMutation(() => {
  return useMutation({
    mutation: ({
      readlistId,
      patch,
    }: {
      readlistId: string
      patch: components['schemas']['ReadListUpdateDto']
    }) =>
      komgaClient.PATCH('/api/v1/readlists/{id}', {
        params: {
          path: {
            id: readlistId,
          },
        },
        body: patch,
      }),
  })
})

export const useDeleteReadList = defineMutation(() =>
  useMutation({
    mutation: (readlistId: string) =>
      komgaClient.DELETE('/api/v1/readlists/{id}', {
        params: {
          path: {
            id: readlistId,
          },
        },
      }),
  }),
)
