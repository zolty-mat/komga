<template>
  <v-card
    class="h-100 d-flex flex-column cursor-pointer hover-shadow"
    @click="$emit('click')"
  >
    <v-card-title class="text-body2">{{ author.name }}</v-card-title>

    <v-card-text class="flex-grow-1 pb-0">
      <div
        v-if="author.description"
        class="text-caption text-medium-emphasis line-clamp-3"
      >
        {{ author.description }}
      </div>
    </v-card-text>

    <v-card-actions class="pt-2">
      <v-spacer />
      <v-icon
        size="small"
        icon="i-mdi:chevron-right"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import type { components } from '@/generated/openapi/komga'

interface Props {
  author: components['schemas']['Author']
}

withDefaults(defineProps<Props>(), {})

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hover-shadow:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
