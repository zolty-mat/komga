import type { Meta, StoryObj } from '@storybook/vue3'
import ReviewCard from './ReviewCard.vue'

const meta = {
  title: 'Social/ReviewCard',
  component: ReviewCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReviewCard>

export default meta
type Story = StoryObj<typeof meta>

const baseReview = {
  id: 'review-1',
  title: 'Amazing Comic Series!',
  text: 'This is a fantastic comic series that keeps you on the edge of your seat. The artwork is stunning and the story is engaging. Highly recommended for anyone who loves graphic novels!',
  rating: 5,
  author: {
    id: 'user-1',
    name: 'Comic Lover',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  createdAt: new Date('2025-02-15T10:30:00Z'),
  updatedAt: new Date('2025-02-15T10:30:00Z'),
  helpfulCount: 12,
  isHelpful: false,
  isAuthor: false,
}

export const HighlyRated: Story = {
  args: {
    review: baseReview,
  },
}

export const ChildersReview: Story = {
  args: {
    review: {
      ...baseReview,
      rating: 3,
      title: 'Good but predictable',
      text: 'The story was good overall, but some plot points were predictable. Still worth reading though.',
      helpfulCount: 5,
    },
  },
}

export const AuthorReview: Story = {
  args: {
    review: {
      ...baseReview,
      isAuthor: true,
      author: {
        id: 'user-self',
        name: 'You',
      },
    },
  },
}

export const WithoutAvatar: Story = {
  args: {
    review: {
      ...baseReview,
      author: {
        id: 'user-2',
        name: 'Anonymous Reader',
      },
    },
  },
}

export const WithoutRating: Story = {
  args: {
    review: {
      ...baseReview,
      rating: undefined,
    },
  },
}

export const LowRating: Story = {
  args: {
    review: {
      ...baseReview,
      rating: 1,
      title: 'Disappointing',
      text: 'I had high hopes for this series but it fell flat. The pacing was slow and the characters were not well developed.',
      helpfulCount: 2,
    },
  },
}

export const ManyHelpfulVotes: Story = {
  args: {
    review: {
      ...baseReview,
      helpfulCount: 243,
    },
  },
}
