<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>
        {{
          $formatMessage({
            description: 'Share dialog: title',
            defaultMessage: 'Share Book',
            id: 'eCLRXYM',
          })
        }}
      </v-card-title>

      <v-card-text class="pt-4">
        <v-tabs v-model="activeTab">
          <v-tab value="direct">
            {{
              $formatMessage({
                description: 'Share dialog: direct tab',
                defaultMessage: 'Direct Share',
                id: 'eCLRXYN',
              })
            }}
          </v-tab>
          <v-tab value="public">
            {{
              $formatMessage({
                description: 'Share dialog: public tab',
                defaultMessage: 'Public Link',
                id: 'eCLRXYO',
              })
            }}
          </v-tab>
          <v-tab value="social">
            {{
              $formatMessage({
                description: 'Share dialog: social tab',
                defaultMessage: 'Social Media',
                id: 'eCLRXYP',
              })
            }}
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab" class="mt-4">
          <!-- Direct Share Tab -->
          <v-window-item value="direct">
            <v-autocomplete
              v-model="selectedUsers"
              :items="availableUsers"
              item-title="name"
              item-value="id"
              label="Select users to share with"
              multiple
              chips
              closable-chips
              class="mb-4"
            />
            <v-textarea
              v-model="shareMessage"
              label="Add a message (optional)"
              rows="3"
              placeholder="Share your thoughts..."
              class="mb-4"
            />
          </v-window-item>

          <!-- Public Link Tab -->
          <v-window-item value="public">
            <div class="public-share">
              <v-text-field
                :model-value="publicLink"
                label="Public Link"
                readonly
                class="mb-4"
              >
                <template #append>
                  <v-btn
                    icon="mdi-content-copy"
                    size="small"
                    variant="text"
                    @click="copyToClipboard(publicLink)"
                  />
                </template>
              </v-text-field>
              <p class="share-info">
                {{
                  $formatMessage({
                    description: 'Share dialog: public link info',
                    defaultMessage:
                      'Anyone with this link can view the book, but cannot edit or delete it.',
                    id: 'eCLRXYQ',
                  })
                }}
              </p>
            </div>
          </v-window-item>

          <!-- Social Media Tab -->
          <v-window-item value="social">
            <div class="social-share">
              <v-btn
                prepend-icon="mdi-twitter"
                block
                variant="outlined"
                class="mb-2"
                @click="shareToTwitter"
              >
                {{
                  $formatMessage({
                    description: 'Share dialog: twitter button',
                    defaultMessage: 'Share on Twitter',
                    id: 'eCLRXYR',
                  })
                }}
              </v-btn>
              <v-btn
                prepend-icon="mdi-reddit"
                block
                variant="outlined"
                class="mb-2"
                @click="shareToReddit"
              >
                {{
                  $formatMessage({
                    description: 'Share dialog: reddit button',
                    defaultMessage: 'Share on Reddit',
                    id: 'eCLRXYS',
                  })
                }}
              </v-btn>
              <v-btn
                prepend-icon="mdi-facebook"
                block
                variant="outlined"
                @click="shareToFacebook"
              >
                {{
                  $formatMessage({
                    description: 'Share dialog: facebook button',
                    defaultMessage: 'Share on Facebook',
                    id: 'eCLRXYT',
                  })
                }}
              </v-btn>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          {{
            $formatMessage({
              description: 'Share dialog: cancel button',
              defaultMessage: 'Cancel',
              id: 'eCLRXYU',
            })
          }}
        </v-btn>
        <v-btn
          v-if="activeTab === 'direct'"
          color="primary"
          :disabled="selectedUsers.length === 0"
          @click="handleShare"
        >
          {{
            $formatMessage({
              description: 'Share dialog: share button',
              defaultMessage: 'Share',
              id: 'eCLRXYV',
            })
          }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: string
  name: string
  avatar?: string
}

interface Props {
  modelValue: boolean
  bookTitle: string
  bookUrl: string
  availableUsers?: User[]
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'share', data: { userIds: string[]; message?: string }): void
}

const props = withDefaults(defineProps<Props>(), {
  availableUsers: () => [],
})

const emit = defineEmits<Emits>()

const activeTab = ref('direct')
const selectedUsers = ref<string[]>([])
const shareMessage = ref('')

const publicLink = `${window.location.origin}/books/${props.bookUrl}`

const handleShare = () => {
  emit('share', {
    userIds: selectedUsers.value,
    message: shareMessage.value || undefined,
  })
  selectedUsers.value = []
  shareMessage.value = ''
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

const shareToTwitter = () => {
  const text = `Check out ${props.bookTitle} on Komga!`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(publicLink)}`
  window.open(url, '_blank')
}

const shareToReddit = () => {
  const url = `https://reddit.com/submit?url=${encodeURIComponent(publicLink)}&title=${encodeURIComponent(props.bookTitle)}`
  window.open(url, '_blank')
}

const shareToFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicLink)}`
  window.open(url, '_blank')
}
</script>

<style scoped>
.public-share {
  padding-top: 16px;
}

.social-share {
  padding-top: 16px;
}

.share-info {
  margin: 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
  line-height: 1.5;
}
</style>
