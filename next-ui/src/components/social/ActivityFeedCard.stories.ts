import type { Meta, StoryObj } from '@storybook/vue3'
import ActivityFeedCard from './ActivityFeedCard.vue'

const meta = {
  title: 'Social/ActivityFeedCard',
  component: ActivityFeedCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof meta>

export default meta
type Story = StoryObj<typeof meta>

export const RatedBook: Story = {
  args: {
    activity: {
      id: 'activity-1',
      userId: 'user-1',
      userName: 'John Doe',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      type: 'RATED',
      bookId: 'book-123',
      bookTitle: 'Amazing Comic Series',
      ratingValue: 5,
      timestamp: new Date(Date.now() - 3600000),
    },
  },
}

export const WroteReview: Story = {
  args: {
    activity: {
      id: 'activity-2',
      userId: 'user-2',
      userName: 'Jane Smith',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      type: 'REVIEWED',
      bookId: 'book-456',
      bookTitle: 'Graphic Novel Pro',
      reviewTitle: 'Incredible storytelling!',
      timestamp: new Date(Date.now() - 7200000),
    },
  },
}

export const ReadingStatusChanged: Story = {
  args: {
    activity: {
      id: 'activity-3',
      userId: 'user-3',
      userName: 'Comic Fan',
      type: 'READING_STATUS_CHANGED',
      bookId: 'book-789',
      bookTitle: 'Super Series',
      status: 'READING',
      timestamp: new Date(Date.now() - 10800000),
    },
  },
}

export const SharedBook: Story = {
  args: {
    activity: {
      id: 'activity-4',
      userId: 'user-4',
      userName: 'Book Lover',
      userAvatar: 'https://i.pravatar.cc/150?img=4',
      type: 'SHARED',
      bookId: 'book-101',
      bookTitle: 'Amazing Comic Series',
      timestamp: new Date(Date.now() - 14400000),
    },
  },
}

export const UserFollowed: Story = {
  args: {
    activity: {
      id: 'activity-5',
      userId: 'user-5',
      userName: 'New Reader',
      userAvatar: 'https://i.pravatar.cc/150?img=5',
      type: 'FOLLOWED',
      timestamp: new Date(Date.now() - 18000000),
    },
  },
}

export const WithoutAvatar: Story = {
  args: {
    activity: {
      id: 'activity-6',
      userId: 'user-6',
      userName: 'Anonymous User',
      type: 'RATED',
      bookId: 'book-202',
      bookTitle: 'Great Book',
      ratingValue: 4,
      timestamp: new Date(Date.now() - 86400000),
    },
  },
}

export const RecentActivity: Story = {
  args: {
    activity: {
      id: 'activity-7',
      userId: 'user-7',
      userName: 'Quick Reader',
      userAvatar: 'https://i.pravatar.cc/150?img=7',
      type: 'RATED',
      bookId: 'book-303',
      bookTitle: 'Latest Release',
      ratingValue: 5,
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    },
  },
}

export const CompletedReading: Story = {
  args: {
    activity: {
      id: 'activity-8',
      userId: 'user-8',
      userName: 'Book Finisher',
      userAvatar: 'https://i.pravatar.cc/150?img=8',
      type: 'READING_STATUS_CHANGED',
      bookId: 'book-404',
      bookTitle: 'Finished Series',
      status: 'COMPLETED',
      timestamp: new Date(Date.now() - 604800000), // 1 week ago
    },
  },
}
