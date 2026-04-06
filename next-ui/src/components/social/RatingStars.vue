<template>
  <div class="rating-stars">
    <div class="star-display">
      <div class="stars-container">
        <v-icon
          v-for="star in 5"
          :key="star"
          :icon="star <= hoverRating || (hoverRating === 0 && star <= modelValue) ? 'mdi-star' : 'mdi-star-outline'"
          size="large"
          :color="star <= hoverRating || (hoverRating === 0 && star <= modelValue) ? 'amber' : 'grey'"
          :class="{ 'cursor-pointer': interactive }"
          @click="interactive && updateRating(star)"
          @mouseover="interactive && (hoverRating = star)"
          @mouseleave="hoverRating = 0"
        />
      </div>
      <div class="rating-text">
        <span class="rating-value">{{ modelValue > 0 ? modelValue : '—' }}</span>
        <span class="rating-label">/5</span>
      </div>
    </div>
    <p
      v-if="label"
      class="label-text"
    >
      {{ label }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue: number
  interactive?: boolean
  label?: string
}

interface Emits {
  (e: 'update:modelValue', value: number): void
}

const props = withDefaults(defineProps<Props>(), {
  interactive: true,
  label: undefined,
})

const emit = defineEmits<Emits>()

const hoverRating = ref(0)

const updateRating = (star: number) => {
  emit('update:modelValue', star === props.modelValue ? 0 : star)
}
</script>

<style scoped>
.rating-stars {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.star-display {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stars-container {
  display: flex;
  gap: 4px;
}

.cursor-pointer {
  cursor: pointer;
  transition: transform 0.2s;
}

.cursor-pointer:hover {
  transform: scale(1.15);
}

.rating-text {
  display: flex;
  align-items: baseline;
  gap: 4px;
  min-width: 50px;
}

.rating-value {
  font-size: 18px;
  font-weight: bold;
}

.rating-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
}

.label-text {
  margin: 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}
</style>
