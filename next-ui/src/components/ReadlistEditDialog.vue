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
            description: 'Edit readlist dialog: title',
            defaultMessage: 'Edit Reading List',
            id: 'efCvi8q',
          })
        }}
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form @submit.prevent="handleUpdate">
          <v-text-field
            v-model="form.name"
            :label="
              $formatMessage({
                description: 'Edit readlist: name label',
                defaultMessage: 'Name',
                id: 'ewxq0BU',
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
                description: 'Edit readlist: description label',
                defaultMessage: 'Description',
                id: 'eQgDqRJ',
              })
            "
            rows="3"
            class="mb-4"
          />

          <v-switch
            v-model="form.ordered"
            :label="
              $formatMessage({
                description: 'Edit readlist: ordered toggle',
                defaultMessage: 'Ordered reading list',
                id: 'eMk5HsX',
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
              description: 'Edit readlist: cancel button',
              defaultMessage: 'Cancel',
              id: 'e83QMNO',
            })
          }}
        </v-btn>
        <v-btn
          color="primary"
          :loading="isUpdating"
          @click="handleUpdate"
        >
          {{
            $formatMessage({
              description: 'Edit readlist: save button',
              defaultMessage: 'Save',
              id: 'e5oe2JH',
            })
          }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { useUpdateReadList } from '@/colada/readlists'
import type { components } from '@/generated/openapi/komga'

interface Props {
  modelValue: boolean
  readlist: components['schemas']['ReadList']
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = reactive({
  name: '',
  summary: '',
  ordered: true,
})

const isUpdating = ref(false)

const required = (v: string) => !!v || 'This field is required'

const { mutate: updateReadlist } = useUpdateReadList()

watch(
  () => props.readlist,
  (newReadlist) => {
    if (newReadlist) {
      form.name = newReadlist.name
      form.summary = newReadlist.summary || ''
      form.ordered = newReadlist.ordered || false
    }
  },
  { immediate: true },
)

const handleUpdate = async () => {
  if (!form.name.trim()) return

  isUpdating.value = true
  try {
    await updateReadlist({
      readlistId: props.readlist.id,
      patch: {
        name: form.name,
        summary: form.summary,
        ordered: form.ordered,
      },
    } as any)

    emit('update:modelValue', false)
    emit('updated')
  } catch (error) {
    console.error('Failed to update readlist:', error)
  } finally {
    isUpdating.value = false
  }
}
</script>
