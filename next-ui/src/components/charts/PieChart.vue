<template>
  <v-card
    class="chart-container"
    :loading="isLoading"
  >
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
        :viewBox="`0 0 ${size} ${size}`"
        class="pie-chart"
      >
        <!-- Pie slices -->
        <g :transform="`translate(${size / 2},${size / 2})`">
          <path
            v-for="(slice, i) in slices"
            :key="`slice-${i}`"
            :d="slice.path"
            :fill="colors[i % colors.length]"
            :stroke="isDark ? '#1E1E1E' : '#FFFFFF'"
            stroke-width="2"
            class="pie-slice"
            @mouseenter="hoveredSlice = i"
            @mouseleave="hoveredSlice = -1"
          />
        </g>
      </svg>

      <!-- Legend -->
      <div class="mt-6">
        <v-row
          v-for="(item, i) in items"
          :key="`legend-${i}`"
          class="legend-row"
          align="center"
          dense
        >
          <v-col cols="auto">
            <div
              class="legend-color"
              :style="{ backgroundColor: colors[i % colors.length] }"
            />
          </v-col>
          <v-col>
            <div class="font-weight-medium">{{ item.name }}</div>
            <div class="text-caption text-grey">{{ item.value }} items</div>
          </v-col>
          <v-col
            cols="auto"
            class="text-right"
          >
            <div class="font-weight-medium">{{ getPercentage(item.value) }}%</div>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'

interface PieItem {
  name: string
  value: number
}

interface PieSlice {
  path: string
}

const props = withDefaults(
  defineProps<{
    items: PieItem[]
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
const hoveredSlice = ref(-1)
const size = 300

const isDark = computed(() => theme.global.current.value.dark)

const totalValue = computed(() => props.items.reduce((sum, item) => sum + item.value, 0))

const slices = computed(() => {
  const sliceData: PieSlice[] = []
  let currentAngle = -Math.PI / 2

  for (const item of props.items) {
    const sliceAngle = (item.value / totalValue.value) * 2 * Math.PI
    const endAngle = currentAngle + sliceAngle

    const startX = Math.cos(currentAngle) * 100
    const startY = Math.sin(currentAngle) * 100
    const endX = Math.cos(endAngle) * 100
    const endY = Math.sin(endAngle) * 100

    const largeArc = sliceAngle > Math.PI ? 1 : 0

    const path = [
      `M 0 0`,
      `L ${startX} ${startY}`,
      `A 100 100 0 ${largeArc} 1 ${endX} ${endY}`,
      'Z',
    ].join(' ')

    sliceData.push({ path })
    currentAngle = endAngle
  }

  return sliceData
})

function getPercentage(value: number): number {
  return totalValue.value > 0 ? Math.round((value / totalValue.value) * 100) : 0
}
</script>

<style scoped>
.chart-container {
  height: 100%;
}

.pie-chart {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  display: block;
}

.pie-slice {
  cursor: pointer;
  transition: opacity 0.2s;
}

.pie-slice:hover {
  opacity: 0.8;
}

.legend-row {
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}
</style>
