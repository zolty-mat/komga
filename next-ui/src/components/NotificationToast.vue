<template>
  <v-snackbar
    v-model="isOpen"
    :color="toastColor"
    :timeout="notification.duration ?? 3000"
    @update:model-value="handleClose"
    class="notification-toast"
    elevation="8"
  >
    <div class="notification-content">
      <div class="notification-message">
        <v-icon :icon="iconName" class="notification-icon" />
        <div class="notification-text">
          <div class="notification-title">{{ notification.message }}</div>
          <div v-if="notification.description" class="notification-description">
            {{ notification.description }}
          </div>
        </div>
      </div>
      <div v-if="notification.action" class="notification-action">
        <v-btn
          variant="text"
          size="small"
          color="white"
          @click="handleAction"
        >
          {{ notification.action.label }}
        </v-btn>
      </div>
    </div>

    <template #close="{ close }">
      <v-btn
        icon
        size="small"
        variant="text"
        color="white"
        @click="close"
        class="ml-2"
      >
        <v-icon icon="mdi-close" />
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Notification } from '@/types/notifications'
import { NotificationType } from '@/types/notifications'
import { useNotificationsStore } from '@/stores/notifications'

interface Props {
  notification: Notification
}

const props = defineProps<Props>()

const notificationsStore = useNotificationsStore()
const isOpen = ref(true)

const toastColor = computed(() => {
  switch (props.notification.type) {
    case NotificationType.Success:
      return 'success'
    case NotificationType.Error:
      return 'error'
    case NotificationType.Warning:
      return 'warning'
    case NotificationType.Info:
      return 'info'
    case NotificationType.Achievement:
      return 'primary'
    default:
      return 'info'
  }
})

const iconName = computed(() => {
  switch (props.notification.type) {
    case NotificationType.Success:
      return 'mdi-check-circle'
    case NotificationType.Error:
      return 'mdi-alert-circle'
    case NotificationType.Warning:
      return 'mdi-alert'
    case NotificationType.Info:
      return 'mdi-information'
    case NotificationType.Achievement:
      return 'mdi-trophy'
    default:
      return 'mdi-information'
  }
})

const handleClose = () => {
  notificationsStore.dismissNotification(props.notification.id)
}

const handleAction = async () => {
  if (props.notification.action?.handler) {
    try {
      await props.notification.action.handler()
    } catch (error) {
      console.error('Notification action failed:', error)
    }
  }
  handleClose()
}
</script>

<style scoped lang="scss">
.notification-toast {
  .notification-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    width: 100%;

    .notification-message {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      flex: 1;

      .notification-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
        margin-top: 0.25rem;
      }

      .notification-text {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .notification-title {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .notification-description {
          font-size: 0.85rem;
          opacity: 0.9;
        }
      }
    }

    .notification-action {
      flex-shrink: 0;
    }
  }
}
</style>
