<template>
  <v-card :loading="isLoading">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <div class="gauge-container">
        <svg
          viewBox="0 0 200 120"
          class="gauge-chart"
        >
          <!-- Background arc -->
          <path
            :d="backgroundArcPath"
            :fill="isDark ? '#333' : '#EEE'"
            opacity="0.3"
          />

          <!-- Progress arc -->
          <path
            :d="progressArcPath"
            fill="none"
            :stroke="gaugeColor"
            stroke-width="12"
            stroke-linecap="round"
          />

          <!-- Center circle -->
          <circle
            cx="100"
            cy="100"
            r="60"
            :fill="isDark ? '#1E1E1E' : '#FFFFFF'"
          />

          <!-- Percentage text -->
          <text
            x="100"
            y="95"
            text-anchor="middle"
            class="percentage-text"
          >
            {{ percentage }}%
          </text>
          <text
            x="100"
            y="115"
            text-anchor="middle"
            class="label-text"
          >
            {{ label }}
          </text>
        </svg>

        <!-- Stats below gauge -->
        <div class="stats-container">
          <div class="stat">
            <div class="stat-value">{{ value }}</div>
            <div class="stat-label">{{ valueLabel }}</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ total }}</div>
            <div class="stat-label">{{ totalLabel }}</div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const props = withDefaults(
  defineProps<{
    value: number
    total: number
    title: string
    label?: string
    valueLabel?: string
    totalLabel?: string
    isLoading?: boolean
    gaugeColor?: string
  }>(),
  {
    label: 'Completion',
    valueLabel: 'Read',
    totalLabel: 'Total',
    isLoading: false,
    gaugeColor: '#4CAF50',
  },
)

const theme = useTheme()

const isDark = computed(() => theme.global.current.value.dark)

const percentage = computed(() => {
  return props.total > 0 ? Math.round((props.value / props.total) * 100) : 0
})

// SVG arc paths
const backgroundArcPath = computed(() => {
  const startAngle = -Math.PI / 2
  const endAngle = Math.PI / 2
  const radius = 45

  const startX = 100 + radius * Math.cos(startAngle)
  const startY = 100 + radius * Math.sin(startAngle)
  const endX = 100 + radius * Math.cos(endAngle)
  const endY = 100 + radius * Math.sin(endAngle)

  return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`
})

const progressArcPath = computed(() => {
  const startAngle = -Math.PI / 2
  const endAngle = -Math.PI / 2 + (percentage.value / 100) * Math.PI
  const radius = 45

  const startX = 100 + radius * Math.cos(startAngle)
  const startY = 100 + radius * Math.sin(startAngle)
  const endX = 100 + radius * Math.cos(endAngle)
  const endY = 100 + radius * Math.sin(endAngle)

  const largeArc = percentage.value > 50 ? 1 : 0

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`
})
</script>

<style scoped>
.gauge-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.gauge-chart {
  width: 100%;
  max-width: 200px;
  height: auto;
}

.percentage-text {
  font-size: 32px;
  font-weight: 600;
  fill: currentColor;
}

.label-text {
  font-size: 12px;
  fill: currentColor;
  opacity: 0.7;
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: inherit;
}

.stat-label {
  font-size: 12px;
  color: currentColor;
  opacity: 0.6;
  margin-top: 4px;
}
</style>
