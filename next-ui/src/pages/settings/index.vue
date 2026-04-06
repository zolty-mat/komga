<template>
  <v-container class="settings-page">
    <v-row class="mb-8">
      <v-col>
        <h1>
          {{
            $formatMessage({
              description: 'Settings page: title',
              defaultMessage: 'Settings',
              id: 'settings-title',
            })
          }}
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-tabs v-model="activeTab">
          <v-tab
            value="profile"
            :text="
              $formatMessage({
                description: 'Settings page: profile tab',
                defaultMessage: 'Profile',
                id: 'settings-profile-tab',
              })
            "
          />

          <v-tab
            value="preferences"
            :text="
              $formatMessage({
                description: 'Settings page: preferences tab',
                defaultMessage: 'Preferences',
                id: 'settings-preferences-tab',
              })
            "
          />

          <v-tab
            value="statistics"
            :text="
              $formatMessage({
                description: 'Settings page: statistics tab',
                defaultMessage: 'Statistics',
                id: 'settings-statistics-tab',
              })
            "
          />

          <v-tab
            value="api-keys"
            :text="
              $formatMessage({
                description: 'Settings page: api keys tab',
                defaultMessage: 'API Keys',
                id: 'settings-api-keys-tab',
              })
            "
          />

          <v-tab
            value="security"
            :text="
              $formatMessage({
                description: 'Settings page: security tab',
                defaultMessage: 'Security',
                id: 'settings-security-tab',
              })
            "
          />
        </v-tabs>
      </v-col>
    </v-row>

    <!-- Profile Tab -->
    <v-window v-model="activeTab">
      <v-window-item value="profile">
        <v-card class="mt-4">
          <v-card-title>
            {{
              $formatMessage({
                description: 'Settings page: profile section title',
                defaultMessage: 'Profile Information',
                id: 'settings-profile-info',
              })
            }}
          </v-card-title>

          <v-card-text>
            <div v-if="currentUser" class="d-flex flex-column ga-4">
              <v-text-field
                v-model="currentUser.email"
                :label="
                  $formatMessage({
                    description: 'Settings page: email field label',
                    defaultMessage: 'Email',
                    id: 'settings-email-label',
                  })
                "
                readonly
              />

              <div>
                <p class="text-caption text-medium-emphasis">
                  {{
                    $formatMessage({
                      description: 'Settings page: account created date label',
                      defaultMessage: 'Account ID',
                      id: 'settings-created-label',
                    })
                  }}
                </p>
                <p>{{ currentUser.id }}</p>
              </div>

              <div>
                <p class="text-caption text-medium-emphasis">
                  {{
                    $formatMessage({
                      description: 'Settings page: last login label',
                      defaultMessage: 'Last login',
                      id: 'settings-last-login-label',
                    })
                  }}
                </p>
                <p>{{ lastLoginDate }}</p>
              </div>

              <div>
                <p class="text-caption text-medium-emphasis">
                  {{
                    $formatMessage({
                      description: 'Settings page: roles label',
                      defaultMessage: 'Roles',
                      id: 'settings-roles-label',
                    })
                  }}
                </p>
                <v-chip-group>
                  <v-chip
                    v-for="role in currentUser.roles"
                    :key="role"
                    label
                  >
                    {{ role }}
                  </v-chip>
                </v-chip-group>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Preferences Tab -->
      <v-window-item value="preferences">
        <v-card class="mt-4">
          <v-card-title>
            {{
              $formatMessage({
                description: 'Settings page: preferences section title',
                defaultMessage: 'Reading Preferences',
                id: 'settings-preferences-title',
              })
            }}
          </v-card-title>

          <v-card-text>
            <div class="d-flex flex-column ga-4">
              <v-select
                v-model="preferencesForm.language"
                :items="languageOptions"
                :label="
                  $formatMessage({
                    description: 'Settings page: language preference label',
                    defaultMessage: 'Language',
                    id: 'settings-language-label',
                  })
                "
              />

              <v-select
                v-model="preferencesForm.theme"
                :items="themeOptions"
                :label="
                  $formatMessage({
                    description: 'Settings page: theme preference label',
                    defaultMessage: 'Theme',
                    id: 'settings-theme-label',
                  })
                "
              />

              <v-switch
                v-model="preferencesForm.autoMarkRead"
                :label="
                  $formatMessage({
                    description: 'Settings page: auto mark read toggle',
                    defaultMessage: 'Auto-mark as read when finished',
                    id: 'settings-auto-mark-read',
                  })
                "
              />

              <v-select
                v-model="preferencesForm.readingDirection"
                :items="readingDirectionOptions"
                :label="
                  $formatMessage({
                    description: 'Settings page: reading direction label',
                    defaultMessage: 'Reading Direction',
                    id: 'settings-reading-direction',
                  })
                "
              />
            </div>

            <v-card-actions class="pl-0 mt-4">
              <v-btn
                color="primary"
                :loading="isUpdatingPreferences"
                @click="updatePreferences"
              >
                {{
                  $formatMessage({
                    description: 'Settings page: save preferences button',
                    defaultMessage: 'Save Preferences',
                    id: 'settings-save-preferences',
                  })
                }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Statistics Tab -->
      <v-window-item value="statistics">
        <v-card class="mt-4">
          <v-card-title>
            {{
              $formatMessage({
                description: 'Settings page: statistics section title',
                defaultMessage: 'Reading Statistics',
                id: 'settings-statistics-title',
              })
            }}
          </v-card-title>

          <v-card-text>
            <div v-if="readingStats && typeof readingStats === 'object'" class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
              <div class="stat-card">
                <p class="text-caption text-medium-emphasis">
                  {{
                    $formatMessage({
                      description: 'Settings page: total books read stat',
                      defaultMessage: 'Total Books Read',
                      id: 'settings-total-books',
                    })
                  }}
                </p>
                <p class="text-h5">{{ (readingStats as any)?.totalBooksRead ?? 0 }}</p>
              </div>

              <div class="stat-card">
                <p class="text-caption text-medium-emphasis">
                  {{
                    $formatMessage({
                      description: 'Settings page: current month count stat',
                      defaultMessage: 'This Month',
                      id: 'settings-current-month',
                    })
                  }}
                </p>
                <p class="text-h5">{{ (readingStats as any)?.currentMonthCount ?? 0 }}</p>
              </div>

              <div class="stat-card">
                <p class="text-caption text-medium-emphasis">
                  {{
                    $formatMessage({
                      description: 'Settings page: reading streak stat',
                      defaultMessage: 'Reading Streak',
                      id: 'settings-reading-streak',
                    })
                  }}
                </p>
                <p class="text-h5">{{ (readingStats as any)?.readingStreak ?? 0 }} days</p>
              </div>

              <div class="stat-card">
                <p class="text-caption text-medium-emphasis">
                  {{
                    $formatMessage({
                      description: 'Settings page: longest streak stat',
                      defaultMessage: 'Longest Streak',
                      id: 'settings-longest-streak',
                    })
                  }}
                </p>
                <p class="text-h5">{{ (readingStats as any)?.longestReadingStreak ?? 0 }} days</p>
              </div>

              <div class="stat-card">
                <p class="text-caption text-medium-emphasis">
                  {{
                    $formatMessage({
                      description: 'Settings page: average books per month stat',
                      defaultMessage: 'Avg Per Month',
                      id: 'settings-avg-per-month',
                    })
                  }}
                </p>
                <p class="text-h5">{{ ((readingStats as any)?.averageBooksPerMonth ?? 0).toFixed(1) }}</p>
              </div>

              <div class="stat-card">
                <p class="text-caption text-medium-emphasis">
                  {{
                    $formatMessage({
                      description: 'Settings page: total pages read stat',
                      defaultMessage: 'Total Pages',
                      id: 'settings-total-pages',
                    })
                  }}
                </p>
                <p class="text-h5">{{ ((readingStats as any)?.totalPagesRead ?? 0).toLocaleString() }}</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- API Keys Tab -->
      <v-window-item value="api-keys">
        <v-card class="mt-4">
          <v-card-title>
            {{
              $formatMessage({
                description: 'Settings page: api keys section title',
                defaultMessage: 'API Keys',
                id: 'settings-api-keys-title',
              })
            }}
          </v-card-title>

          <v-card-text>
            <v-btn
              color="primary"
              class="mb-4"
              @click="showGenerateKeyDialog = true"
            >
              {{
                $formatMessage({
                  description: 'Settings page: generate api key button',
                  defaultMessage: '+ Generate New Key',
                  id: 'settings-generate-key',
                })
              }}
            </v-btn>

            <v-table v-if="apiKeys && apiKeys.length > 0">
              <thead>
                <tr>
                  <th>
                    {{
                      $formatMessage({
                        description: 'Settings page: api key comment header',
                        defaultMessage: 'Comment',
                        id: 'settings-key-comment',
                      })
                    }}
                  </th>
                  <th>
                    {{
                      $formatMessage({
                        description: 'Settings page: api key created header',
                        defaultMessage: 'Created',
                        id: 'settings-key-created',
                      })
                    }}
                  </th>
                  <th>
                    {{
                      $formatMessage({
                        description: 'Settings page: api key last used header',
                        defaultMessage: 'Last Used',
                        id: 'settings-key-last-used',
                      })
                    }}
                  </th>
                  <th>
                    {{
                      $formatMessage({
                        description: 'Settings page: api key actions header',
                        defaultMessage: 'Actions',
                        id: 'settings-key-actions',
                      })
                    }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="key in apiKeys" :key="key.id">
                  <td>{{ key.comment }}</td>
                  <td>{{ formatDate(key.createdDate) }}</td>
                  <td>{{ formatDate(key.lastModifiedDate) }}</td>
                  <td>
                    <v-btn
                      size="small"
                      variant="text"
                      color="error"
                      @click="deleteApiKey(key.id)"
                    >
                      {{
                        $formatMessage({
                          description: 'Settings page: delete key button',
                          defaultMessage: 'Delete',
                          id: 'settings-delete-key',
                        })
                      }}
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>

            <v-alert
              v-else
              type="info"
              :text="
                $formatMessage({
                  description: 'Settings page: no api keys message',
                  defaultMessage: 'No API keys generated yet',
                  id: 'settings-no-keys',
                })
              "
            />
          </v-card-text>
        </v-card>

        <GenerateApiKeyDialog v-model:dialog="showGenerateKeyDialog" />
      </v-window-item>

      <!-- Security Tab -->
      <v-window-item value="security">
        <v-card class="mt-4">
          <v-card-title>
            {{
              $formatMessage({
                description: 'Settings page: security section title',
                defaultMessage: 'Security',
                id: 'settings-security-title',
              })
            }}
          </v-card-title>

          <v-card-text>
            <div class="d-flex flex-column ga-4">
              <div>
                <p class="text-subtitle-2">
                  {{
                    $formatMessage({
                      description: 'Settings page: change password section',
                      defaultMessage: 'Change Password',
                      id: 'settings-change-password',
                    })
                  }}
                </p>
                <v-btn
                  color="primary"
                  class="mt-2"
                  @click="showPasswordDialog = true"
                >
                  {{
                    $formatMessage({
                      description: 'Settings page: change password button',
                      defaultMessage: 'Change Password',
                      id: 'settings-change-password-btn',
                    })
                  }}
                </v-btn>
              </div>

              <v-divider />

              <div>
                <p class="text-subtitle-2">
                  {{
                    $formatMessage({
                      description: 'Settings page: logout all devices section',
                      defaultMessage: 'Logout All Devices',
                      id: 'settings-logout-all',
                    })
                  }}
                </p>
                <p class="text-caption text-medium-emphasis">
                  {{
                    $formatMessage({
                      description: 'Settings page: logout all devices description',
                      defaultMessage:
                        'End all active sessions on all devices. You will be logged out immediately.',
                      id: 'settings-logout-all-desc',
                    })
                  }}
                </p>
                <v-btn
                  color="warning"
                  class="mt-2"
                  @click="logoutAllDevices"
                  :loading="isLoggingOutAll"
                >
                  {{
                    $formatMessage({
                      description: 'Settings page: logout all button',
                      defaultMessage: 'Logout All',
                      id: 'settings-logout-all-btn',
                    })
                  }}
                </v-btn>
              </div>

              <v-divider />

              <div>
                <p class="text-subtitle-2 text-error">
                  {{
                    $formatMessage({
                      description: 'Settings page: delete account section',
                      defaultMessage: 'Delete Account',
                      id: 'settings-delete-account',
                    })
                  }}
                </p>
                <p class="text-caption text-medium-emphasis">
                  {{
                    $formatMessage({
                      description: 'Settings page: delete account description',
                      defaultMessage:
                        'Permanently delete your account and all associated data. This cannot be undone.',
                      id: 'settings-delete-account-desc',
                    })
                  }}
                </p>
                <v-btn
                  color="error"
                  variant="outlined"
                  class="mt-2"
                  @click="showDeleteAccountDialog = true"
                >
                  {{
                    $formatMessage({
                      description: 'Settings page: delete account button',
                      defaultMessage: 'Delete Account',
                      id: 'settings-delete-account-btn',
                    })
                  }}
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <ChangePasswordDialog v-model:dialog="showPasswordDialog" />
        <DeleteAccountDialog v-model:dialog="showDeleteAccountDialog" />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useIntl } from 'vue-intl'
import { useCurrentUser, useDeleteApiKey, useApiKeys, myAuthenticationActivityQuery } from '@/colada/users'
import { useReadingStatistics, useUpdateUserPreferences, useLogoutAllDevices } from '@/colada/settings'
import { useMessagesStore } from '@/stores/messages'
import { useQuery } from '@pinia/colada'
import GenerateApiKeyDialog from '@/components/apikey/GenerateDialog.vue'
import ChangePasswordDialog from '@/components/ChangePasswordDialog.vue'
import DeleteAccountDialog from '@/components/DeleteAccountDialog.vue'
import { useRouter } from 'vue-router'

const intl = useIntl()
const router = useRouter()
const messagesStore = useMessagesStore()

const activeTab = ref('profile')
const showGenerateKeyDialog = ref(false)
const showPasswordDialog = ref(false)
const showDeleteAccountDialog = ref(false)

const { data: currentUser, refresh: refreshCurrentUser } = useCurrentUser()
const { data: apiKeys, refresh: refreshApiKeys } = useApiKeys()
const { mutate: deleteApiKeyMutate } = useDeleteApiKey()
const { data: readingStats, refresh: refreshReadingStats } = useReadingStatistics()
const { mutate: updatePreferencesMutate, isLoading: isUpdatingPreferences } = useUpdateUserPreferences()
const { mutate: logoutAllMutate, isLoading: isLoggingOutAll } = useLogoutAllDevices()

const { data: authActivity } = useQuery(
  myAuthenticationActivityQuery({
    page: 0,
    size: 1,
    unpaged: false,
  }),
)

const lastLoginDate = computed(() => {
  if (authActivity.value?.content?.[0]) {
    return formatDate(authActivity.value.content[0].dateTime)
  }
  return 'N/A'
})

const languageOptions = [
  { title: 'English', value: 'en' },
  { title: 'French', value: 'fr' },
  { title: 'German', value: 'de' },
  { title: 'Spanish', value: 'es' },
  { title: 'Italian', value: 'it' },
  { title: 'Dutch', value: 'nl' },
  { title: 'Portuguese', value: 'pt' },
  { title: 'Japanese', value: 'ja' },
  { title: 'Chinese', value: 'zh' },
]

const themeOptions = [
  { title: 'Light', value: 'light' },
  { title: 'Dark', value: 'dark' },
  { title: 'Auto', value: 'auto' },
]

const readingDirectionOptions = [
  { title: 'Left to Right', value: 'ltr' },
  { title: 'Right to Left', value: 'rtl' },
]

const preferencesForm = ref({
  language: 'en',
  theme: 'auto',
  autoMarkRead: false,
  readingDirection: 'ltr',
})

async function updatePreferences() {
  try {
    await updatePreferencesMutate(preferencesForm.value)
    messagesStore.messages.push({
      text: intl.formatMessage({
        description: 'Settings page: preferences updated message',
        defaultMessage: 'Preferences updated successfully',
        id: 'settings-prefs-updated',
      }),
    })
  } catch (error) {
    messagesStore.messages.push({
      text: intl.formatMessage({
        description: 'Settings page: preferences update error',
        defaultMessage: 'Failed to update preferences',
        id: 'settings-prefs-error',
      }),
    })
  }
}

async function deleteApiKey(keyId: string) {
  try {
    const { mutate } = useDeleteApiKey()
    await mutate(keyId as any)
    await refreshApiKeys()
    messagesStore.messages.push({
      text: intl.formatMessage({
        description: 'Settings page: api key deleted message',
        defaultMessage: 'API key deleted successfully',
        id: 'settings-key-deleted',
      }),
    })
  } catch (error) {
    messagesStore.messages.push({
      text: intl.formatMessage({
        description: 'Settings page: api key delete error',
        defaultMessage: 'Failed to delete API key',
        id: 'settings-key-delete-error',
      }),
    })
  }
}

async function logoutAllDevices() {
  try {
    await logoutAllMutate({} as any)
    messagesStore.messages.push({
      text: intl.formatMessage({
        description: 'Settings page: logout all success',
        defaultMessage: 'Logged out from all devices',
        id: 'settings-logout-success',
      }),
    })
    // Redirect to login after logout
    await router.push('/login')
  } catch (error) {
    messagesStore.messages.push({
      text: intl.formatMessage({
        description: 'Settings page: logout all error',
        defaultMessage: 'Failed to logout from all devices',
        id: 'settings-logout-error',
      }),
    })
  }
}

function formatDate(date?: Date | string): string {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString(intl.locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Refresh data on mount
onMounted(async () => {
  await Promise.all([refreshCurrentUser(), refreshApiKeys(), refreshReadingStats()])
})
</script>

<style scoped>
.settings-page {
  padding: 2rem 0;
}

.stat-card {
  padding: 1rem;
  border: 1px solid var(--v-border-color);
  border-radius: 4px;
}
</style>
