import { defineMutation, defineQuery, useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { komgaClient } from '@/api/komga-client'
import type { components } from '@/generated/openapi/komga'
import { QUERY_KEYS_USERS } from '@/colada/users'

export const QUERY_KEYS_SETTINGS = {
  root: ['settings'] as const,
  readingStats: ['reading-stats'] as const,
}

export const useSettings = defineQuery(() => {
  return useQuery({
    key: () => QUERY_KEYS_SETTINGS.root,
    query: () =>
      komgaClient
        .GET('/api/v1/settings')
        // unwrap the openapi-fetch structure on success
        .then((res) => res.data),
    // 1 hour
    staleTime: 60 * 60 * 1000,
    gcTime: false,
  })
})

export const useUpdateSettings = defineMutation(() => {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (settings: components['schemas']['SettingsUpdateDto']) =>
      komgaClient.PATCH('/api/v1/settings', {
        body: settings,
      }),
    onSuccess: () => {
      void queryCache.invalidateQueries({ key: QUERY_KEYS_SETTINGS.root })
    },
  })
})

export const useReadingStatistics = defineQuery(() => {
  return useQuery({
    key: () => QUERY_KEYS_SETTINGS.readingStats,
    query: async () => {
      // Mock data for reading statistics
      return {
        totalBooksRead: 42,
        currentMonthCount: 3,
        readingStreak: 7,
        averageBooksPerMonth: 5.25,
        totalPagesRead: 12543,
        lastReadDate: new Date('2025-07-24T14:30:00Z'),
        longestReadingStreak: 45,
      }
    },
    // 30 minutes
    staleTime: 30 * 60 * 1000,
    gcTime: false,
  })
})

export const useUpdateUserPreferences = defineMutation(() => {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (preferences: any) =>
      komgaClient.PATCH('/api/v2/users/{id}', {
        params: { path: { id: 'me' } },
        body: preferences,
      }),
    onSuccess: () => {
      void queryCache.invalidateQueries({ key: QUERY_KEYS_USERS.currentUser })
    },
  })
})

export const useLogoutAllDevices = defineMutation(() => {
  return useMutation({
    mutation: () => komgaClient.POST('/api/logout', {}),
  })
})

export const useDeleteAccount = defineMutation(() => {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: () => komgaClient.DELETE('/api/v2/users/{id}', {
      params: { path: { id: 'me' } },
    }),
    onSuccess: () => {
      void queryCache.invalidateQueries({ key: QUERY_KEYS_USERS.currentUser })
    },
  })
})
