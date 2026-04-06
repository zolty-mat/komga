/**
 * src/types/notifications.ts
 *
 * Notification and alert types for the notification system
 */

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Achievement = 'achievement',
}

export enum NotificationCategory {
  Library = 'library',
  Reading = 'reading',
  System = 'system',
  Achievement = 'achievement',
}

export interface Notification {
  id: string
  type: NotificationType
  category: NotificationCategory
  message: string
  description?: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    handler: () => void | Promise<void>
  }
  duration?: number
}

export interface NotificationPreferences {
  emailNotifications: boolean
  inAppNotifications: boolean
  pushNotifications: boolean
  enabledCategories: NotificationCategory[]
  frequency: 'immediate' | 'daily' | 'weekly'
  quietHours: {
    enabled: boolean
    start: string // HH:mm format
    end: string // HH:mm format
  }
}

export interface NotificationHistoryFilters {
  type?: NotificationType
  category?: NotificationCategory
  read?: boolean
  search?: string
}
