<template>
  <v-card
    :color="color"
    class="text-white h-100"
  >
    <v-card-text class="d-flex flex-column justify-space-between pa-4" style="min-height: 120px">
      <div class="d-flex justify-space-between align-start">
        <v-card-title class="text-subtitle-2 font-weight-regular flex-grow-1">
          {{ label }}
        </v-card-title>
        <v-icon
          :icon="icon"
          size="large"
          opacity="0.7"
        />
      </div>
      <div>
        <div class="text-h3 font-weight-bold">
          {{ value }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon: string
  color: string
}>()
</script>
