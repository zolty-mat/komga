<template>
  <v-container class="notifications-page">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-6">Notification Settings</h1>
      </v-col>
    </v-row>

    <!-- Notification Channels -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-6">
          <v-card-title>Notification Channels</v-card-title>
          <v-card-text>
            <div class="notification-channel">
              <v-switch
                v-model="notificationsStore.preferences.inAppNotifications"
                label="In-App Notifications"
                description="Show notifications within the application"
                color="primary"
              />
            </div>
            <v-divider class="my-3" />
            <div class="notification-channel">
              <v-switch
                v-model="notificationsStore.preferences.emailNotifications"
                label="Email Notifications"
                description="Send important notifications via email"
                color="primary"
              />
            </div>
            <v-divider class="my-3" />
            <div class="notification-channel">
              <v-switch
                v-model="notificationsStore.preferences.pushNotifications"
                label="Push Notifications"
                description="Send browser push notifications"
                color="primary"
                @update:model-value="handlePushNotificationChange"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Notification Frequency -->
      <v-col cols="12" md="6">
        <v-card class="mb-6">
          <v-card-title>Notification Frequency</v-card-title>
          <v-card-text>
            <v-radio-group v-model="notificationsStore.preferences.frequency">
              <v-radio
                value="immediate"
                label="Immediate"
                description="Get notified right away"
              />
              <v-radio
                value="daily"
                label="Daily Digest"
                description="Receive one daily summary email"
              />
              <v-radio
                value="weekly"
                label="Weekly Digest"
                description="Receive one weekly summary email"
              />
            </v-radio-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Notification Categories -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-6">
          <v-card-title>Notification Categories</v-card-title>
          <v-card-text>
            <div
              v-for="category in availableCategories"
              :key="category"
              class="notification-category"
            >
              <v-checkbox
                :model-value="notificationsStore.preferences.enabledCategories.includes(category)"
                @update:model-value="() => notificationsStore.toggleCategory(category)"
                :label="getCategoryLabel(category)"
                :description="getCategoryDescription(category)"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Quiet Hours -->
      <v-col cols="12" md="6">
        <v-card class="mb-6">
          <v-card-title>Quiet Hours</v-card-title>
          <v-card-text>
            <v-switch
              v-model="notificationsStore.preferences.quietHours.enabled"
              label="Enable Quiet Hours"
              description="Mute notifications during specified time range"
              color="primary"
            />

            <v-expand-transition>
              <div v-if="notificationsStore.preferences.quietHours.enabled" class="quiet-hours-config mt-4">
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="notificationsStore.preferences.quietHours.start"
                      type="time"
                      label="Start Time"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="notificationsStore.preferences.quietHours.end"
                      type="time"
                      label="End Time"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Notification History -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Notification History</span>
            <div class="history-actions">
              <v-text-field
                v-model="historySearch"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search notifications..."
                hide-details
                variant="outlined"
                density="compact"
                style="max-width: 300px"
                clearable
              />
              <v-btn
                v-if="filteredHistory.length > 0"
                variant="text"
                size="small"
                color="error"
                @click="handleClearHistory"
              >
                Clear All
              </v-btn>
            </div>
          </v-card-title>

          <v-card-text>
            <v-list v-if="filteredHistory.length > 0" class="history-list">
              <v-list-item
                v-for="notification in filteredHistory"
                :key="notification.id"
                :class="{ 'history-unread': !notification.read }"
              >
                <template #prepend>
                  <v-icon :icon="getIcon(notification.type)" :color="getColor(notification.type)" />
                </template>

                <div class="history-item-content">
                  <div class="history-item-title">{{ notification.message }}</div>
                  <div v-if="notification.description" class="history-item-description">
                    {{ notification.description }}
                  </div>
                  <div class="history-item-meta">
                    <span class="history-item-category">{{ notification.category }}</span>
                    <span class="history-item-time">{{ formatTime(notification.timestamp) }}</span>
                  </div>
                </div>
              </v-list-item>
            </v-list>

            <v-empty-state
              v-else
              icon="mdi-bell-off"
              title="No notifications"
              text="Your notification history is empty"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row class="mt-6">
      <v-col cols="12" class="d-flex gap-2">
        <v-btn variant="tonal" @click="handleResetPreferences">
          Reset to Defaults
        </v-btn>
        <v-spacer />
        <v-btn color="primary" @click="handleSave">
          Save Changes
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'
import { useMessagesStore } from '@/stores/messages'
import { NotificationCategory, NotificationType } from '@/types/notifications'
import type { Notification } from '@/types/notifications'

