import { httpTyped } from '@/mocks/api/httpTyped'

export const mockOAuth2Providers = [
  { name: 'Authentik', registrationId: 'authentik' },
  { name: 'GitHub', registrationId: 'github' },
]

export const oauth2Handlers = [
  httpTyped.get('/api/v1/oauth2/providers', ({ response }) =>
    response(200).json(mockOAuth2Providers),
  ),
]
