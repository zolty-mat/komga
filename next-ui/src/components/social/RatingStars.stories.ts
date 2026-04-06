import type { Meta, StoryObj } from '@storybook/vue3'
import RatingStars from './RatingStars.vue'

const meta = {
  title: 'Social/RatingStars',
  component: RatingStars,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RatingStars>

export default meta
type Story = StoryObj<typeof meta>

export const NoRating: Story = {
  args: {
    modelValue: 0,
    interactive: true,
    label: 'Rate this book',
  },
}

export const FiveStars: Story = {
  args: {
    modelValue: 5,
    interactive: false,
    label: 'Excellent',
  },
}

export const ThreeStars: Story = {
  args: {
    modelValue: 3,
    interactive: true,
    label: 'Good',
  },
}

export const OneStarInteractive: Story = {
  args: {
    modelValue: 1,
    interactive: true,
  },
}

export const ReadOnly: Story = {
  args: {
    modelValue: 4.5,
    interactive: false,
  },
}

export const NoLabel: Story = {
  args: {
    modelValue: 4,
    interactive: true,
    label: undefined,
  },
}
