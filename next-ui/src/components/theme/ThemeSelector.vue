<template>
  <div class="theme-selector">
    <v-card variant="outlined">
      <v-card-title>
        {{
          $formatMessage({
            description: 'Theme selector: title',
            defaultMessage: 'Theme Mode',
            id: 'theme-selector-title',
          })
        }}
      </v-card-title>

      <v-card-text>
        <v-radio-group v-model="selectedMode" @update:model-value="handleModeChange" inline>
          <v-radio
            value="light"
            :label="
              $formatMessage({
                description: 'Theme selector: light mode',
                defaultMessage: 'Light',
                id: 'theme-selector-light',
              })
            "
          />
          <v-radio
            value="dark"
            :label="
              $formatMessage({
                description: 'Theme selector: dark mode',
                defaultMessage: 'Dark',
                id: 'theme-selector-dark',
              })
            "
          />
          <v-radio
            value="auto"
            :label="
              $formatMessage({
                description: 'Theme selector: auto mode',
                defaultMessage: 'Auto (System)',
                id: 'theme-selector-auto',
              })
            "
          />
        </v-radio-group>

        <v-divider class="my-4" />

        <div class="mb-4">
          <span class="text-subtitle-2">
            {{
              $formatMessage({
                description: 'Theme selector: preset themes',
                defaultMessage: 'Preset Themes',
                id: 'theme-selector-presets',
              })
            }}
          </span>
        </div>

        <v-row>
          <v-col v-for="theme in presetThemesByMode" :key="theme.id" cols="12" sm="6" md="4">
            <v-card
              :variant="activeThemeId === theme.id ? 'elevated' : 'outlined'"
              @click="handleThemeSelect(theme.id)"
              class="theme-card cursor-pointer"
              :class="{ 'theme-card--active': activeThemeId === theme.id }"
            >
              <div class="theme-preview d-flex gap-1 pa-3">
                <div
                  v-for="(color, key) in [
                    theme.colors.primary,
                    theme.colors.secondary,
                    theme.colors.accent,
                  ]"
                  :key="key"
                  class="theme-swatch"
                  :style="{ backgroundColor: color }"
                />
              </div>

              <v-card-title class="text-caption">{{ theme.name }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <div v-if="customThemes.length > 0" class="mb-4">
          <span class="text-subtitle-2">
            {{
              $formatMessage({
                description: 'Theme selector: custom themes',
                defaultMessage: 'Custom Themes',
                id: 'theme-selector-custom',
              })
            }}
          </span>
        </div>

        <v-row v-if="customThemes.length > 0">
          <v-col v-for="theme in customThemesByMode" :key="theme.id" cols="12" sm="6" md="4">
            <v-card
              :variant="activeThemeId === theme.id ? 'elevated' : 'outlined'"
              @click="handleThemeSelect(theme.id)"
              class="theme-card cursor-pointer"
              :class="{ 'theme-card--active': activeThemeId === theme.id }"
            >
              <div class="theme-preview d-flex gap-1 pa-3">
                <div
                  v-for="(color, key) in [
                    theme.colors.primary,
                    theme.colors.secondary,
                    theme.colors.accent,
                  ]"
                  :key="key"
                  class="theme-swatch"
                  :style="{ backgroundColor: color }"
                />
              </div>

              <v-card-title class="text-caption">{{ theme.name }}</v-card-title>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  @click.stop="handleDeleteTheme(theme.id)"
                />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-empty-state
          v-if="customThemes.length === 0"
          headline="No custom themes"
          title=""
          class="my-4"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAppStore } from '@/stores/app'

const themeStore = useThemeStore()
const appStore = useAppStore()

const selectedMode = computed({
  get: () => {
    const active = themeStore.activeTheme
    return active.mode
  },
  set: (value: string) => {
    // Will be handled in handleModeChange
  },
})

const activeThemeId = computed(() => themeStore.activeThemeId)
const customThemes = computed(() => themeStore.customThemes)

const presetThemesByMode = computed(() => {
  const active = themeStore.activeTheme
  return themeStore.presetThemes.filter((t) => t.mode === active.mode)
})

const customThemesByMode = computed(() => {
  const active = themeStore.activeTheme
  return themeStore.customThemes.filter((t) => t.mode === active.mode)
})

function handleModeChange(mode: string) {
  if (mode === 'auto') {
    themeStore.setUseSystemPreference(true)
  } else {
    themeStore.setUseSystemPreference(false)
    const themes = themeStore.themesByMode(mode as 'light' | 'dark')
    if (themes.length > 0) {
      themeStore.setActiveTheme(themes[0].id)
    }
  }
}

function handleThemeSelect(themeId: string) {
  themeStore.setActiveTheme(themeId)
  appStore.theme = themeId
}

function handleDeleteTheme(themeId: string) {
  themeStore.deleteTheme(themeId)
}
</script>

<style scoped lang="scss">
.theme-selector {
  .theme-card {
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }

    &--active {
      border-color: rgb(var(--v-theme-primary));
      border-width: 2px;
    }
  }

  .theme-preview {
    height: 60px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.05);
  }

  .theme-swatch {
    flex: 1;
    border-radius: 2px;
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>
