<template>
  <v-form
    ref="form"
    :disabled="isLoading"
    @submit.prevent="submitForm()"
  >
    <v-container max-width="400px">
      <v-row class="justify-center">
        <v-col
          cols="7"
          sm="10"
        >
          <v-img
            src="@/assets/logo.svg"
            :alt="
              $formatMessage({
                description: 'Login page: Komga logo alt text',
                defaultMessage: 'Komga logo',
                id: 'uXY7Eg',
              })
            "
          />
        </v-col>
      </v-row>

      <v-row v-if="!hidePassword">
        <v-col>
          <v-text-field
            v-model="username"
            :label="
              $formatMessage({
                description: 'Login screen: email field label',
                defaultMessage: 'Email',
                id: 'QIr0z7',
              })
            "
            autofocus
            :rules="[rules.required(), rules.email()]"
          />
        </v-col>
      </v-row>

      <v-row v-if="!hidePassword">
        <v-col>
          <v-text-field
            v-model="password"
            :label="
              $formatMessage({
                description: 'Login screen: password field label',
                defaultMessage: 'Password',
                id: '5AAGkA',
              })
            "
            type="password"
            :rules="[rules.required()]"
            :error-messages="loginError"
            @update:model-value="loginError = ''"
          />
        </v-col>
      </v-row>

      <v-row v-if="!hidePassword">
        <v-col class="py-0">
          <v-checkbox
            v-model="appStore.rememberMe"
            :label="
              $formatMessage({
                description: 'Login screen: Remember Me checkbox',
                defaultMessage: 'Remember Me',
                id: '0YG9GQ',
              })
            "
            hide-details
          />
        </v-col>
      </v-row>

      <v-row v-if="!hidePassword">
        <v-col>
          <v-btn
            :text="
              $formatMessage({
                description: 'Login screen: Sign In button',
                defaultMessage: 'Sign in',
                id: '02SRax',
              })
            "
            :loading="isLoading"
            type="submit"
            block
          />
        </v-col>
      </v-row>

      <v-row v-if="!hidePassword" class="justify-center">
        <v-col cols="auto">
          <a
            href="https://komga.org/docs/faq#i-forgot-my-password"
            target="_blank"
            class="link-underline text-body-medium"
          >
            {{
              $formatMessage({
                description: 'Login screen: Forgot your password link',
                defaultMessage: 'Forgot your password?',
                id: 'r6JNfI',
              })
            }}
          </a>
        </v-col>
      </v-row>

      <v-divider v-if="providers && providers.length > 0" class="my-4" />

      <!-- OAuth2 Provider Buttons -->
      <v-row v-if="providers && providers.length > 0">
        <v-col>
          <v-row
            v-for="provider in providers"
            :key="provider.registrationId"
            class="justify-center mb-3"
          >
            <v-col cols="auto">
              <v-btn
                :aria-label="
                  $formatMessage({
                    description: 'Login screen: OAuth2 provider button aria-label',
                    defaultMessage: `Sign in with ${provider.name}`,
                    id: 'oauth2LoginBtn',
                  })
                "
                @click="oauth2Login(provider.registrationId)"
                variant="outlined"
                block
              >
                {{
                  $formatMessage({
                    description: 'Login screen: OAuth2 provider button text',
                    defaultMessage: `Sign in with ${provider.name}`,
                    id: `oauth2Btn_${provider.registrationId}`,
                  })
                }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider v-if="!hidePassword && (providers && providers.length > 0)" class="my-4" />

      <v-row class="justify-center">
        <v-col cols="auto">
          <div class="d-flex ga-4">
            <LocaleSelector />
            <ThemeSelector />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts" setup>
import { type ErrorCause } from '@/api/komga-client'
import { useMessagesStore } from '@/stores/messages'
import { useIntl } from 'vue-intl'
import { commonMessages } from '@/utils/i18n/common-messages'
import { useAppStore } from '@/stores/app'
import { useLogin } from '@/colada/users'
import { useClaimStatus } from '@/colada/claim'
import { useOAuth2Providers } from '@/colada/oauth2'
import { useClientSettingsGlobal } from '@/colada/client-settings'
import { useRules } from 'vuetify/labs/rules'

const messagesStore = useMessagesStore()
const intl = useIntl()
const appStore = useAppStore()
const rules = useRules()

const form = ref()
const username = ref('')
const password = ref('')
const loginError = ref<string>('')

const router = useRouter()
const route = useRoute()

const { mutateAsync: performLogin, isLoading } = useLogin()
const { data: providers } = useOAuth2Providers()
const { data: globalSettings } = useClientSettingsGlobal()

const hidePassword = computed(() => {
  if (!providers.value || providers.value.length === 0) return false
  const hideLoginValue = globalSettings.value?.['webui.oauth2.hide_login']?.value
  return hideLoginValue === 'true'
})

const shouldAutoLoginOAuth2 = computed(() => {
  if (!providers.value || providers.value.length !== 1) return false
  const autoLoginValue = globalSettings.value?.['webui.oauth2.auto_login']?.value
  return autoLoginValue === 'true'
})

function oauth2Login(registrationId: string) {
  const url = `${window.location.origin}/oauth2/authorization/${registrationId}`
  const height = 700
  const width = 600
  const y = window.top!.outerHeight / 2 + window.top!.screenY - (height / 2)
  const x = window.top!.outerWidth / 2 + window.top!.screenX - (width / 2)
  const popup = window.open(
    url,
    'oauth2Login',
    `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,top=${y},left=${x},width=${width},height=${height}`,
  )
  const interval = setInterval(() => {
    try {
      if (popup?.location?.search?.includes('server_redirect=Y')) {
        clearInterval(interval)
        popup.close()
        if (route.query.redirect) void router.push(route.query.redirect.toString())
        else void router.push('/')
      }
    } catch {
      // cross-origin — keep waiting
    }
  }, 500)
}

onMounted(() => {
  if (shouldAutoLoginOAuth2.value && providers.value && providers.value.length > 0) {
    oauth2Login(providers.value[0]!.registrationId)
  }
})

async function submitForm() {
  const { valid } = await form.value.validate()
  if (valid)
    performLogin({
      username: username.value,
      password: password.value,
      rememberMe: appStore.rememberMe,
    })
      .then(() => {
        if (route.query.redirect) void router.push(route.query.redirect.toString())
        else void router.push('/')
      })
      .catch((error) => {
        if ((error?.cause as ErrorCause)?.status === 401)
          loginError.value = intl.formatMessage({
            description: 'Login screen: error message displayed when login failed',
            defaultMessage: 'Invalid login or password',
            id: 'AjWlka',
          })
        else
          messagesStore.messages.push({
            text:
              (error?.cause as ErrorCause)?.message ||
              intl.formatMessage(commonMessages.networkError),
          })
      })
}

void useClaimStatus()
  .refresh()
  .then(({ data, error }) => {
    if (error) void router.push('/error')
    else if (data?.isClaimed == false) void router.push('/')
  })
</script>

<route lang="yaml">
meta:
  layout: single
  noAuth: true
</route>
