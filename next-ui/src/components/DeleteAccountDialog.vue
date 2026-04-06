<template>
  <v-dialog
    v-model="showDialog"
    max-width="500px"
    :aria-label="dialogTitle"
    @after-leave="reset()"
  >
    <template #default="{ isActive }">
      <v-card :title="dialogTitle">
        <v-card-text>
          <v-alert
            type="error"
            class="mb-4"
          >
            {{
              $formatMessage({
                description: 'Delete account dialog: warning message',
                defaultMessage:
                  'This action cannot be undone. All your data will be permanently deleted.',
                id: 'delete-account-warning',
              })
            }}
          </v-alert>

          <p class="mb-4">
            {{
              $formatMessage({
                description: 'Delete account dialog: confirmation instruction',
                defaultMessage: 'Please type "{confirmText}" to confirm account deletion:',
                id: 'delete-account-confirm-text',
              },
              { confirmText: CONFIRM_TEXT },
              )
            }}
          </p>

          <v-text-field
            v-model="confirmationInput"
            :placeholder="CONFIRM_TEXT"
            @keyup.enter="deleteAccount"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="isActive.value = false"
          >
            {{
              $formatMessage({
                description: 'Delete account dialog: cancel button',
                defaultMessage: 'Cancel',
                id: 'delete-account-cancel',
              })
            }}
          </v-btn>
          <v-btn
            color="error"
            :disabled="confirmationInput !== CONFIRM_TEXT || isLoading"
            :loading="isLoading"
            @click="deleteAccount"
          >
            {{
              $formatMessage({
                description: 'Delete account dialog: confirm delete button',
                defaultMessage: 'Delete Account',
                id: 'delete-account-confirm',
              })
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useIntl } from 'vue-intl'
import { useDeleteAccount } from '@/colada/settings'
import { useMessagesStore } from '@/stores/messages'
import { useRouter } from 'vue-router'

const intl = useIntl()
const router = useRouter()
const messagesStore = useMessagesStore()

const CONFIRM_TEXT = 'permanently delete my account'

const showDialog = defineModel<boolean>('dialog', { required: false })

const confirmationInput = ref<string>('')
const { mutate, isLoading } = useDeleteAccount()

async function deleteAccount() {
  try {
    await mutate()
    messagesStore.messages.push({
      text: intl.formatMessage({
        description: 'Delete account dialog: success message',
        defaultMessage: 'Account deleted successfully',
        id: 'delete-account-success',
      }),
    })
    reset()
    showDialog.value = false
    await router.push('/login')
  } catch (error) {
    messagesStore.messages.push({
      text: intl.formatMessage({
        description: 'Delete account dialog: error message',
        defaultMessage: 'Failed to delete account',
        id: 'delete-account-error',
      }),
    })
  }
}

function reset() {
  confirmationInput.value = ''
}

const dialogTitle = intl.formatMessage({
  description: 'Delete account dialog: title',
  defaultMessage: 'Delete Account',
  id: 'delete-account-title',
})
</script>
