/**
 * src/stores/notifications.ts
 *
 * Pinia notification store for managing notification state
 */

import { defineStore } from 'pinia'
import { useNotifications } from '@/services/notifications'
import type {
  Notification,
  NotificationPreferences,
  NotificationCategory,
} from '@/types/notifications'
import { NotificationCategory } from '@/types/notifications'

const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailNotifications: false,
  inAppNotifications: true,
  pushNotifications: false,
  enabledCategories: Object.values(NotificationCategory),
  frequency: 'immediate',
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
}

let notificationManager: ReturnType<typeof useNotifications> | null = null

function getNotificationManager() {
  if (!notificationManager) {
    notificationManager = useNotifications()
  }
  return notificationManager
}

export const useNotificationsStore = defineStore(
  'notifications',
  {
    state: () => ({
      preferences: { ...DEFAULT_PREFERENCES } as NotificationPreferences,
      panelOpen: false,
    }),

    getters: {
      /**
       * Get active notification queue
       */
      queue(): Notification[] {
        return getNotificationManager().getQueue()
      },

      /**
       * Get notification history
       */
      history(): Notification[] {
        return getNotificationManager().getHistory()
      },

      /**
       * Get unread notification count
       */
      unreadCount(): number {
        return getNotificationManager().getUnreadCount()
      },

      /**
       * Get read notifications from history
       */
      readHistory(): Notification[] {
        return this.history.filter((n) => n.read)
      },

      /**
       * Get unread notifications from history
       */
      unreadHistory(): Notification[] {
        return this.history.filter((n) => !n.read)
      },

      /**
       * Check if in quiet hours
       */
      isInQuietHours(): boolean {
        if (!this.preferences.quietHours.enabled) {
          return false
        }

        const now = new Date()
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}`

        const start = this.preferences.quietHours.start
        const end = this.preferences.quietHours.end

        // Handle case where quiet hours wrap around midnight
        if (start <= end) {
          return currentTime >= start && currentTime <= end
        } else {
          return currentTime >= start || currentTime <= end
        }
      },

      /**
       * Check if notifications should be shown
       */
      shouldShowNotifications(): boolean {
        return this.preferences.inAppNotifications && !this.isInQuietHours
      },
    },

    actions: {
      /**
       * Add notification
       */
      addNotification(
        type: string,
        category: NotificationCategory,
        message: string,
        options?: {
          description?: string
          duration?: number
          action?: {
            label: string
            handler: () => void | Promise<void>
          }
        }
      ) {
        return getNotificationManager().addNotification(type as any, category, message, options)
      },

      /**
       * Dismiss notification
       */
      dismissNotification(id: string) {
        getNotificationManager().dismissNotification(id)
      },

      /**
       * Clear queue
       */
      clearQueue() {
        getNotificationManager().clearQueue()
      },

      /**
       * Mark notification as read
       */
      markAsRead(id: string) {
        getNotificationManager().markAsRead(id)
      },

      /**
       * Mark all as read
       */
      markAllAsRead() {
        getNotificationManager().markAllAsRead()
      },

      /**
       * Archive notification
       */
      archiveNotification(id: string) {
        getNotificationManager().archiveNotification(id)
      },

      /**
       * Clear history
       */
      clearHistory() {
        getNotificationManager().clearHistory()
      },

      /**
       * Toggle notification category
       */
      toggleCategory(category: NotificationCategory) {
        const index = this.preferences.enabledCategories.indexOf(category)
        if (index > -1) {
          this.preferences.enabledCategories.splice(index, 1)
        } else {
          this.preferences.enabledCategories.push(category)
        }
      },

      /**
       * Set preference
       */
      setPreference<K extends keyof NotificationPreferences>(
        key: K,
        value: NotificationPreferences[K]
      ) {
        this.preferences[key] = value
      },

      /**
       * Toggle quiet hours
       */
      toggleQuietHours() {
        this.preferences.quietHours.enabled = !this.preferences.quietHours.enabled
      },

      /**
       * Update quiet hours time
       */
      setQuietHoursTime(
        timeType: 'start' | 'end',
        time: string
      ) {
        this.preferences.quietHours[timeType] = time
      },

      /**
       * Toggle notification panel
       */
      togglePanel() {
        this.panelOpen = !this.panelOpen
      },

      /**
       * Open panel
       */
      openPanel() {
        this.panelOpen = true
      },

      /**
       * Close panel
       */
      closePanel() {
        this.panelOpen = false
      },

      /**
       * Reset preferences to default
       */
      resetPreferences() {
        this.preferences = JSON.parse(JSON.stringify(DEFAULT_PREFERENCES))
      },
    },

    persist: {
      paths: ['preferences'],
    },
  }
)
