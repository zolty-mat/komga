/**
 * src/pages/account/notifications.stories.ts
 *
 * Storybook stories for notification settings page
 */

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import NotificationsPage from './notifications.vue'
import { useNotificationsStore } from '@/stores/notifications'
import { NotificationCategory, NotificationType } from '@/types/notifications'

const meta = {
  component: NotificationsPage,
  render: () => ({
    components: { NotificationsPage },
    setup() {
      return {}
    },
    template: '<NotificationsPage />',
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Settings page for managing notification preferences',
      },
    },
  },
} satisfies Meta<typeof NotificationsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { NotificationsPage },
    template: '<NotificationsPage />',
  }),
}

export const WithHistory: Story = {
  render: () => ({
    components: { NotificationsPage },
    setup() {
      const notificationsStore = useNotificationsStore()

      ;[
        {
          type: NotificationType.Success,
          category: NotificationCategory.Library,
          message: 'New book added to library',
          description: '"The Midnight Library" by Matt Haig',
        },
        {
          type: NotificationType.Info,
          category: NotificationCategory.Reading,
          message: 'Reading streak milestone',
          description: '7 days of continuous reading',
        },
        {
          type: NotificationType.Achievement,
          category: NotificationCategory.Achievement,
          message: '100 Books Read!',
          description: 'You have reached a major reading milestone',
        },
        {
          type: NotificationType.Warning,
          category: NotificationCategory.System,
          message: 'Scheduled maintenance',
          description: 'Server maintenance scheduled for 2:00 AM tonight',
        },
        {
          type: NotificationType.Success,
          category: NotificationCategory.Library,
          message: 'Library updated',
          description: '42 new items added',
        },
        {
          type: NotificationType.Error,
          category: NotificationCategory.System,
          message: 'Import failed',
          description: 'Failed to import 3 books. Check logs for details.',
        },
        {
          type: NotificationType.Success,
          category: NotificationCategory.Reading,
          message: 'Series completed',
          description: 'You have finished all books in "Mistborn" series',
        },
        {
          type: NotificationType.Achievement,
          category: NotificationCategory.Achievement,
          message: 'Bookworm Badge!',
          description: 'You have marked 500 books as read',
        },
      ].forEach(({ type, category, message, description }) => {
        notificationsStore.addNotification(type, category, message, { description })
      })

      return {}
    },
    template: '<NotificationsPage />',
  }),
}

export const WithPreferencesChanged: Story = {
  render: () => ({
    components: { NotificationsPage },
    setup() {
      const notificationsStore = useNotificationsStore()

      // Change some preferences
      notificationsStore.setPreference('emailNotifications', true)
      notificationsStore.setPreference('pushNotifications', true)
      notificationsStore.setPreference('frequency', 'daily')
      notificationsStore.toggleQuietHours()
      notificationsStore.setQuietHoursTime('start', '22:00')
      notificationsStore.setQuietHoursTime('end', '08:00')

      // Add some history
      for (let i = 0; i < 5; i++) {
        notificationsStore.addNotification(
          NotificationType.Info,
          NotificationCategory.Library,
          `Sample notification ${i + 1}`,
          { description: 'This is a sample notification for the settings page' }
        )
      }

      return {}
    },
    template: '<NotificationsPage />',
  }),
}

export const WithCategoriesDisabled: Story = {
  render: () => ({
    components: { NotificationsPage },
    setup() {
      const notificationsStore = useNotificationsStore()

      // Disable some categories
      notificationsStore.toggleCategory(NotificationCategory.Reading)
      notificationsStore.toggleCategory(NotificationCategory.Achievement)

      return {}
    },
    template: '<NotificationsPage />',
  }),
}

export const WithAllNotificationsDisabled: Story = {
  render: () => ({
    components: { NotificationsPage },
    setup() {
      const notificationsStore = useNotificationsStore()

      notificationsStore.setPreference('inAppNotifications', false)
      notificationsStore.setPreference('emailNotifications', false)
      notificationsStore.setPreference('pushNotifications', false)

      return {}
    },
    template: '<NotificationsPage />',
  }),
}

export const WithExtensiveHistory: Story = {
  render: () => ({
    components: { NotificationsPage },
    setup() {
      const notificationsStore = useNotificationsStore()

      const types = Object.values(NotificationType)
      const categories = Object.values(NotificationCategory)

      for (let i = 0; i < 50; i++) {
        const type = types[i % types.length]
        const category = categories[i % categories.length]
        const messages = [
          'New book added',
          'Library updated',
          'Reading milestone',
          'Achievement unlocked',
          'System update',
          'Series completed',
          'Import completed',
          'Error occurred',
        ]

        notificationsStore.addNotification(
          type,
          category,
          messages[i % messages.length] + ` #${i + 1}`,
          { description: `Sample notification description for item ${i + 1}` }
        )
      }

      return {}
    },
    template: '<NotificationsPage />',
  }),
}
