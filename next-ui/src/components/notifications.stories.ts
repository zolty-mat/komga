/**
 * src/components/notifications.stories.ts
 *
 * Storybook stories for notification components
 */

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import NotificationToast from './NotificationToast.vue'
import NotificationContainer from './NotificationContainer.vue'
import NotificationPanel from './NotificationPanel.vue'
import NotificationBell from './NotificationBell.vue'
import { useNotificationsStore } from '@/stores/notifications'
import { NotificationType, NotificationCategory } from '@/types/notifications'

// ============================================================================
// NotificationToast Stories
// ============================================================================

const toastMeta = {
  component: NotificationToast,
  render: (args: object) => ({
    components: { NotificationToast },
    setup() {
      return { args }
    },
    template: '<NotificationToast :notification="args" />',
  }),
  parameters: {
    docs: {
      description: {
        component: 'Individual notification toast component with icon, message, and action',
      },
    },
  },
} satisfies Meta<typeof NotificationToast>

export default toastMeta
type ToastStory = StoryObj<typeof toastMeta>

export const SuccessToast: ToastStory = {
  args: {
    notification: {
      id: '1',
      type: NotificationType.Success,
      category: NotificationCategory.Library,
      message: 'Operation completed successfully',
      description: 'Your library has been updated with 5 new books',
      timestamp: new Date(),
      read: false,
      duration: 3000,
    },
  },
}

export const ErrorToast: ToastStory = {
  args: {
    notification: {
      id: '2',
      type: NotificationType.Error,
      category: NotificationCategory.System,
      message: 'An error occurred',
      description: 'Failed to import books. Please try again.',
      timestamp: new Date(),
      read: false,
      duration: 5000,
    },
  },
}

export const WarningToast: ToastStory = {
  args: {
    notification: {
      id: '3',
      type: NotificationType.Warning,
      category: NotificationCategory.System,
      message: 'Scheduled maintenance',
      description: 'Server maintenance scheduled for 2:00 AM tonight',
      timestamp: new Date(),
      read: false,
      duration: 4000,
    },
  },
}

export const InfoToast: ToastStory = {
  args: {
    notification: {
      id: '4',
      type: NotificationType.Info,
      category: NotificationCategory.Library,
      message: 'Library updated',
      description: 'Library scan completed. 42 new items indexed.',
      timestamp: new Date(),
      read: false,
      duration: 3500,
    },
  },
}

export const AchievementToast: ToastStory = {
  args: {
    notification: {
      id: '5',
      type: NotificationType.Achievement,
      category: NotificationCategory.Achievement,
      message: '100 Books Read!',
      description: 'You have reached a major reading milestone',
      timestamp: new Date(),
      read: false,
      duration: 6000,
    },
  },
}

export const ToastWithAction: ToastStory = {
  args: {
    notification: {
      id: '6',
      type: NotificationType.Success,
      category: NotificationCategory.Library,
      message: 'New book added',
      description: '"The Midnight Library" by Matt Haig',
      timestamp: new Date(),
      read: false,
      action: {
        label: 'View',
        handler: () => console.log('View book'),
      },
      duration: 4000,
    },
  },
}

// ============================================================================
// NotificationContainer Stories
// ============================================================================

const containerMeta = {
  component: NotificationContainer,
  render: (args: object) => ({
    components: { NotificationContainer },
    setup() {
      return { args }
    },
    template: '<NotificationContainer />',
  }),
  parameters: {
    docs: {
      description: {
        component: 'Container for displaying multiple notification toasts with animation',
      },
    },
  },
} satisfies Meta<typeof NotificationContainer>

export const ContainerEmpty: StoryObj<typeof containerMeta> = {
  render: () => ({
    components: { NotificationContainer },
    template: '<NotificationContainer />',
  }),
}

export const ContainerWithNotifications: StoryObj<typeof containerMeta> = {
  render: () => ({
    components: { NotificationContainer },
    setup() {
      const notificationsStore = useNotificationsStore()

      notificationsStore.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'New book added',
        { description: '"The Midnight Library" by Matt Haig' }
      )

      notificationsStore.addNotification(
        NotificationType.Info,
        NotificationCategory.Library,
        'Library updated',
        { description: '42 new items indexed' }
      )

      return {}
    },
    template: '<NotificationContainer />',
  }),
}

