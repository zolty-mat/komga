<template>
  <v-container max-width="550px">
    <v-row class="justify-center">
      <v-col>
        <v-img
          src="@/assets/logo.svg"
          width="500"
          height="500"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-progress-linear
          indeterminate
          color="primary"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useCurrentUser } from '@/colada/users'
import { useClaimStatus } from '@/colada/claim'
import { komgaClient } from '@/api/komga-client'

definePage({ alias: '/next' })

async function checkAuthenticated() {
  const router = useRouter()
  const route = useRoute()
  const { data, error, refresh } = useCurrentUser()
  const { data: claimData, error: claimError, refresh: claimRefresh } = useClaimStatus()

  // Exchange header token for cookie if present in query parameters
  const xAuthToken = route.query.xAuthToken as string | undefined
  if (xAuthToken) {
    try {
      await komgaClient.GET('/api/v1/login/set-cookie', {
        headers: {
          'X-Auth-Token': xAuthToken,
        },
      })
      // Remove token from URL for clean history
      await router.replace({ query: { redirect: route.query.redirect } })
    } catch {
      // If token exchange fails, continue to authentication flow
      // The user will be redirected to login/claim as appropriate
    }
  }

  await refresh()
  await claimRefresh()
  // if we can't get the claim status, most likely the server is unreachable
  if (claimError.value) {
    await router.push({ name: '/error' })
  } else if (data.value) {
    if (route.query.redirect) await router.push(route.query.redirect.toString())
    else await router.push('/')
  } else if (error.value) {
    if (claimData.value?.isClaimed)
      await router.push({ name: '/login', query: { redirect: route.query.redirect } })
    else await router.push({ name: '/claim', query: { redirect: route.query.redirect } })
  }
}

onMounted(() => checkAuthenticated())
</script>

<route lang="yaml">
meta:
  layout: single
  noAuth: true
</route>
