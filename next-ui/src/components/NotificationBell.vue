<template>
  <v-badge
    :content="notificationsStore.unreadCount"
    color="error"
    :value="notificationsStore.unreadCount > 0"
    overlap
  >
    <v-btn
      icon
      variant="text"
      @click="notificationsStore.togglePanel()"
      class="notification-bell"
    >
      <v-icon icon="mdi-bell" />
    </v-btn>
  </v-badge>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'

const notificationsStore = useNotificationsStore()
</script>

<style scoped lang="scss">
.notification-bell {
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
