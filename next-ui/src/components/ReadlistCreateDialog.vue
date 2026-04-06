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
            description: 'Create readlist dialog: title',
            defaultMessage: 'Create Reading List',
            id: 'y896rb',
          })
        }}
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form @submit.prevent="handleCreate">
          <v-text-field
            v-model="form.name"
            :label="
              $formatMessage({
                description: 'Create readlist: name label',
                defaultMessage: 'Name',
                id: 'gt1E/D',
              })
            "
            required
            :rules="[required]"
            class="mb-4"
          />

          <v-textarea
            v-model="form.summary"
            :label="
              $formatMessage({
                description: 'Create readlist: description label',
                defaultMessage: 'Description',
                id: 'fNnEk0',
              })
            "
            rows="3"
            class="mb-4"
          />

          <v-switch
            v-model="form.ordered"
            :label="
              $formatMessage({
                description: 'Create readlist: ordered toggle',
                defaultMessage: 'Ordered reading list',
                id: 'c49XyD',
              })
            "
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          {{
            $formatMessage({
              description: 'Create readlist: cancel button',
              defaultMessage: 'Cancel',
              id: 'eShn+p',
            })
          }}
        </v-btn>
        <v-btn
          color="primary"
          :loading="isCreating"
          @click="handleCreate"
        >
          {{
            $formatMessage({
              description: 'Create readlist: create button',
              defaultMessage: 'Create',
              id: 'eJp4LW',
            })
          }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useCreateReadList } from '@/colada/readlists'
import { useRouter, useRoute } from 'vue-router'

interface Props {
  modelValue: boolean
  libraryId: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()

const form = reactive({
  name: '',
  summary: '',
  ordered: true,
})

const isCreating = ref(false)

const required = (v: string) => !!v || 'This field is required'

const { mutate: createReadlist } = useCreateReadList()

const handleCreate = async () => {
  if (!form.name.trim()) return

  isCreating.value = true
  try {
    const result = await createReadlist({
      name: form.name,
      summary: form.summary,
      ordered: form.ordered,
      bookIds: [],
    })

    if (result?.data?.id) {
      emit('update:modelValue', false)
      // Navigate to the new readlist detail page
      router.push(
        `/libraries/${props.libraryId}/readlists/${result.data.id}`,
      )
    }
  } catch (error) {
    console.error('Failed to create readlist:', error)
  } finally {
    isCreating.value = false
  }
}
</script>
