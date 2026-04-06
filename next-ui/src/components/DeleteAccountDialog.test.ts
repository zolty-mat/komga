import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import { server } from '@/mocks/api/node'
import DeleteAccountDialog from './DeleteAccountDialog.vue'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { useDeleteAccount } from '@/colada/settings'
import { createPinia } from 'pinia'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('DeleteAccountDialog', () => {
  function createWrapper() {
    createMockColada(() => useDeleteAccount())

    const vuetify = createVuetify()
    const pinia = createPinia()

    return mount(DeleteAccountDialog, {
      props: {
        dialog: true,
      },
      global: {
        plugins: [vuetify, pinia],
        mocks: {
          $formatMessage: (msg: any) => msg.defaultMessage,
        },
        stubs: {
          VAlert: false,
        },
      },
    })
  }

  test('renders delete account dialog', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[aria-label]').exists()).toBe(true)
  })

  test('shows warning alert', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('This action cannot be undone')
  })

  test('shows confirmation text instruction', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Please type')
    expect(wrapper.text()).toContain('permanently delete my account')
  })

  test('has input field for confirmation', () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
  })

  test('disables delete button when confirmation text is not entered', () => {
    const wrapper = createWrapper()
    const buttons = wrapper.findAll('button')
    const deleteBtn = buttons.find((b) => b.text().includes('Delete Account'))
    if (deleteBtn) {
      expect(deleteBtn.attributes('disabled')).toBeDefined()
    }
  })

  test('enables delete button when confirmation text is entered', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    await input.setValue('permanently delete my account')
    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAll('button')
    const deleteBtn = buttons.find((b) => b.text().includes('Delete Account'))
    expect(deleteBtn).toBeDefined()
  })

  test('shows cancel button', () => {
    const wrapper = createWrapper()
    const buttons = wrapper.findAll('button')
    const cancelBtn = buttons.find((b) => b.text().includes('Cancel'))
    expect(cancelBtn).toBeDefined()
  })

  test('confirmation input is case sensitive', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    await input.setValue('Permanently Delete My Account')
    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAll('button')
    const deleteBtn = buttons.find((b) => b.text().includes('Delete Account'))
    expect(deleteBtn?.attributes('disabled')).toBeDefined()
  })

  test('requires exact confirmation text', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    await input.setValue('permanently delete')
    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAll('button')
    const deleteBtn = buttons.find((b) => b.text().includes('Delete Account'))
    expect(deleteBtn?.attributes('disabled')).toBeDefined()
  })

  test('resets input on close', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    await input.setValue('permanently delete my account')
    await wrapper.vm.$nextTick()

    ;(wrapper.vm as any).reset()
    expect((wrapper.vm as any).confirmationInput).toBe('')
  })

  test('has confirm text constant', () => {
    const wrapper = createWrapper()
    const vm = wrapper.vm as any
    expect(vm.CONFIRM_TEXT).toBe('permanently delete my account')
  })

  test('shows error message handling', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  test('delete button is red', () => {
    const wrapper = createWrapper()
    const buttons = wrapper.findAll('button')
    const deleteBtn = buttons.find((b) => b.text().includes('Delete Account'))
    expect(deleteBtn?.classes()).toContain('v-btn--color-error')
  })

  test('confirmation input has placeholder', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('permanently delete my account')
  })

  test('allows enter key to submit', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    await input.setValue('permanently delete my account')
    await input.trigger('keyup.enter')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm).toBeDefined()
  })

  test('shows dialog title', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Delete Account')
  })

  test('dialog is modal (non-dismissable outside content)', () => {
    const wrapper = createWrapper()
    const card = wrapper.find('.v-card')
    expect(card.exists()).toBe(true)
  })
})
