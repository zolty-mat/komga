import type { Meta, StoryObj } from '@storybook/vue3'
import ReviewForm from './ReviewForm.vue'

const meta = {
  title: 'Social/ReviewForm',
  component: ReviewForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReviewForm>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    isEditing: false,
  },
}

export const WithInitialData: Story = {
  args: {
    isEditing: false,
    initialData: {
      title: 'Great Comic',
      text: 'This is a fantastic comic series with amazing artwork and storytelling.',
      rating: 4,
      isPublic: true,
    },
  },
}

export const EditingExisting: Story = {
  args: {
    isEditing: true,
    initialData: {
      title: 'Amazing Comic Series!',
      text: 'This is a fantastic comic series that keeps you on the edge of your seat. The artwork is stunning and the story is engaging.',
      rating: 5,
      isPublic: true,
    },
  },
}

export const PrivateReview: Story = {
  args: {
    isEditing: false,
    initialData: {
      isPublic: false,
    },
  },
}

export const UnratedReview: Story = {
  args: {
    isEditing: false,
    initialData: {
      title: 'Thoughts on this book',
      text: 'Some thoughts about this book without a rating.',
      rating: 0,
      isPublic: true,
    },
  },
}
