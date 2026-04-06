<template>
  <div>
    <v-responsive aspect-ratio="2">
      <svg
        v-if="monthlyStats.length > 0"
        class="w-100"
        :viewBox="`0 0 ${width} ${height}`"
      >
        <!-- Grid lines -->
        <g class="grid">
          <line
            v-for="i in 5"
            :key="`grid-h-${i}`"
            :x1="0"
            :y1="((height - padding) / 5) * i + padding"
            :x2="width"
            :y2="((height - padding) / 5) * i + padding"
            stroke="currentColor"
            stroke-width="0.5"
            opacity="0.1"
          />
        </g>

        <!-- Bars -->
        <g class="bars">
          <rect
            v-for="(item, index) in monthlyStats"
            :key="`bar-${index}`"
            :x="padding + (index * (barWidth + barGap))"
            :y="height - padding - item.count * yScale"
            :width="barWidth"
            :height="item.count * yScale"
            fill="currentColor"
            opacity="0.7"
            class="hover:opacity-100 transition-opacity"
            @mouseenter="hoveredBar = index"
            @mouseleave="hoveredBar = null"
          >
            <title>{{ item.month }}: {{ item.count }} books</title>
          </rect>
        </g>

        <!-- X-axis labels -->
        <g
          v-if="monthlyStats.length <= 12"
          class="x-labels"
          font-size="12"
          text-anchor="middle"
        >
          <text
            v-for="(item, index) in monthlyStats"
            :key="`label-x-${index}`"
            :x="padding + (index * (barWidth + barGap)) + barWidth / 2"
            :y="height - padding + 20"
            fill="currentColor"
          >
            {{ item.month.substring(5) }}
          </text>
        </g>

        <!-- Y-axis labels -->
        <g
          class="y-labels"
          font-size="12"
          text-anchor="end"
        >
          <text
            v-for="i in 5"
            :key="`label-y-${i}`"
            :x="padding - 10"
            :y="((height - padding) / 5) * (5 - i) + padding + 4"
            fill="currentColor"
          >
            {{ Math.round((maxCount / 5) * i) }}
          </text>
        </g>

        <!-- Y-axis -->
        <line
          :x1="padding"
          :y1="padding"
          :x2="padding"
          :y2="height - padding"
          stroke="currentColor"
          stroke-width="1"
        />
      </svg>
      <div v-else class="d-flex justify-center align-center h-100">
        {{
          $formatMessage({
            description: 'No reading stats available',
            defaultMessage: 'No reading data available',
            id: 'rh-chart-empty',
          })
        }}
      </div>
    </v-responsive>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  monthlyStats: Array<{ month: string; count: number }>
  yearlyStats: Array<{ year: number; count: number }>
}>()

const width = ref(800)
const height = ref(300)
const padding = 40
const hoveredBar = ref<number | null>(null)

const maxCount = computed(() => Math.max(...props.monthlyStats.map((s) => s.count), 1))
const yScale = computed(() => (height.value - padding * 2) / maxCount.value)
const barWidth = computed(() => Math.max(20, (width.value - padding * 2) / props.monthlyStats.length - 5))
const barGap = computed(() => 5)

// Responsive width
const resizeObserver = ref<ResizeObserver | null>(null)

onMounted(() => {
  // Optional: Add responsive behavior if needed
})

onUnmounted(() => {
  resizeObserver.value?.disconnect()
})
</script>

<style scoped>
svg {
  color: rgb(var(--v-theme-on-surface));
}
</style>
