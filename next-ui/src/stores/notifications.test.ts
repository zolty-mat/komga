/**
 * src/stores/notifications.test.ts
 *
 * Tests for Pinia notification store
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import { NotificationCategory, NotificationType } from '@/types/notifications'

describe('Notifications Store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    const store = useNotificationsStore()
    store.clearQueue()
    store.clearHistory()
  })

  describe('Initial state', () => {
    it('should initialize with default preferences', () => {
      const store = useNotificationsStore()

      expect(store.preferences.inAppNotifications).toBe(true)
      expect(store.preferences.emailNotifications).toBe(false)
      expect(store.preferences.pushNotifications).toBe(false)
      expect(store.preferences.frequency).toBe('immediate')
      expect(store.preferences.quietHours.enabled).toBe(false)
      expect(store.panelOpen).toBe(false)
    })

    it('should initialize with all categories enabled', () => {
      const store = useNotificationsStore()

      expect(store.preferences.enabledCategories).toHaveLength(
        Object.values(NotificationCategory).length
      )
    })
  })

  describe('Queue getters', () => {
    it('should return current queue', () => {
      const store = useNotificationsStore()
      store.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'Test'
      )

      expect(store.queue).toHaveLength(1)
      expect(store.queue[0].message).toBe('Test')
    })

    it('should return unread count', () => {
      const store = useNotificationsStore()

      store.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'Test 1'
      )
      store.addNotification(
        NotificationType.Error,
        NotificationCategory.System,
        'Test 2'
      )

      expect(store.unreadCount).toBe(2)

      const firstId = store.history[1].id
      store.markAsRead(firstId)

      expect(store.unreadCount).toBe(1)
    })

    it('should return unread history', () => {
      const store = useNotificationsStore()

      store.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'Test 1'
      )
      store.addNotification(
        NotificationType.Error,
        NotificationCategory.System,
        'Test 2'
      )

      expect(store.unreadHistory).toHaveLength(2)

      const firstId = store.history[1].id
      store.markAsRead(firstId)

      expect(store.unreadHistory).toHaveLength(1)
    })

    it('should return read history', () => {
      const store = useNotificationsStore()

      const id1 = store.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'Test 1'
      )
      const id2 = store.addNotification(
        NotificationType.Error,
        NotificationCategory.System,
        'Test 2'
      )

      expect(store.readHistory).toHaveLength(0)

      store.markAsRead(id1)

      expect(store.readHistory).toHaveLength(1)
    })
  })

  describe('Notification actions', () => {
    it('should add notification', () => {
      const store = useNotificationsStore()

      const id = store.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'Test'
      )

      expect(id).toBeDefined()
      expect(store.queue).toHaveLength(1)
    })

    it('should dismiss notification', () => {
      const store = useNotificationsStore()

      const id = store.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'Test'
      )

      expect(store.queue).toHaveLength(1)

      store.dismissNotification(id)

      expect(store.queue).toHaveLength(0)
    })

    it('should clear queue', () => {
      const store = useNotificationsStore()

      store.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'Test 1'
      )
      store.addNotification(
        NotificationType.Error,
        NotificationCategory.System,
        'Test 2'
      )

      store.clearQueue()

      expect(store.queue).toHaveLength(0)
    })

    it('should mark notification as read', () => {
      const store = useNotificationsStore()

      const id = store.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'Test'
      )

      expect(store.history[0].read).toBe(false)

      store.markAsRead(id)

      expect(store.history[0].read).toBe(true)
    })

    it('should mark all as read', () => {
      const store = useNotificationsStore()

      store.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'Test 1'
      )
      store.addNotification(
        NotificationType.Error,
        NotificationCategory.System,
        'Test 2'
      )

      store.markAllAsRead()

      expect(store.history.every((n) => n.read)).toBe(true)
    })

    it('should archive notification', () => {
      const store = useNotificationsStore()

      const id = store.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'Test'
      )

      expect(store.queue).toHaveLength(1)
      expect(store.history).toHaveLength(1)

      store.archiveNotification(id)

      expect(store.queue).toHaveLength(0)
      expect(store.history).toHaveLength(0)
    })

    it('should clear history', () => {
      const store = useNotificationsStore()

      store.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'Test 1'
      )
      store.addNotification(
        NotificationType.Error,
        NotificationCategory.System,
        'Test 2'
      )

      expect(store.history).toHaveLength(2)

      store.clearHistory()

      expect(store.history).toHaveLength(0)
    })
  })

  describe('Category preferences', () => {
    it('should toggle category', () => {
      const store = useNotificationsStore()

      expect(
        store.preferences.enabledCategories.includes(NotificationCategory.Library)
      ).toBe(true)

      store.toggleCategory(NotificationCategory.Library)

      expect(
        store.preferences.enabledCategories.includes(NotificationCategory.Library)
      ).toBe(false)

      store.toggleCategory(NotificationCategory.Library)

      expect(
        store.preferences.enabledCategories.includes(NotificationCategory.Library)
      ).toBe(true)
    })

    it('should set preference', () => {
      const store = useNotificationsStore()

      expect(store.preferences.emailNotifications).toBe(false)

      store.setPreference('emailNotifications', true)

      expect(store.preferences.emailNotifications).toBe(true)
    })

    it('should toggle quiet hours', () => {
      const store = useNotificationsStore()

      expect(store.preferences.quietHours.enabled).toBe(false)

      store.toggleQuietHours()

      expect(store.preferences.quietHours.enabled).toBe(true)

      store.toggleQuietHours()

      expect(store.preferences.quietHours.enabled).toBe(false)
    })

    it('should set quiet hours time', () => {
      const store = useNotificationsStore()

      store.setQuietHoursTime('start', '22:00')
      store.setQuietHoursTime('end', '08:00')

      expect(store.preferences.quietHours.start).toBe('22:00')
      expect(store.preferences.quietHours.end).toBe('08:00')
    })
  })

  describe('Quiet hours logic', () => {
    it('should respect quiet hours enabled flag', () => {
      const store = useNotificationsStore()

      store.preferences.quietHours.enabled = false
      expect(store.isInQuietHours).toBe(false)

      store.toggleQuietHours()
      expect(store.preferences.quietHours.enabled).toBe(true)
    })

    it('should toggle quiet hours', () => {
      const store = useNotificationsStore()
      const initialState = store.preferences.quietHours.enabled

      store.toggleQuietHours()

      expect(store.preferences.quietHours.enabled).toBe(!initialState)
    })

    it('should set quiet hours time correctly', () => {
      const store = useNotificationsStore()

      store.setQuietHoursTime('start', '21:00')
      store.setQuietHoursTime('end', '09:00')

      expect(store.preferences.quietHours.start).toBe('21:00')
      expect(store.preferences.quietHours.end).toBe('09:00')
    })

    it('should determine if notifications should be shown based on inAppNotifications', () => {
      const store = useNotificationsStore()

      store.preferences.inAppNotifications = true
      store.preferences.quietHours.enabled = false
      expect(store.shouldShowNotifications).toBe(true)

      store.preferences.inAppNotifications = false
      expect(store.shouldShowNotifications).toBe(false)
    })
  })

  describe('Panel state', () => {
    it('should toggle panel', () => {
      const store = useNotificationsStore()

      expect(store.panelOpen).toBe(false)

      store.togglePanel()

      expect(store.panelOpen).toBe(true)

      store.togglePanel()

      expect(store.panelOpen).toBe(false)
    })

    it('should open panel', () => {
      const store = useNotificationsStore()

      store.openPanel()

      expect(store.panelOpen).toBe(true)
    })

    it('should close panel', () => {
      const store = useNotificationsStore()

      store.panelOpen = true

      store.closePanel()

      expect(store.panelOpen).toBe(false)
    })
  })

  describe('Preferences reset', () => {
    it('should call resetPreferences without error', () => {
      const store = useNotificationsStore()

      expect(() => {
        store.resetPreferences()
      }).not.toThrow()
    })

    it('should set frequency back to immediate after calling reset', () => {
      const store = useNotificationsStore()

      store.preferences.frequency = 'weekly'

      store.resetPreferences()

      expect(store.preferences.frequency).toBe('immediate')
    })

    it('should reset push and email notifications to false', () => {
      const store = useNotificationsStore()

      store.preferences.pushNotifications = true
      store.preferences.emailNotifications = true

      store.resetPreferences()

      expect(store.preferences.pushNotifications).toBe(false)
      expect(store.preferences.emailNotifications).toBe(false)
    })
  })
})
