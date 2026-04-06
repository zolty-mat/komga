import { defineQuery, useQuery } from '@pinia/colada'
import { komgaClient } from '@/api/komga-client'

export const QUERY_KEYS_OAUTH2 = {
  providers: ['oauth2-providers'] as const,
}

export const useOAuth2Providers = defineQuery(() => {
  return useQuery({
    key: () => QUERY_KEYS_OAUTH2.providers,
    query: () =>
      komgaClient
        .GET('/api/v1/oauth2/providers')
        .then((res) => res.data),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: false,
  })
})
