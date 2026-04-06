<template>
  <div class="theme-customizer">
    <v-card variant="outlined">
      <v-card-title>
        {{
          $formatMessage({
            description: 'Theme customizer: title',
            defaultMessage: 'Create Custom Theme',
            id: 'theme-customizer-title',
          })
        }}
      </v-card-title>

      <v-card-text>
        <!-- Theme Name -->
        <v-text-field
          v-model="form.name"
          label="Theme Name"
          placeholder="My Custom Theme"
          outlined
          dense
          class="mb-4"
        />

        <!-- Theme Mode -->
        <v-radio-group v-model="form.mode" label="Mode" inline class="mb-4">
          <v-radio value="light" label="Light" />
          <v-radio value="dark" label="Dark" />
        </v-radio-group>

        <!-- Color Pickers Section -->
        <div class="mb-6">
          <h3 class="text-subtitle-1 mb-4">Colors</h3>

          <v-row>
            <v-col cols="12" sm="6" md="4">
              <div class="color-picker-group">
                <label class="text-caption mb-2 d-block">Primary Color</label>
                <div class="d-flex align-center gap-2">
                  <input
                    v-model="form.colors.primary"
                    type="color"
                    class="color-input"
                  />
                  <v-text-field
                    v-model="form.colors.primary"
                    dense
                    outlined
                    placeholder="#005ed3"
                    class="flex-grow-1"
                  />
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <div class="color-picker-group">
                <label class="text-caption mb-2 d-block">Secondary Color</label>
                <div class="d-flex align-center gap-2">
                  <input
                    v-model="form.colors.secondary"
                    type="color"
                    class="color-input"
                  />
                  <v-text-field
                    v-model="form.colors.secondary"
                    dense
                    outlined
                    placeholder="#fec000"
                    class="flex-grow-1"
                  />
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <div class="color-picker-group">
                <label class="text-caption mb-2 d-block">Accent Color</label>
                <div class="d-flex align-center gap-2">
                  <input
                    v-model="form.colors.accent"
                    type="color"
                    class="color-input"
                  />
                  <v-text-field
                    v-model="form.colors.accent"
                    dense
                    outlined
                    placeholder="#ff0335"
                    class="flex-grow-1"
                  />
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <div class="color-picker-group">
                <label class="text-caption mb-2 d-block">Surface Color</label>
                <div class="d-flex align-center gap-2">
                  <input
                    v-model="form.colors.surface"
                    type="color"
                    class="color-input"
                  />
                  <v-text-field
                    v-model="form.colors.surface"
                    dense
                    outlined
                    :placeholder="form.mode === 'dark' ? '#121212' : '#ffffff'"
                    class="flex-grow-1"
                  />
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <div class="color-picker-group">
                <label class="text-caption mb-2 d-block">Error Color</label>
                <div class="d-flex align-center gap-2">
                  <input
                    v-model="form.colors.error"
                    type="color"
                    class="color-input"
                  />
                  <v-text-field
                    v-model="form.colors.error"
                    dense
                    outlined
                    placeholder="#b3261e"
                    class="flex-grow-1"
                  />
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <div class="color-picker-group">
                <label class="text-caption mb-2 d-block">Success Color</label>
                <div class="d-flex align-center gap-2">
                  <input
                    v-model="form.colors.success"
                    type="color"
                    class="color-input"
                  />
                  <v-text-field
                    v-model="form.colors.success"
                    dense
                    outlined
                    placeholder="#188038"
                    class="flex-grow-1"
                  />
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Typography Section -->
        <div class="mb-6">
          <h3 class="text-subtitle-1 mb-4">Typography</h3>

          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.typography.fontFamily"
                label="Font Family"
                :items="fontFamilies"
                outlined
                dense
              />
            </v-col>

            <v-col cols="12" sm="6">
              <div>
                <label class="text-caption">Font Size Scale: {{ form.typography.fontSizeScale.toFixed(1) }}x</label>
                <v-slider
                  v-model="form.typography.fontSizeScale"
                  :min="0.8"
                  :max="1.4"
                  :step="0.1"
                  class="mt-2"
                />
              </div>
            </v-col>

            <v-col cols="12">
              <div>
                <label class="text-caption">Line Height: {{ form.typography.lineHeight.toFixed(2) }}</label>
                <v-slider
                  v-model="form.typography.lineHeight"
                  :min="1.2"
                  :max="1.8"
                  :step="0.1"
                  class="mt-2"
                />
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Spacing Section -->
        <div class="mb-6">
          <h3 class="text-subtitle-1 mb-4">Spacing</h3>

          <v-radio-group v-model="form.spacing.scale" inline>
            <v-radio value="compact" label="Compact" />
            <v-radio value="normal" label="Normal" />
            <v-radio value="comfortable" label="Comfortable" />
          </v-radio-group>
        </div>

        <!-- Preview -->
        <v-divider class="my-4" />

        <div class="preview-section">
          <h3 class="text-subtitle-1 mb-4">Preview</h3>
          <div class="preview-grid">
            <div
              v-for="(color, key) in {
                primary: form.colors.primary,
                secondary: form.colors.secondary,
                accent: form.colors.accent,
                surface: form.colors.surface,
                error: form.colors.error,
                success: form.colors.success,
              }"
              :key="key"
              class="preview-item"
            >
              <div
                class="preview-swatch"
                :style="{ backgroundColor: color }"
              />
              <span class="text-caption">{{ key }}</span>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="outlined"
          @click="resetForm"
        >
          {{
            $formatMessage({
              description: 'Theme customizer: reset button',
              defaultMessage: 'Reset',
              id: 'theme-customizer-reset',
            })
          }}
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="saveTheme"
          :disabled="!isFormValid"
        >
          {{
            $formatMessage({
              description: 'Theme customizer: save button',
              defaultMessage: 'Save Theme',
              id: 'theme-customizer-save',
            })
          }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAppStore } from '@/stores/app'
