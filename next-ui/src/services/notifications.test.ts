/**
 * src/services/notifications.test.ts
 *
 * Tests for notification manager service
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useNotifications } from '@/services/notifications'
import { NotificationType, NotificationCategory } from '@/types/notifications'

describe('NotificationManager', () => {
  let notificationManager: ReturnType<typeof useNotifications>

  beforeEach(() => {
    localStorage.clear()
    notificationManager = useNotifications()
    notificationManager.clearQueue()
    notificationManager.clearHistory()
  })

  afterEach(() => {
    notificationManager.clearQueue()
    notificationManager.clearHistory()
    localStorage.clear()
  })

  describe('Basic notification creation', () => {
    it('should create a success notification', () => {
      const id = notificationManager.success(
        NotificationCategory.Library,
        'Test success'
      )

      expect(id).toBeDefined()
      expect(notificationManager.getQueue()).toHaveLength(1)
      expect(notificationManager.getQueue()[0].type).toBe(NotificationType.Success)
    })

    it('should create an error notification', () => {
      notificationManager.error(NotificationCategory.System, 'Test error')

      expect(notificationManager.getQueue()).toHaveLength(1)
      expect(notificationManager.getQueue()[0].type).toBe(NotificationType.Error)
    })

    it('should create a warning notification', () => {
      notificationManager.warning(NotificationCategory.System, 'Test warning')

      expect(notificationManager.getQueue()).toHaveLength(1)
      expect(notificationManager.getQueue()[0].type).toBe(NotificationType.Warning)
    })

    it('should create an info notification', () => {
      notificationManager.info(NotificationCategory.System, 'Test info')

      expect(notificationManager.getQueue()).toHaveLength(1)
      expect(notificationManager.getQueue()[0].type).toBe(NotificationType.Info)
    })

    it('should create an achievement notification', () => {
      notificationManager.achievement('Test achievement')

      expect(notificationManager.getQueue()).toHaveLength(1)
      expect(notificationManager.getQueue()[0].type).toBe(NotificationType.Achievement)
    })
  })

  describe('Queue management', () => {
    it('should add multiple notifications to queue', () => {
      notificationManager.success(NotificationCategory.Library, 'Notification 1')
      notificationManager.error(NotificationCategory.System, 'Notification 2')
      notificationManager.warning(NotificationCategory.Reading, 'Notification 3')

      expect(notificationManager.getQueue()).toHaveLength(3)
    })

    it('should dismiss notification from queue', () => {
      const id = notificationManager.success(
        NotificationCategory.Library,
        'Test'
      )
      expect(notificationManager.getQueue()).toHaveLength(1)

      notificationManager.dismissNotification(id)
      expect(notificationManager.getQueue()).toHaveLength(0)
    })

    it('should clear entire queue', () => {
      notificationManager.success(NotificationCategory.Library, 'Test 1')
      notificationManager.success(NotificationCategory.Library, 'Test 2')
      notificationManager.success(NotificationCategory.Library, 'Test 3')

      notificationManager.clearQueue()
      expect(notificationManager.getQueue()).toHaveLength(0)
    })

    it('should not dismiss notification with invalid id', () => {
      notificationManager.success(NotificationCategory.Library, 'Test')
      notificationManager.dismissNotification('invalid-id')

      expect(notificationManager.getQueue()).toHaveLength(1)
    })
  })

  describe('History management', () => {
    it('should add notification to history', () => {
      notificationManager.success(NotificationCategory.Library, 'Test')

      expect(notificationManager.getHistory()).toHaveLength(1)
    })

    it('should maintain maximum history size', () => {
      for (let i = 0; i < 150; i++) {
        notificationManager.success(NotificationCategory.Library, `Notification ${i}`)
      }

      expect(notificationManager.getHistory().length).toBeLessThanOrEqual(100)
    })

    it('should mark notification as read', () => {
      const id = notificationManager.success(
        NotificationCategory.Library,
        'Test'
      )
      expect(notificationManager.getHistory()[0].read).toBe(false)

      notificationManager.markAsRead(id)
      expect(notificationManager.getHistory()[0].read).toBe(true)
    })

    it('should mark all notifications as read', () => {
      notificationManager.success(NotificationCategory.Library, 'Test 1')
      notificationManager.error(NotificationCategory.System, 'Test 2')
      notificationManager.warning(NotificationCategory.Reading, 'Test 3')

      notificationManager.markAllAsRead()

      expect(
        notificationManager.getHistory().every((n) => n.read)
      ).toBe(true)
    })

    it('should get correct unread count', () => {
      notificationManager.success(NotificationCategory.Library, 'Test 1')
      notificationManager.success(NotificationCategory.Library, 'Test 2')
      notificationManager.success(NotificationCategory.Library, 'Test 3')

      expect(notificationManager.getUnreadCount()).toBe(3)

      const firstId = notificationManager.getHistory()[2].id
      notificationManager.markAsRead(firstId)

      expect(notificationManager.getUnreadCount()).toBe(2)
    })

    it('should remove notification from history', () => {
      const id = notificationManager.success(
        NotificationCategory.Library,
        'Test'
      )
      expect(notificationManager.getHistory()).toHaveLength(1)

      notificationManager.removeFromHistory(id)
      expect(notificationManager.getHistory()).toHaveLength(0)
    })

    it('should clear entire history', () => {
      notificationManager.success(NotificationCategory.Library, 'Test 1')
      notificationManager.success(NotificationCategory.Library, 'Test 2')

      notificationManager.clearHistory()
      expect(notificationManager.getHistory()).toHaveLength(0)
    })

    it('should archive notification (remove from both queue and history)', () => {
      const id = notificationManager.success(
        NotificationCategory.Library,
        'Test'
      )
      expect(notificationManager.getQueue()).toHaveLength(1)
      expect(notificationManager.getHistory()).toHaveLength(1)

      notificationManager.archiveNotification(id)
      expect(notificationManager.getQueue()).toHaveLength(0)
      expect(notificationManager.getHistory()).toHaveLength(0)
    })
  })

  describe('Notification metadata', () => {
    it('should include correct notification properties', () => {
      const id = notificationManager.success(
        NotificationCategory.Library,
        'Test message',
        { description: 'Test description' }
      )

      const notification = notificationManager.getHistory()[0]
      expect(notification.id).toBe(id)
      expect(notification.type).toBe(NotificationType.Success)
      expect(notification.category).toBe(NotificationCategory.Library)
      expect(notification.message).toBe('Test message')
      expect(notification.description).toBe('Test description')
      expect(notification.timestamp).toBeInstanceOf(Date)
      expect(notification.read).toBe(false)
    })

    it('should include action in notification', () => {
      const handler = vi.fn()
      notificationManager.success(
        NotificationCategory.Library,
        'Test',
        { action: { label: 'Undo', handler } }
      )

      const notification = notificationManager.getHistory()[0]
      expect(notification.action).toBeDefined()
      expect(notification.action?.label).toBe('Undo')
    })

    it('should use custom duration if provided', () => {
      notificationManager.success(
        NotificationCategory.Library,
        'Test',
        { duration: 10000 }
      )

      const notification = notificationManager.getHistory()[0]
      expect(notification.duration).toBe(10000)
    })

    it('should use default duration if not provided', () => {
      notificationManager.success(NotificationCategory.Library, 'Test')

      const notification = notificationManager.getHistory()[0]
      expect(notification.duration).toBe(3000)
    })
  })

  describe('Persistence', () => {
    it('should save history to localStorage', () => {
      notificationManager.success(NotificationCategory.Library, 'Test 1')
      notificationManager.success(NotificationCategory.Library, 'Test 2')

      const stored = localStorage.getItem('komga_notification_history')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(2)
    })

    it('should persist timestamp as ISO string in localStorage', () => {
      notificationManager.success(NotificationCategory.Library, 'Test')

      const stored = localStorage.getItem('komga_notification_history')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed[0].timestamp).toBeTruthy()
      expect(typeof parsed[0].timestamp).toBe('string')
    })

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('komga_notification_history', 'invalid json')

      // The singleton is already initialized, so we just test that calling
      // the manager doesn't throw after corrupted data
      expect(() => {
        notificationManager.success(NotificationCategory.Library, 'Test')
      }).not.toThrow()
    })
  })

  describe('Reactive refs', () => {
    it('should provide reactive history ref', () => {
      const historyRef = notificationManager.historyRef()

      notificationManager.success(NotificationCategory.Library, 'Test')

      expect(historyRef.value).toHaveLength(1)
    })

    it('should provide reactive queue ref', () => {
      const queueRef = notificationManager.queueRef()

      notificationManager.success(NotificationCategory.Library, 'Test')

      expect(queueRef.value).toHaveLength(1)
    })
  })

  describe('Default durations', () => {
    it('should set appropriate default durations', () => {
      const tests = [
        {
          handler: () => notificationManager.success(NotificationCategory.Library, 'Test'),
          expectedDuration: 3000,
        },
        {
          handler: () => notificationManager.error(NotificationCategory.System, 'Test'),
          expectedDuration: 5000,
        },
        {
          handler: () => notificationManager.warning(NotificationCategory.System, 'Test'),
          expectedDuration: 4000,
        },
        {
          handler: () => notificationManager.info(NotificationCategory.System, 'Test'),
          expectedDuration: 3500,
        },
        {
          handler: () => notificationManager.achievement('Test'),
          expectedDuration: 6000,
        },
      ]

      tests.forEach(({ handler, expectedDuration }) => {
        notificationManager.clearHistory()
        notificationManager.clearQueue()

        handler()
        const notification = notificationManager.getQueue()[0]
        expect(notification.duration).toBe(expectedDuration)
      })
    })
  })
})
