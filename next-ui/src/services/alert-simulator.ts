/**
 * src/services/alert-simulator.ts
 *
 * Alert simulator for demo and testing purposes
 * Generates sample notifications for different scenarios
 */

import { useNotifications } from '@/services/notifications'
import { NotificationCategory, NotificationType } from '@/types/notifications'

const notificationManager = useNotifications()

/**
 * Sample notification scenarios
 */
export const AlertScenarios = {
  /**
   * New book added to library
   */
  newBookAdded: () => {
    return notificationManager.success(
      NotificationCategory.Library,
      'New book added to library',
      {
        description: '"The Midnight Library" by Matt Haig has been added to your collection',
        duration: 4000,
        action: {
          label: 'View',
          handler: () => console.log('View book'),
        },
      }
    )
  },

  /**
   * Reading milestone achieved
   */
  readingMilestone: () => {
    return notificationManager.achievement('100 Books Read! Congratulations!', {
      description: 'You have reached a major reading milestone',
      duration: 6000,
    })
  },

  /**
   * Series completion
   */
  seriesComplete: () => {
    return notificationManager.success(
      NotificationCategory.Reading,
      'Series completed!',
      {
        description: 'You have finished reading all books in "Mistborn" series',
        duration: 4000,
      }
    )
  },

  /**
   * Reading streak milestone
   */
  readingStreak: () => {
    return notificationManager.achievement('7-Day Reading Streak!', {
      description: 'You have read every day for a week',
      duration: 6000,
    })
  },

  /**
   * Collection created
   */
  collectionCreated: () => {
    return notificationManager.success(
      NotificationCategory.Achievement,
      'Collection created',
      {
        description: 'Your first collection "Favorites" has been created',
      }
    )
  },

  /**
   * System maintenance alert
   */
  systemMaintenance: () => {
    return notificationManager.warning(
      NotificationCategory.System,
      'Scheduled maintenance',
      {
        description: 'Server maintenance scheduled for 2:00 AM tonight',
        duration: 5000,
      }
    )
  },

  /**
   * Error notification
   */
  importError: () => {
    return notificationManager.error(
      NotificationCategory.Library,
      'Import failed',
      {
        description: 'Failed to import 3 books. Check logs for details.',
        duration: 6000,
        action: {
          label: 'Retry',
          handler: () => console.log('Retry import'),
        },
      }
    )
  },

  /**
   * Information notification
   */
  libraryUpdated: () => {
    return notificationManager.info(
      NotificationCategory.Library,
      'Library updated',
      {
        description: 'Library scan completed. 42 new items indexed.',
      }
    )
  },

  /**
   * Read receipt milestone
   */
  readReceiptMilestone: () => {
    return notificationManager.achievement('Bookworm Badge!', {
      description: 'You have marked 500 books as read',
      duration: 6000,
    })
  },

  /**
   * New genre exploration
   */
  genreExploration: () => {
    return notificationManager.success(
      NotificationCategory.Library,
      'New genre added to your library',
      {
        description: 'Explore "Science Fiction" - we have 150+ titles',
        duration: 4000,
      }
    )
  },
}

/**
 * Generate random alerts for stress testing
 */
export function generateRandomAlerts(count: number = 3) {
  const scenarios = Object.values(AlertScenarios)

  for (let i = 0; i < count; i++) {
    const randomScenario =
      scenarios[Math.floor(Math.random() * scenarios.length)]
    setTimeout(() => {
      randomScenario()
    }, i * 500)
  }
}

/**
 * Generate alert sequence for demo
 */
export function generateDemoSequence() {
  const sequence = [
    { scenario: AlertScenarios.newBookAdded, delay: 0 },
    { scenario: AlertScenarios.libraryUpdated, delay: 2000 },
    { scenario: AlertScenarios.readingMilestone, delay: 4000 },
    { scenario: AlertScenarios.readingStreak, delay: 7000 },
    { scenario: AlertScenarios.seriesComplete, delay: 10000 },
  ]

  sequence.forEach(({ scenario, delay }) => {
    setTimeout(() => {
      scenario()
    }, delay)
  })
}