export const ContainerMultipleNotifications: StoryObj<typeof containerMeta> = {
  render: () => ({
    components: { NotificationContainer },
    setup() {
      const notificationsStore = useNotificationsStore()

      ;[
        {
          type: NotificationType.Success,
          category: NotificationCategory.Library,
          message: 'Import completed',
          description: '15 books imported successfully',
        },
        {
          type: NotificationType.Info,
          category: NotificationCategory.Reading,
          message: 'Reading streak milestone',
          description: '7 days in a row',
        },
        {
          type: NotificationType.Achievement,
          category: NotificationCategory.Achievement,
          message: 'Bookworm Badge',
          description: 'You have marked 500 books as read',
        },
        {
          type: NotificationType.Warning,
          category: NotificationCategory.System,
          message: 'Low storage',
          description: 'Library storage is running low',
        },
      ].forEach(({ type, category, message, description }) => {
        notificationsStore.addNotification(type, category, message, { description })
      })

      return {}
    },
    template: '<NotificationContainer />',
  }),
}

// ============================================================================
// NotificationPanel Stories
// ============================================================================

const panelMeta = {
  component: NotificationPanel,
  render: (args: object) => ({
    components: { NotificationPanel },
    setup() {
      return { args }
    },
    template: '<NotificationPanel />',
  }),
  parameters: {
    docs: {
      description: {
        component: 'Side panel showing notification history with search and filtering',
      },
    },
  },
} satisfies Meta<typeof NotificationPanel>

export const PanelEmpty: StoryObj<typeof panelMeta> = {
  render: () => ({
    components: { NotificationPanel },
    setup() {
      const notificationsStore = useNotificationsStore()
      notificationsStore.openPanel()
      return {}
    },
    template: '<NotificationPanel />',
  }),
}

export const PanelWithHistory: StoryObj<typeof panelMeta> = {
  render: () => ({
    components: { NotificationPanel },
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
          description: '7 days in a row',
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
          description: 'Server maintenance scheduled for 2:00 AM',
        },
        {
          type: NotificationType.Error,
          category: NotificationCategory.System,
          message: 'Import failed',
          description: 'Failed to import 3 books',
        },
      ].forEach(({ type, category, message, description }) => {
        notificationsStore.addNotification(type, category, message, { description })
      })

      notificationsStore.openPanel()
      return {}
    },
    template: '<NotificationPanel />',
  }),
}

export const PanelWithUnread: StoryObj<typeof panelMeta> = {
  render: () => ({
    components: { NotificationPanel },
    setup() {
      const notificationsStore = useNotificationsStore()

      const id1 = notificationsStore.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'New book added',
        { description: '"The Midnight Library" by Matt Haig' }
      )

      const id2 = notificationsStore.addNotification(
        NotificationType.Info,
        NotificationCategory.Library,
        'Library updated',
        { description: '42 new items indexed' }
      )

      // Mark only first as read
      notificationsStore.markAsRead(id1)

      notificationsStore.openPanel()
      return {}
    },
    template: '<NotificationPanel />',
  }),
}

// ============================================================================
// NotificationBell Stories
// ============================================================================

const bellMeta = {
  component: NotificationBell,
  render: (args: object) => ({
    components: { NotificationBell },
    setup() {
      return { args }
    },
    template: '<NotificationBell />',
  }),
  parameters: {
    docs: {
      description: {
        component: 'Notification bell icon with unread count badge',
      },
    },
  },
} satisfies Meta<typeof NotificationBell>

export const BellNoNotifications: StoryObj<typeof bellMeta> = {
  render: () => ({
    components: { NotificationBell },
    template: '<NotificationBell />',
  }),
}

export const BellWithNotifications: StoryObj<typeof bellMeta> = {
  render: () => ({
    components: { NotificationBell },
    setup() {
      const notificationsStore = useNotificationsStore()

      notificationsStore.addNotification(
        NotificationType.Success,
        NotificationCategory.Library,
        'Notification 1'
      )
      notificationsStore.addNotification(
        NotificationType.Info,
        NotificationCategory.Library,
        'Notification 2'
      )
      notificationsStore.addNotification(
        NotificationType.Achievement,
        NotificationCategory.Achievement,
        'Notification 3'
      )

      return {}
    },
    template: '<NotificationBell />',
  }),
}

export const BellWithManyNotifications: StoryObj<typeof bellMeta> = {
  render: () => ({
    components: { NotificationBell },
    setup() {
      const notificationsStore = useNotificationsStore()

      for (let i = 0; i < 15; i++) {
        notificationsStore.addNotification(
          NotificationType.Info,
          NotificationCategory.Library,
          `Notification ${i + 1}`
        )
      }

      return {}
    },
    template: '<NotificationBell />',
  }),
}
