<template>
  <v-app>
    <RouterView />

    <SnackQueue />
    <NotificationContainer />
    <NotificationPanel />
    <DialogConfirmEditInstance />
    <DialogConfirmInstance />
    <DialogSimpleInstance />
  </v-app>

  <PiniaColadaDevtools />
</template>

<script lang="ts" setup>
import { PiniaColadaDevtools } from '@pinia/colada-devtools'
import { useThemeWatcher } from '@/composables/themeWatcher'
import NotificationContainer from '@/components/NotificationContainer.vue'
import NotificationPanel from '@/components/NotificationPanel.vue'

useThemeWatcher()
</script>

<style>
@import 'styles/global.scss';
</style>
