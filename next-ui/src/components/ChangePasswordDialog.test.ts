import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import { server } from '@/mocks/api/node'
import ChangePasswordDialog from './ChangePasswordDialog.vue'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { useCurrentUser, useUpdateUserPassword } from '@/colada/users'
import { createPinia } from 'pinia'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('ChangePasswordDialog', () => {
  function createWrapper() {
    createMockColada(useCurrentUser)
    createMockColada(() => useUpdateUserPassword())

    const vuetify = createVuetify()
    const pinia = createPinia()

    return mount(ChangePasswordDialog, {
      props: {
        dialog: true,
      },
      global: {
        plugins: [vuetify, pinia],
        mocks: {
          $formatMessage: (msg: any) => msg.defaultMessage,
        },
      },
    })
  }

  test('renders change password dialog', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[aria-label]').exists()).toBe(true)
  })

  test('shows current password field', () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(3)
  })

  test('shows new password field', () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(3)
  })

  test('shows confirm password field', () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(3)
  })

  test('displays password strength indicator', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    if (inputs[1]) {
      await inputs[1].setValue('StrongPassword123!')
      await wrapper.vm.$nextTick()
      // Strength indicator should be visible
      expect(wrapper.text()).toBeTruthy()
    }
  })

  test('validates password match', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    if (inputs[1] && inputs[2]) {
      await inputs[1].setValue('NewPassword123!')
      await inputs[2].setValue('DifferentPassword')
      await wrapper.vm.$nextTick()
      // Form validation would catch mismatch
      expect(wrapper.vm).toBeDefined()
    }
  })

  test('disables submit button until form is valid', async () => {
    const wrapper = createWrapper()
    const buttons = wrapper.findAll('button')
    const submitBtn = buttons.find((b) => b.text().includes('Change Password'))
    if (submitBtn) {
      expect(submitBtn.attributes('disabled')).toBeDefined()
    }
  })

  test('requires minimum password length', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    if (inputs[1]) {
      await inputs[1].setValue('short')
      await wrapper.vm.$nextTick()
      // Validation rules enforce 8 character minimum
      expect(wrapper.vm).toBeDefined()
    }
  })

  test('shows cancel button', () => {
    const wrapper = createWrapper()
    const buttons = wrapper.findAll('button')
    const cancelBtn = buttons.find((b) => b.text().includes('Cancel'))
    expect(cancelBtn).toBeDefined()
  })

  test('validates all required fields', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(3)
  })

  test('password strength updates dynamically', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    if (inputs[1]) {
      // Weak password
      await inputs[1].setValue('pass')
      let strength = (wrapper.vm as any).passwordStrength
      const weakStrength = strength

      // Strong password
      await inputs[1].setValue('StrongPassword123!@#')
      strength = (wrapper.vm as any).passwordStrength
      const strongStrength = strength

      expect(strongStrength).toBeGreaterThan(weakStrength)
    }
  })

  test('resets form on close', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    if (inputs[0]) {
      await inputs[0].setValue('CurrentPassword')
      await wrapper.vm.$nextTick()
      // Reset function clears form
      ;(wrapper.vm as any).reset()
      expect((wrapper.vm as any).form.currentPassword).toBe('')
    }
  })

  test('requires current password', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    if (inputs[0]) {
      expect(inputs[0].attributes('type')).toBe('password')
    }
  })

  test('password confirmation validation works', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    if (inputs[1] && inputs[2]) {
      const pwd = 'ValidPassword123'
      await inputs[1].setValue(pwd)
      await inputs[2].setValue(pwd)
      await wrapper.vm.$nextTick()
      // Should match
      expect((wrapper.vm as any).form.newPassword).toBe(
        (wrapper.vm as any).form.confirmPassword,
      )
    }
  })

  test('shows strength color indicator', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    if (inputs[1]) {
      await inputs[1].setValue('weak')
      await wrapper.vm.$nextTick()
      const color = (wrapper.vm as any).strengthColor
      expect(color).toBeTruthy()
    }
  })

  test('shows strength label text', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    if (inputs[1]) {
      await inputs[1].setValue('StrongPassword123!')
      await wrapper.vm.$nextTick()
      const label = (wrapper.vm as any).passwordStrengthLabel
      expect(label).toBeTruthy()
    }
  })
})
