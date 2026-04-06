/**
 * src/services/notifications.ts
 *
 * Notification service for managing notification queue, persistence, and lifecycle
 */

import type {
  Notification,
  NotificationType,
  NotificationCategory,
} from '@/types/notifications'
import { NotificationType, NotificationCategory } from '@/types/notifications'
import { ref } from 'vue'

const STORAGE_KEY = 'komga_notification_history'
const MAX_HISTORY = 100

class NotificationManager {
  private queue = ref<Notification[]>([])
  private history = ref<Notification[]>([])
  private notificationId = 0

  constructor() {
    this.loadHistory()
  }

  /**
   * Add a notification to the queue
   */
  addNotification(
    type: NotificationType,
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
  ): string {
    const notification: Notification = {
      id: `notif-${++this.notificationId}-${Date.now()}`,
      type,
      category,
      message,
      description: options?.description,
      timestamp: new Date(),
      read: false,
      action: options?.action,
      duration:
        options?.duration ?? this.getDefaultDuration(type),
    }

    this.queue.value.push(notification)
    this.addToHistory(notification)

    return notification.id
  }

  /**
   * Create success notification
   */
  success(
    category: NotificationCategory,
    message: string,
    options?: Parameters<
      typeof this.addNotification
    >[3]
  ): string {
    return this.addNotification(
      NotificationType.Success,
      category,
      message,
      options
    )
  }

  /**
   * Create error notification
   */
  error(
    category: NotificationCategory,
    message: string,
    options?: Parameters<
      typeof this.addNotification
    >[3]
  ): string {
    return this.addNotification(
      NotificationType.Error,
      category,
      message,
      { ...options, duration: options?.duration ?? 5000 }
    )
  }

  /**
   * Create warning notification
   */
  warning(
    category: NotificationCategory,
    message: string,
    options?: Parameters<
      typeof this.addNotification
    >[3]
  ): string {
    return this.addNotification(
      NotificationType.Warning,
      category,
      message,
      { ...options, duration: options?.duration ?? 4000 }
    )
  }

  /**
   * Create info notification
   */
  info(
    category: NotificationCategory,
    message: string,
    options?: Parameters<
      typeof this.addNotification
    >[3]
  ): string {
    return this.addNotification(
      NotificationType.Info,
      category,
      message,
      options
    )
  }

  /**
   * Create achievement notification
   */
  achievement(
    message: string,
    options?: Omit<
      Parameters<typeof this.addNotification>[3],
      undefined
    >
  ): string {
    return this.addNotification(
      NotificationType.Achievement,
      NotificationCategory.Achievement,
      message,
      { ...options, duration: options?.duration ?? 6000 }
    )
  }

  /**
   * Dismiss notification from queue
   */
  dismissNotification(id: string): void {
    const index = this.queue.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      this.queue.value.splice(index, 1)
    }
  }

  /**
   * Clear all notifications from queue
   */
  clearQueue(): void {
    this.queue.value = []
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): void {
    const notification = this.history.value.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.history.value.forEach((n) => {
      n.read = true
    })
  }

  /**
   * Get active queue
   */
  getQueue(): Notification[] {
    return this.queue.value
  }

  /**
   * Get notification history
   */
  getHistory(): Notification[] {
    return this.history.value
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    return this.history.value.filter((n) => !n.read).length
  }

  /**
   * Remove from history
   */
  removeFromHistory(id: string): void {
    const index = this.history.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      this.history.value.splice(index, 1)
    }
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history.value = []
    this.saveHistory()
  }

  /**
   * Archive notification (remove from both queue and history)
   */
  archiveNotification(id: string): void {
    this.dismissNotification(id)
    this.removeFromHistory(id)
  }

  /**
   * Get history reactively
   */
  historyRef() {
    return this.history
  }

  /**
   * Get queue reactively
   */
  queueRef() {
    return this.queue
  }

  private getDefaultDuration(type: NotificationType): number {
    switch (type) {
      case NotificationType.Success:
        return 3000
      case NotificationType.Error:
        return 5000
      case NotificationType.Warning:
        return 4000
      case NotificationType.Info:
        return 3500
      case NotificationType.Achievement:
        return 6000
      default:
        return 3000
    }
  }

  private addToHistory(notification: Notification): void {
    this.history.value.unshift(notification)
    if (this.history.value.length > MAX_HISTORY) {
      this.history.value.pop()
    }
    this.saveHistory()
  }

  private saveHistory(): void {
    try {
      const data = this.history.value.map((n) => ({
        ...n,
        timestamp: n.timestamp.toISOString(),
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      console.warn('Failed to save notification history to localStorage')
    }
  }

  private loadHistory(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data) as Array<Notification & { timestamp: string }>
        this.history.value = parsed.map((n) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }))
      }
    } catch {
      console.warn('Failed to load notification history from localStorage')
    }
  }
}

// Global singleton instance
const notificationManager = new NotificationManager()

export function useNotifications() {
  return notificationManager
}

export default notificationManager