const notificationsStore = useNotificationsStore()
const messagesStore = useMessagesStore()
const historySearch = ref('')

const availableCategories = Object.values(NotificationCategory)

const filteredHistory = computed(() => {
  const query = historySearch.value.toLowerCase()
  return notificationsStore.history.filter(
    (n: Notification) =>
      n.message.toLowerCase().includes(query) ||
      (n.description?.toLowerCase() ?? '').includes(query) ||
      n.category.toLowerCase().includes(query)
  )
})

const getCategoryLabel = (category: NotificationCategory): string => {
  switch (category) {
    case NotificationCategory.Library:
      return 'Library Updates'
    case NotificationCategory.Reading:
      return 'Reading Milestones'
    case NotificationCategory.System:
      return 'System Alerts'
    case NotificationCategory.Achievement:
      return 'Achievements & Badges'
    default:
      return category
  }
}

const getCategoryDescription = (category: NotificationCategory): string => {
  switch (category) {
    case NotificationCategory.Library:
      return 'New books added, collection updates'
    case NotificationCategory.Reading:
      return 'Reading streaks, completion milestones'
    case NotificationCategory.System:
      return 'Errors, maintenance, server updates'
    case NotificationCategory.Achievement:
      return 'Badges and achievements unlocked'
    default:
      return ''
  }
}

const getIcon = (type: NotificationType): string => {
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

const getColor = (type: NotificationType): string => {
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
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const handlePushNotificationChange = async (value: boolean) => {
  if (value && 'Notification' in window && Notification.permission === 'default') {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'denied') {
        notificationsStore.preferences.pushNotifications = false
        messagesStore.messages.push({
          text: 'Push notifications permission denied',
          color: 'warning',
        })
      }
    } catch (error) {
      notificationsStore.preferences.pushNotifications = false
      console.error('Error requesting notification permission:', error)
    }
  }
}

const handleClearHistory = () => {
  if (confirm('Are you sure you want to clear all notification history?')) {
    notificationsStore.clearHistory()
    messagesStore.messages.push({
      text: 'Notification history cleared',
      color: 'success',
    })
  }
}

const handleResetPreferences = () => {
  if (confirm('Reset all notification preferences to defaults?')) {
    notificationsStore.resetPreferences()
    messagesStore.messages.push({
      text: 'Preferences reset to defaults',
      color: 'success',
    })
  }
}

const handleSave = () => {
  messagesStore.messages.push({
    text: 'Notification preferences saved',
    color: 'success',
  })
}
</script>

<style scoped lang="scss">
.notifications-page {
  max-width: 1200px;
  padding: 2rem 1rem;

  .notification-channel {
    padding: 0.5rem 0;
  }

  .notification-category {
    padding: 0.25rem 0;
  }

  .quiet-hours-config {
    background-color: rgba(0, 0, 0, 0.02);
    padding: 1rem;
    border-radius: 4px;
  }

  .history-actions {
    display: flex;
    gap: 1rem;
    align-items: center;

    @media (max-width: 600px) {
      flex-direction: column;
      width: 100%;
      gap: 0.5rem;

      & > * {
        width: 100%;
      }
    }
  }

  .history-list {
    .history-unread {
      background-color: rgba(25, 118, 210, 0.04);
    }

    .history-item-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .history-item-title {
        font-weight: 500;
        font-size: 0.95rem;
      }

      .history-item-description {
        font-size: 0.85rem;
        color: rgba(0, 0, 0, 0.6);
      }

      .history-item-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.75rem;
        color: rgba(0, 0, 0, 0.4);

        .history-item-category {
          text-transform: uppercase;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
