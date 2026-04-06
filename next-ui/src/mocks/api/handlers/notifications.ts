/**
 * src/mocks/api/handlers/notifications.ts
 *
 * MSW mock handlers for notification endpoints
 */

import { http, HttpResponse } from 'msw'
import type { Notification } from '@/types/notifications'
import { NotificationType, NotificationCategory } from '@/types/notifications'

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: NotificationType.Success,
    category: NotificationCategory.Library,
    message: 'New book added to library',
    description: '"The Midnight Library" by Matt Haig',
    timestamp: new Date(Date.now() - 3600000),
    read: true,
  },
  {
    id: 'notif-2',
    type: NotificationType.Info,
    category: NotificationCategory.Reading,
    message: 'Reading streak milestone',
    description: '7 days of continuous reading',
    timestamp: new Date(Date.now() - 7200000),
    read: true,
  },
  {
    id: 'notif-3',
    type: NotificationType.Achievement,
    category: NotificationCategory.Achievement,
    message: '100 Books Read!',
    description: 'You have reached a major reading milestone',
    timestamp: new Date(Date.now() - 10800000),
    read: false,
  },
]

export const notificationHandlers = [
  /**
   * GET /api/notifications
   * Fetch all notifications
   */
  http.get('/api/notifications', () => {
    return HttpResponse.json(mockNotifications)
  }),

  /**
   * GET /api/notifications/:id
   * Fetch notification by ID
   */
  http.get('/api/notifications/:id', ({ params }) => {
    const notification = mockNotifications.find((n) => n.id === params.id)

    if (!notification) {
      return HttpResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(notification)
  }),

  /**
   * POST /api/notifications/:id/read
   * Mark notification as read
   */
  http.post('/api/notifications/:id/read', ({ params }) => {
    const notification = mockNotifications.find((n) => n.id === params.id)

    if (!notification) {
      return HttpResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    notification.read = true
    return HttpResponse.json(notification)
  }),

  /**
   * POST /api/notifications/read-all
   * Mark all notifications as read
   */
  http.post('/api/notifications/read-all', () => {
    mockNotifications.forEach((n) => {
      n.read = true
    })

    return HttpResponse.json({ success: true })
  }),

  /**
   * DELETE /api/notifications/:id
   * Delete notification
   */
  http.delete('/api/notifications/:id', ({ params }) => {
    const index = mockNotifications.findIndex((n) => n.id === params.id)

    if (index === -1) {
      return HttpResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    mockNotifications.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),

  /**
   * POST /api/notifications/clear
   * Clear all notifications
   */
  http.post('/api/notifications/clear', () => {
    mockNotifications.length = 0
    return HttpResponse.json({ success: true })
  }),

  /**
   * GET /api/notifications/preferences
   * Fetch notification preferences
   */
  http.get('/api/notifications/preferences', () => {
    return HttpResponse.json({
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
    })
  }),

  /**
   * POST /api/notifications/preferences
   * Update notification preferences
   */
  http.post('/api/notifications/preferences', async ({ request }) => {
    const body = await request.json()

    return HttpResponse.json({
      ...body,
      updated: true,
    })
  }),
]
