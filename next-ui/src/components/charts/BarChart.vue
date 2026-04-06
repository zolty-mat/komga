<template>
  <v-card :loading="isLoading">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <div
        v-if="!isLoading && items.length === 0"
        class="text-center pa-6"
      >
        <v-icon
          icon="mdi-information"
          size="large"
          class="mb-2"
        />
        <p>{{ emptyMessage }}</p>
      </div>

      <svg
        v-else-if="!isLoading"
        :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
        class="bar-chart"
      >
        <!-- Y-axis labels and grid -->
        <g class="y-axis">
          <line
            x1="40"
            y1="20"
            x2="40"
            y2="300"
            :stroke="isDark ? '#444' : '#DDD'"
            stroke-width="1"
          />
          <text
            v-for="(label, i) in yAxisLabels"
            :key="`y-${i}`"
            x="35"
            :y="300 - (i * 70)"
            text-anchor="end"
            dy="0.3em"
            class="axis-label"
          >
            {{ label }}
          </text>
        </g>

        <!-- Bars -->
        <g class="bars">
          <g
            v-for="(item, i) in scaledItems"
            :key="`bar-${i}`"
            :transform="`translate(${60 + i * barWidth}, 0)`"
          >
            <rect
              :x="0"
              :y="300 - item.scaledValue"
              :width="barWidth - 10"
              :height="item.scaledValue"
              :fill="colors[i % colors.length]"
              class="bar"
            />
            <text
              x="35"
              y="320"
              text-anchor="middle"
              class="bar-label"
            >
              {{ truncateLabel(item.name, 10) }}
            </text>
          </g>
        </g>

        <!-- Tooltip -->
        <g
          v-if="hoveredBar >= 0"
          class="tooltip"
        >
          <rect
            :x="60 + hoveredBar * barWidth + 10"
            :y="300 - scaledItems[hoveredBar].scaledValue - 50"
            width="120"
            height="40"
            rx="4"
            :fill="isDark ? '#424242' : '#FFFFFF'"
            stroke="#999"
            stroke-width="1"
          />
          <text
            :x="60 + hoveredBar * barWidth + 70"
            :y="300 - scaledItems[hoveredBar].scaledValue - 25"
            text-anchor="middle"
            class="tooltip-text"
          >
            {{ scaledItems[hoveredBar].value }}
          </text>
        </g>
      </svg>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'

interface BarItem {
  name: string
  value: number
}

interface ScaledItem {
  name: string
  value: number
  scaledValue: number
}

const props = withDefaults(
  defineProps<{
    items: BarItem[]
    title: string
    isLoading?: boolean
    emptyMessage?: string
    colors?: string[]
  }>(),
  {
    isLoading: false,
    emptyMessage: 'No data available',
    colors: () => [
      '#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD',
      '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF',
    ],
  },
)

const theme = useTheme()
const hoveredBar = ref(-1)

const isDark = computed(() => theme.global.current.value.dark)

const chartWidth = computed(() => Math.max(400, props.items.length * 60 + 100))
const chartHeight = 400
const barWidth = computed(() => (chartWidth.value - 100) / props.items.length)

const maxValue = computed(() => Math.max(...props.items.map(item => item.value), 1))

const scaledItems = computed((): ScaledItem[] => {
  const scale = 280 / maxValue.value
  return props.items.map(item => ({
    name: item.name,
    value: item.value,
    scaledValue: item.value * scale,
  }))
})

const yAxisLabels = computed(() => {
  const labels = []
  const step = Math.ceil(maxValue.value / 5)
  for (let i = 0; i <= 5; i++) {
    labels.push(i * step)
  }
  return labels
})

function truncateLabel(label: string, length: number): string {
  return label.length > length ? label.substring(0, length) + '...' : label
}
</script>

<style scoped>
.bar-chart {
  width: 100%;
  display: block;
  overflow-x: auto;
}

.axis-label {
  font-size: 12px;
  fill: currentColor;
  opacity: 0.7;
}

.bar {
  cursor: pointer;
  transition: opacity 0.2s;
}

.bar:hover {
  opacity: 0.8;
}

.bar-label {
  font-size: 11px;
  fill: currentColor;
  opacity: 0.7;
}

.tooltip {
  pointer-events: none;
}

.tooltip-text {
  font-size: 12px;
  font-weight: bold;
  fill: currentColor;
}
</style>
