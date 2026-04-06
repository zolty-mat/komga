<template>
  <v-card class="review-form">
    <v-card-title>
      {{
        $formatMessage({
          description: 'Review form: title',
          defaultMessage: 'Write a Review',
          id: 'eCLRXYE',
        })
      }}
    </v-card-title>

    <v-card-text class="pt-4">
      <v-form @submit.prevent="handleSubmit">
        <div class="form-section">
          <label class="form-label">
            {{
              $formatMessage({
                description: 'Review form: rating label',
                defaultMessage: 'Rating',
                id: 'eCLRXYF',
              })
            }}
          </label>
          <RatingStars
            v-model="form.rating"
            interactive
          />
        </div>

        <v-text-field
          v-model="form.title"
          :label="
            $formatMessage({
              description: 'Review form: title label',
              defaultMessage: 'Review Title',
              id: 'eCLRXYG',
            })
          "
          placeholder="Give your review a title..."
          class="mb-4"
          :rules="[required]"
          required
        />

        <v-textarea
          v-model="form.text"
          :label="
            $formatMessage({
              description: 'Review form: review text label',
              defaultMessage: 'Your Review',
              id: 'eCLRXYH',
            })
          "
          placeholder="Share your thoughts about this book..."
          rows="6"
          counter
          maxlength="5000"
          class="mb-4"
          :rules="[required, minLength]"
          required
          hint="Minimum 20 characters, maximum 5000 characters"
        />

        <v-checkbox
          v-model="form.isPublic"
          :label="
            $formatMessage({
              description: 'Review form: public checkbox',
              defaultMessage: 'Make this review public',
              id: 'eCLRXYI',
            })
          "
          class="mb-4"
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        variant="text"
        @click="$emit('cancel')"
      >
        {{
          $formatMessage({
            description: 'Review form: cancel button',
            defaultMessage: 'Cancel',
            id: 'eCLRXYJ',
          })
        }}
      </v-btn>
      <v-btn
        color="primary"
        :loading="isSubmitting"
        @click="handleSubmit"
      >
        {{
          $formatMessage({
            description: 'Review form: submit button',
            defaultMessage: isEditing ? 'Update Review' : 'Post Review',
            id: 'eCLRXYK',
          })
        }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import RatingStars from './RatingStars.vue'

interface ReviewFormData {
  title: string
  text: string
  rating: number
  isPublic: boolean
}

interface Props {
  isEditing?: boolean
  initialData?: Partial<ReviewFormData>
}

interface Emits {
  (e: 'submit', data: ReviewFormData): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  initialData: undefined,
})

const emit = defineEmits<Emits>()

const isSubmitting = ref(false)

const form = reactive<ReviewFormData>({
  title: props.initialData?.title ?? '',
  text: props.initialData?.text ?? '',
  rating: props.initialData?.rating ?? 0,
  isPublic: props.initialData?.isPublic ?? true,
})

const required = (v: string) => {
  return v ? true : 'This field is required'
}

const minLength = (v: string) => {
  return v?.length >= 20 ? true : 'Minimum 20 characters required'
}

const handleSubmit = async () => {
  if (!form.title || !form.text || form.text.length < 20) {
    return
  }

  isSubmitting.value = true
  try {
    emit('submit', { ...form })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.review-form {
  margin-bottom: 24px;
}

.form-section {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 12px;
  font-weight: 500;
  font-size: 14px;
}
</style>
