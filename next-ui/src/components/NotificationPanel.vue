<template>
  <v-navigation-drawer
    v-model="notificationsStore.panelOpen"
    location="right"
    width="400"
    class="notification-panel"
  >
    <template #prepend>
      <div class="notification-panel-header">
        <h2>Notifications</h2>
        <div class="notification-header-actions">
          <v-badge
            :content="notificationsStore.unreadCount"
            color="error"
            overlap
          >
            <v-icon icon="mdi-bell" />
          </v-badge>
        </div>
      </div>
    </template>

    <v-list v-if="notificationsStore.history.length > 0" class="notification-list">
      <v-list-item
        v-for="notification in notificationsStore.history"
        :key="notification.id"
        :class="{
          'notification-item': true,
          'notification-unread': !notification.read,
        }"
        @click="handleItemClick(notification)"
      >
        <template #prepend>
          <v-badge
            :content="notification.read ? '' : 'NEW'"
            color="primary"
            :inline="!notification.read"
            class="notification-item-badge"
          >
            <v-icon :icon="getIcon(notification.type)" :color="getColor(notification.type)" />
          </v-badge>
        </template>

        <div class="notification-item-content">
          <div class="notification-item-title">{{ notification.message }}</div>
          <div v-if="notification.description" class="notification-item-description">
            {{ notification.description }}
          </div>
          <div class="notification-item-time">
            {{ formatTime(notification.timestamp) }}
          </div>
        </div>

        <template #append>
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                icon
                size="x-small"
                variant="text"
                v-bind="props"
                @click.stop
              >
                <v-icon icon="mdi-dots-vertical" size="small" />
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-if="!notification.read"
                @click="handleMarkAsRead(notification.id)"
              >
                <v-list-item-title>Mark as read</v-list-item-title>
              </v-list-item>
              <v-list-item @click="handleArchive(notification.id)">
                <v-list-item-title>Remove</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-list-item>
    </v-list>

    <v-empty-state
      v-else
      icon="mdi-bell-off"
      title="No notifications"
      text="Your notification history is empty"
      class="notification-empty-state"
    />

    <template #append>
      <div class="notification-panel-footer">
        <v-divider class="my-2" />
        <div class="notification-footer-actions">
          <v-btn
            v-if="notificationsStore.history.length > 0"
            variant="text"
            size="small"
            block
            @click="handleMarkAllAsRead"
          >
            Mark all as read
          </v-btn>
          <v-btn
            v-if="notificationsStore.history.length > 0"
            variant="text"
            size="small"
            color="error"
            block
            @click="handleClearHistory"
          >
            Clear history
          </v-btn>
          <v-btn
            variant="text"
            size="small"
            block
            @click="navigateToSettings"
          >
            Notification Settings
          </v-btn>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'
import { useRouter } from 'vue-router'
import type { Notification } from '@/types/notifications'
import { NotificationType } from '@/types/notifications'

const notificationsStore = useNotificationsStore()
const router = useRouter()

const getIcon = (type: NotificationType) => {
  switch (type) {
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
}

const getColor = (type: NotificationType) => {
  switch (type) {
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
}

const formatTime = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) {
    return 'Just now'
  }
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  return date.toLocaleDateString()
}

const handleItemClick = (notification: Notification) => {
  notificationsStore.markAsRead(notification.id)
}

const handleMarkAsRead = (id: string) => {
  notificationsStore.markAsRead(id)
}

const handleMarkAllAsRead = () => {
  notificationsStore.markAllAsRead()
}

const handleArchive = (id: string) => {
  notificationsStore.archiveNotification(id)
}

const handleClearHistory = () => {
  notificationsStore.clearHistory()
}

const navigateToSettings = () => {
  notificationsStore.closePanel()
  router.push('/account/notifications')
}
</script>

<style scoped lang="scss">
.notification-panel {
  .notification-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--v-border-color);

    h2 {
      margin: 0;
      font-size: 1.25rem;
    }

    .notification-header-actions {
      display: flex;
      gap: 0.5rem;
    }
  }

  .notification-list {
    .notification-item {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      transition: background-color 0.2s ease;

      &.notification-unread {
        background-color: rgba(25, 118, 210, 0.04);
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }

      .notification-item-badge {
        margin-right: 1rem;
      }

      .notification-item-content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .notification-item-title {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .notification-item-description {
          font-size: 0.85rem;
          color: rgba(0, 0, 0, 0.6);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .notification-item-time {
          font-size: 0.75rem;
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
  }

  .notification-empty-state {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .notification-panel-footer {
    padding: 1rem;
    border-top: 1px solid var(--v-border-color);

    .notification-footer-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
}
</style>
