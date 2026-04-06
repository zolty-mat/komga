import { defineQueryOptions } from '@pinia/colada'
import { komgaClient } from '@/api/komga-client'
import type { components } from '@/generated/openapi/komga'
import type { PageRequest } from '@/types/PageRequest'

export interface SearchFilters {
  libraryId?: string[]
  seriesStatus?: components['schemas']['SeriesStatus'][]
  genres?: components['schemas']['Genre'][]
  languages?: components['schemas']['Language'][]
  publishers?: components['schemas']['Publisher'][]
  authors?: components['schemas']['Author'][]
  tags?: components['schemas']['Tag'][]
  readStatus?: components['schemas']['ReadStatus'][]
  ageRating?: string
  releaseDateMin?: string
  releaseDateMax?: string
  oneshot?: boolean
  complete?: boolean
}

export const QUERY_KEYS_SEARCH = {
  root: ['search'] as const,
  series: (query: string, filters: SearchFilters, pageRequest?: PageRequest) =>
    [...QUERY_KEYS_SEARCH.root, 'series', JSON.stringify({ query, filters, pageRequest })] as const,
  books: (query: string, filters: SearchFilters, pageRequest?: PageRequest) =>
    [...QUERY_KEYS_SEARCH.root, 'books', JSON.stringify({ query, filters, pageRequest })] as const,
  authors: (query: string, filters: SearchFilters, pageRequest?: PageRequest) =>
    [...QUERY_KEYS_SEARCH.root, 'authors', JSON.stringify({ query, filters, pageRequest })] as const,
}

export const seriesSearchQuery = defineQueryOptions(
  ({
    query,
    filters = {},
    pageRequest,
  }: {
    query: string
    filters?: SearchFilters
    pageRequest?: PageRequest
  }) => ({
    key: QUERY_KEYS_SEARCH.series(query, filters, pageRequest),
    query: () => {
      // Build SeriesSearch condition
      const conditions: Array<Record<string, unknown>> = []

      if (query && query.trim()) {
        // Fulltext search handled separately
      }

      if (filters.libraryId && filters.libraryId.length > 0) {
        conditions.push({
          libraryId: {
            value: filters.libraryId,
          },
        })
      }

      if (filters.seriesStatus && filters.seriesStatus.length > 0) {
        filters.seriesStatus.forEach((status) => {
          conditions.push({
            seriesStatus: {
              value: status,
              operator: 'IS',
            },
          })
        })
      }

      if (filters.genres && filters.genres.length > 0) {
        conditions.push({
          genre: {
            value: filters.genres,
          },
        })
      }

      if (filters.languages && filters.languages.length > 0) {
        conditions.push({
          language: {
            value: filters.languages,
          },
        })
      }

      if (filters.publishers && filters.publishers.length > 0) {
        conditions.push({
          publisher: {
            value: filters.publishers,
          },
        })
      }

      if (filters.authors && filters.authors.length > 0) {
        conditions.push({
          author: {
            value: filters.authors,
          },
        })
      }

      if (filters.tags && filters.tags.length > 0) {
        conditions.push({
          tag: {
            value: filters.tags,
          },
        })
      }

      if (filters.readStatus && filters.readStatus.length > 0) {
        conditions.push({
          readStatus: {
            value: filters.readStatus,
          },
        })
      }

      if (filters.oneshot !== undefined) {
        conditions.push({
          oneshot: filters.oneshot,
        })
      }

      if (filters.complete !== undefined) {
        conditions.push({
          complete: filters.complete,
        })
      }

      const seriesSearch: components['schemas']['SeriesSearch'] = {
        fullTextSearch: query && query.trim() ? query : undefined,
        condition:
          conditions.length === 1 ? conditions[0] : conditions.length > 1 ? { allOf: conditions } : undefined,
      }

      return komgaClient
        .POST('/api/v1/series/list', {
          body: seriesSearch,
          params: {
            query: {
              ...pageRequest,
            },
          },
        })
        .then((res) => res.data)
    },
    placeholderData: (previousData) => previousData,
  }),
)

export const booksSearchQuery = defineQueryOptions(
  ({
    query,
    filters = {},
    pageRequest,
  }: {
    query: string
    filters?: SearchFilters
    pageRequest?: PageRequest
  }) => ({
    key: QUERY_KEYS_SEARCH.books(query, filters, pageRequest),
    query: () => {
      const conditions: Array<Record<string, unknown>> = []

      if (filters.libraryId && filters.libraryId.length > 0) {
        conditions.push({
          libraryId: {
            value: filters.libraryId,
          },
        })
      }

      if (filters.genres && filters.genres.length > 0) {
        conditions.push({
          genre: {
            value: filters.genres,
          },
        })
      }

      if (filters.languages && filters.languages.length > 0) {
        conditions.push({
          language: {
            value: filters.languages,
          },
        })
      }

      if (filters.publishers && filters.publishers.length > 0) {
        conditions.push({
          publisher: {
            value: filters.publishers,
          },
        })
      }

      if (filters.authors && filters.authors.length > 0) {
        conditions.push({
          author: {
            value: filters.authors,
          },
        })
      }

      if (filters.tags && filters.tags.length > 0) {
        conditions.push({
          tag: {
            value: filters.tags,
          },
        })
      }

      if (filters.readStatus && filters.readStatus.length > 0) {
        conditions.push({
          readStatus: {
            value: filters.readStatus,
          },
        })
      }

      const bookSearch: components['schemas']['BookSearch'] = {
        fullTextSearch: query && query.trim() ? query : undefined,
        condition:
          conditions.length === 1 ? conditions[0] : conditions.length > 1 ? { allOf: conditions } : undefined,
      }

      return komgaClient
        .POST('/api/v1/books/list', {
          body: bookSearch,
          params: {
            query: {
              ...pageRequest,
            },
          },
        })
        .then((res) => res.data)
    },
    placeholderData: (previousData) => previousData,
  }),
)

export const authorsSearchQuery = defineQueryOptions(
  ({
    query,
    filters = {},
    pageRequest,
  }: {
    query: string
    filters?: SearchFilters
    pageRequest?: PageRequest
  }) => ({
    key: QUERY_KEYS_SEARCH.authors(query, filters, pageRequest),
    query: () => {
      const queryParams: Record<string, unknown> = {
        search: query && query.trim() ? query : undefined,
      }

      if (filters.libraryId && filters.libraryId.length > 0) {
        queryParams.library_id = filters.libraryId
      }

      return komgaClient
        .GET('/api/v2/authors', {
          params: {
            query: queryParams,
          },
        })
        .then((res) => res.data)
    },
    placeholderData: (previousData) => previousData,
  }),
)
