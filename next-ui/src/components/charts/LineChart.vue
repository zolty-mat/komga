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
        class="line-chart"
      >
        <!-- Grid lines -->
        <g class="grid">
          <line
            v-for="(_, i) in yAxisLabels"
            :key="`gridline-${i}`"
            x1="40"
            :x2="chartWidth - 20"
            :y1="300 - (i * 70)"
            :y2="300 - (i * 70)"
            :stroke="isDark ? '#333' : '#EEE'"
            stroke-width="1"
          />
        </g>

        <!-- Axes -->
        <g class="axes">
          <line
            x1="40"
            y1="20"
            x2="40"
            y2="300"
            :stroke="isDark ? '#666' : '#999'"
            stroke-width="2"
          />
          <line
            x1="40"
            y1="300"
            :x2="chartWidth - 20"
            y2="300"
            :stroke="isDark ? '#666' : '#999'"
            stroke-width="2"
          />
        </g>

        <!-- Y-axis labels -->
        <g class="y-axis">
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

        <!-- X-axis labels -->
        <g class="x-axis">
          <text
            v-for="(item, i) in items"
            :key="`x-${i}`"
            :x="40 + ((i + 0.5) * itemWidth)"
            y="320"
            text-anchor="middle"
            class="axis-label"
          >
            {{ truncateLabel(item.label, 8) }}
          </text>
        </g>

        <!-- Line path -->
        <polyline
          :points="linePoints"
          fill="none"
          :stroke="lineColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Data points -->
        <g class="data-points">
          <circle
            v-for="(point, i) in scaledPoints"
            :key="`point-${i}`"
            :cx="point.x"
            :cy="point.y"
            r="4"
            :fill="lineColor"
            class="data-point"
            @mouseenter="hoveredPoint = i"
            @mouseleave="hoveredPoint = -1"
          />
        </g>

        <!-- Tooltip -->
        <g
          v-if="hoveredPoint >= 0"
          class="tooltip"
        >
          <rect
            :x="scaledPoints[hoveredPoint].x - 60"
            :y="scaledPoints[hoveredPoint].y - 50"
            width="120"
            height="40"
            rx="4"
            :fill="isDark ? '#424242' : '#FFFFFF'"
            stroke="#999"
            stroke-width="1"
          />
          <text
            :x="scaledPoints[hoveredPoint].x"
            :y="scaledPoints[hoveredPoint].y - 25"
            text-anchor="middle"
            class="tooltip-text"
          >
            {{ items[hoveredPoint].value }}
          </text>
        </g>
      </svg>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'

interface LineItem {
  label: string
  value: number
}

interface ScaledPoint {
  x: number
  y: number
}

const props = withDefaults(
  defineProps<{
    items: LineItem[]
    title: string
    isLoading?: boolean
    emptyMessage?: string
    lineColor?: string
  }>(),
  {
    isLoading: false,
    emptyMessage: 'No data available',
    lineColor: '#1F77B4',
  },
)

const theme = useTheme()
const hoveredPoint = ref(-1)

const isDark = computed(() => theme.global.current.value.dark)

const chartWidth = computed(() => Math.max(400, props.items.length * 50 + 100))
const chartHeight = 400

const itemWidth = computed(() => (chartWidth.value - 60) / props.items.length)

const maxValue = computed(() => Math.max(...props.items.map(item => item.value), 1))

const scaledPoints = computed((): ScaledPoint[] => {
  const scale = 280 / maxValue.value
  return props.items.map((item, i) => ({
    x: 40 + (i + 0.5) * itemWidth.value,
    y: 300 - item.value * scale,
  }))
})

const linePoints = computed(() => scaledPoints.value.map(p => `${p.x},${p.y}`).join(' '))

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
.line-chart {
  width: 100%;
  display: block;
  overflow-x: auto;
}

.axis-label {
  font-size: 12px;
  fill: currentColor;
  opacity: 0.7;
}

.data-point {
  cursor: pointer;
  transition: r 0.2s;
}

.data-point:hover {
  r: 6;
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
