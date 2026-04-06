import type { Meta, StoryObj } from '@storybook/vue3'
import ShareDialog from './ShareDialog.vue'

const meta = {
  title: 'Social/ShareDialog',
  component: ShareDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ShareDialog>

export default meta
type Story = StoryObj<typeof meta>

const availableUsers = [
  { id: 'user-1', name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 'user-2', name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 'user-3', name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 'user-4', name: 'Diana Prince', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 'user-5', name: 'Eve Wilson', avatar: 'https://i.pravatar.cc/150?img=5' },
]

export const Closed: Story = {
  args: {
    modelValue: false,
    bookTitle: 'Amazing Comic Series',
    bookUrl: 'amazing-comic-series',
    availableUsers,
  },
}

export const Open: Story = {
  args: {
    modelValue: true,
    bookTitle: 'Amazing Comic Series',
    bookUrl: 'amazing-comic-series',
    availableUsers,
  },
}

export const NoAvailableUsers: Story = {
  args: {
    modelValue: true,
    bookTitle: 'Fantastic Graphic Novel',
    bookUrl: 'fantastic-graphic-novel',
    availableUsers: [],
  },
}

export const ManyUsers: Story = {
  args: {
    modelValue: true,
    bookTitle: 'Epic Series',
    bookUrl: 'epic-series',
    availableUsers: [
      ...availableUsers,
      ...availableUsers.map((u, i) => ({
        ...u,
        id: `user-${i + 10}`,
        name: `${u.name} ${i}`,
      })),
    ],
  },
}

export const LongBookTitle: Story = {
  args: {
    modelValue: true,
    bookTitle: 'The Complete Chronicles of an Absolutely Spectacular and Thrilling Adventure',
    bookUrl: 'complete-chronicles-spectacular-adventure',
    availableUsers,
  },
}
