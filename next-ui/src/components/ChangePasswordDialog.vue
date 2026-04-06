<template>
  <v-dialog
    v-model="showDialog"
    :fullscreen="fullscreen"
    :transition="fullscreen ? 'dialog-bottom-transition' : undefined"
    max-width="600px"
    :aria-label="dialogTitle"
    @after-leave="reset()"
  >
    <template #default="{ isActive }">
      <v-form
        class="fill-height"
        @submit.prevent="changePassword()"
      >
        <v-card
          :title="dialogTitle"
          :loading="isLoading"
        >
          <v-card-text>
            <div class="d-flex flex-column ga-6">
              <v-text-field
                v-model="form.currentPassword"
                :label="
                  $formatMessage({
                    description: 'Change password dialog: current password label',
                    defaultMessage: 'Current Password',
                    id: 'change-pwd-current',
                  })
                "
                type="password"
                :rules="[rules.required()]"
                :error-messages="error"
                @update:model-value="error = ''"
              />

              <v-text-field
                v-model="form.newPassword"
                :label="
                  $formatMessage({
                    description: 'Change password dialog: new password label',
                    defaultMessage: 'New Password',
                    id: 'change-pwd-new',
                  })
                "
                type="password"
                :rules="[rules.required(), rules.minLength(8)]"
              />

              <v-text-field
                v-model="form.confirmPassword"
                :label="
                  $formatMessage({
                    description: 'Change password dialog: confirm password label',
                    defaultMessage: 'Confirm Password',
                    id: 'change-pwd-confirm',
                  })
                "
                type="password"
                :rules="[rules.required(), passwordMatch]"
              />

              <v-linear-progress
                v-if="form.newPassword"
                :value="passwordStrength"
                :color="strengthColor"
                height="4"
              />
              <p v-if="form.newPassword" class="text-caption text-medium-emphasis">
                {{
                  $formatMessage({
                    description: 'Change password dialog: password strength',
                    defaultMessage: 'Strength: {strength}',
                    id: 'change-pwd-strength',
                  },
                  { strength: passwordStrengthLabel },
                  )
                }}
              </p>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              :text="
                $formatMessage({
                  description: 'Change password dialog: cancel button',
                  defaultMessage: 'Cancel',
                  id: 'change-pwd-cancel',
                })
              "
              @click="isActive.value = false"
            />

            <v-spacer />

            <v-btn
              :text="
                $formatMessage({
                  description: 'Change password dialog: change button',
                  defaultMessage: 'Change Password',
                  id: 'change-pwd-change',
                })
              "
              type="submit"
              color="primary"
              :disabled="isLoading || !isFormValid"
            />
          </v-card-actions>
        </v-card>
      </v-form>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntl } from 'vue-intl'
import { useUpdateUserPassword } from '@/colada/users'
import { useCurrentUser } from '@/colada/users'
import type { ErrorCause } from '@/api/komga-client'
import { commonMessages } from '@/utils/i18n/common-messages'
import { useMessagesStore } from '@/stores/messages'
import type { VDialog } from 'vuetify/components'
import { useRules } from 'vuetify/labs/rules'

const intl = useIntl()
const rules = useRules()
const messagesStore = useMessagesStore()

const showDialog = defineModel<boolean>('dialog', { required: false })

const { fullscreen = undefined } = defineProps<{
  fullscreen?: boolean
}>()

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const error = ref<string>('')
const { mutateAsync, isLoading } = useUpdateUserPassword()
const { data: currentUser } = useCurrentUser()

const passwordMatch = () => {
  if (!form.value.newPassword || !form.value.confirmPassword) return true
  return form.value.newPassword === form.value.confirmPassword ||
    intl.formatMessage({
      description: 'Change password dialog: passwords do not match',
      defaultMessage: 'Passwords do not match',
      id: 'change-pwd-no-match',
    })
}

const passwordStrength = computed(() => {
  const pwd = form.value.newPassword
  if (!pwd) return 0
  let strength = 0
  if (pwd.length >= 8) strength += 25
  if (pwd.length >= 12) strength += 25
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25
  if (/\d/.test(pwd)) strength += 12.5
  if (/[^a-zA-Z\d]/.test(pwd)) strength += 12.5
  return Math.min(strength, 100)
})

const strengthColor = computed(() => {
  if (passwordStrength.value < 40) return 'error'
  if (passwordStrength.value < 70) return 'warning'
  return 'success'
})

const passwordStrengthLabel = computed(() => {
  if (passwordStrength.value < 40) {
    return intl.formatMessage({
      description: 'Change password dialog: weak password',
      defaultMessage: 'Weak',
      id: 'pwd-weak',
    })
  }
  if (passwordStrength.value < 70) {
    return intl.formatMessage({
      description: 'Change password dialog: fair password',
      defaultMessage: 'Fair',
      id: 'pwd-fair',
    })
  }
  return intl.formatMessage({
    description: 'Change password dialog: strong password',
    defaultMessage: 'Strong',
    id: 'pwd-strong',
  })
})

const isFormValid = computed(() => {
  return (
    form.value.currentPassword.length > 0 &&
    form.value.newPassword.length >= 8 &&
    form.value.newPassword === form.value.confirmPassword
  )
})

async function changePassword() {
  if (!currentUser.value) return

  try {
    await mutateAsync({
      userId: currentUser.value.id,
      newPassword: form.value.newPassword,
    })

    messagesStore.messages.push({
      text: intl.formatMessage({
        description: 'Change password dialog: success message',
        defaultMessage: 'Password changed successfully',
        id: 'change-pwd-success',
      }),
    })
    reset()
    showDialog.value = false
  } catch (err) {
    console.dir(err)
    error.value = intl.formatMessage(commonMessages.networkError)
  }
}

function reset() {
  form.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  error.value = ''
}

const dialogTitle = intl.formatMessage({
  description: 'Change password dialog: title',
  defaultMessage: 'Change Password',
  id: 'change-pwd-title',
})
</script>