import type { ThemeConfig } from '@/utils/theme'

const themeStore = useThemeStore()
const appStore = useAppStore()

const fontFamilies = ['system', 'serif', 'sans-serif']

const initialForm = () => ({
  name: '',
  mode: 'light' as const,
  colors: {
    primary: '#005ed3',
    secondary: '#fec000',
    accent: '#ff0335',
    surface: '#ffffff',
    error: '#b3261e',
    success: '#188038',
  },
  typography: {
    fontFamily: 'system' as const,
    fontSizeScale: 1,
    lineHeight: 1.5,
  },
  spacing: {
    scale: 'normal' as const,
  },
})

const form = reactive(initialForm())

const isFormValid = computed(() => {
  const hexRegex = /^#([a-f0-9]{6}|[a-f0-9]{3})$/i
  return (
    form.name.trim().length > 0 &&
    hexRegex.test(form.colors.primary) &&
    hexRegex.test(form.colors.secondary) &&
    hexRegex.test(form.colors.accent)
  )
})

function saveTheme() {
  if (!isFormValid.value) return

  try {
    const newTheme = themeStore.createTheme({
      name: form.name,
      mode: form.mode,
      colors: form.colors,
      typography: form.typography,
      spacing: form.spacing,
    })

    // Activate the new theme
    themeStore.setActiveTheme(newTheme.id)
    appStore.theme = newTheme.id

    // Reset form
    resetForm()

    // Emit success (parent can show toast)
    emit('theme-created', newTheme)
  } catch (error) {
    emit('error', error instanceof Error ? error.message : 'Failed to save theme')
  }
}

function resetForm() {
  Object.assign(form, initialForm())
}

const emit = defineEmits<{
  'theme-created': [theme: ThemeConfig]
  'error': [message: string]
}>()
</script>

<style scoped lang="scss">
.theme-customizer {
  .color-input {
    width: 50px;
    height: 40px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    cursor: pointer;
  }

  .color-picker-group {
    .color-input:hover {
      border-color: rgba(0, 0, 0, 0.2);
    }
  }

  .preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 12px;
  }

  .preview-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .preview-swatch {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
}
</style>
