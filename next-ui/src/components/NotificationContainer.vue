<template>
  <transition-group name="notification-list" tag="div" class="notification-container">
    <NotificationToast
      v-for="notification in notificationsStore.queue"
      :key="notification.id"
      :notification="notification"
    />
  </transition-group>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'
import NotificationToast from './NotificationToast.vue'

const notificationsStore = useNotificationsStore()
</script>

<style scoped lang="scss">
.notification-container {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  max-width: 450px;
  width: auto;

  @media (max-width: 600px) {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}

.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.3s ease;
}

.notification-list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.notification-list-move {
  transition: transform 0.3s ease;
}
</style>
