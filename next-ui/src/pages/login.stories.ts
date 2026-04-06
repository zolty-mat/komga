import type { Meta, StoryObj } from '@storybook/vue3-vite'

import login from './login.vue'
import { http, delay } from 'msw'

import { response401Unauthorized, response502BadGateway } from '@/mocks/api/handlers'
import { expect, waitFor } from 'storybook/test'
import { useMessagesStore } from '@/stores/messages'
import { httpTyped } from '@/mocks/api/httpTyped'
import { mockOAuth2Providers } from '@/mocks/api/handlers/oauth2'

const meta = {
  component: login,
  render: (args: object) => ({
    components: { login },
    setup() {
      return { args }
    },
    template: '<login />',
  }),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    docs: {
      description: {
        component: '',
      },
    },
  },
  args: {},
} satisfies Meta<typeof login>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Invalid: Story = {
  parameters: {
    msw: {
      handlers: [http.get('*/api/v2/users/me', response401Unauthorized)],
    },
  },
  play: async ({ canvas, userEvent }) => {
    const login = canvas.getByLabelText(/email/i, {
      selector: 'input',
    })
    await userEvent.type(login, 'test@example.org')

    const password = canvas.getByLabelText(/password/i, {
      selector: 'input',
    })
    await userEvent.type(password, 'abc')

    await userEvent.click(canvas.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(canvas.getByText(/invalid login/i)).toBeVisible())
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [http.all('*/api/*', async () => await delay(5_000))],
    },
  },
  play: async ({ canvas, userEvent }) => {
    const login = canvas.getByLabelText(/email/i, {
      selector: 'input',
    })
    await userEvent.type(login, 'test@example.org')

    const password = canvas.getByLabelText(/password/i, {
      selector: 'input',
    })
    await userEvent.type(password, 'abc')

    await userEvent.click(canvas.getByRole('button', { name: /sign in/i }))
  },
}

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [http.post('*/api/*', response502BadGateway)],
    },
  },
  play: async ({ canvas, userEvent }) => {
    const login = canvas.getByLabelText(/email/i, {
      selector: 'input',
    })
    await userEvent.type(login, 'test@example.org')

    const password = canvas.getByLabelText(/password/i, {
      selector: 'input',
    })
    await userEvent.type(password, 'abc')

    await userEvent.click(canvas.getByRole('button', { name: /sign in/i }))

    const messagesStore = useMessagesStore()
    await waitFor(() => expect(messagesStore.messages.length).toBe(1))
  },
}

export const WithOAuth2Providers: Story = {
  parameters: {
    msw: {
      handlers: [
        httpTyped.get('/api/v1/oauth2/providers', ({ response }) =>
          response(200).json(mockOAuth2Providers),
        ),
        httpTyped.get('/api/v1/client-settings/global/list', ({ response }) =>
          response(200).json({
            'webui.oauth2.hide_login': { value: 'false' },
            'webui.oauth2.auto_login': { value: 'false' },
          }),
        ),
      ],
    },
  },
  play: async ({ canvas }) => {
    // Verify password form is visible
    await expect(canvas.getByLabelText(/email/i, { selector: 'input' })).toBeVisible()
    await expect(canvas.getByLabelText(/password/i, { selector: 'input' })).toBeVisible()

    // Verify both OAuth2 buttons are visible
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: /authentik/i }),
      ).toBeVisible(),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: /github/i }),
      ).toBeVisible(),
    )
  },
}

export const WithSingleProvider: Story = {
  parameters: {
    msw: {
      handlers: [
        httpTyped.get('/api/v1/oauth2/providers', ({ response }) =>
          response(200).json([{ name: 'GitHub', registrationId: 'github' }]),
        ),
        httpTyped.get('/api/v1/client-settings/global/list', ({ response }) =>
          response(200).json({
            'webui.oauth2.hide_login': { value: 'false' },
            'webui.oauth2.auto_login': { value: 'false' },
          }),
        ),
      ],
    },
  },
  play: async ({ canvas }) => {
    // Verify password form is visible
    await expect(canvas.getByLabelText(/email/i, { selector: 'input' })).toBeVisible()
    await expect(canvas.getByLabelText(/password/i, { selector: 'input' })).toBeVisible()

    // Verify single OAuth2 button is visible
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: /github/i }),
      ).toBeVisible(),
    )
  },
}

export const HideLogin: Story = {
  parameters: {
    msw: {
      handlers: [
        httpTyped.get('/api/v1/oauth2/providers', ({ response }) =>
          response(200).json(mockOAuth2Providers),
        ),
        httpTyped.get('/api/v1/client-settings/global/list', ({ response }) =>
          response(200).json({
            'webui.oauth2.hide_login': { value: 'true' },
            'webui.oauth2.auto_login': { value: 'false' },
          }),
        ),
      ],
    },
  },
  play: async ({ canvas }) => {
    // Verify OAuth2 buttons are visible when login form is hidden
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: /authentik/i }),
      ).toBeVisible(),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: /github/i }),
      ).toBeVisible(),
    )
  },
}

export const NoProviders: Story = {
  parameters: {
    msw: {
      handlers: [
        httpTyped.get('/api/v1/oauth2/providers', ({ response }) =>
          response(200).json([]),
        ),
        httpTyped.get('/api/v1/client-settings/global/list', ({ response }) =>
          response(200).json({
            'webui.oauth2.hide_login': { value: 'false' },
            'webui.oauth2.auto_login': { value: 'false' },
          }),
        ),
      ],
    },
  },
  play: async ({ canvas }) => {
    // Verify password form is visible
    await expect(canvas.getByLabelText(/email/i, { selector: 'input' })).toBeVisible()
    await expect(canvas.getByLabelText(/password/i, { selector: 'input' })).toBeVisible()

    // Verify no OAuth2 buttons are present (Authentik or GitHub buttons should not exist)
    const oauthButtons = canvas.queryAllByRole('button', { name: /(authentik|github)/i })
    await expect(oauthButtons.length).toBe(0)
  },
}
