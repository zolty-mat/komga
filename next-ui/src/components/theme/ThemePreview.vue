<template>
  <div class="theme-preview">
    <v-card variant="outlined">
      <v-card-title>
        {{
          $formatMessage({
            description: 'Theme preview: title',
            defaultMessage: 'Theme Preview',
            id: 'theme-preview-title',
          })
        }}
      </v-card-title>

      <v-card-text>
        <div class="preview-container">
          <!-- Color Swatches -->
          <div class="mb-6">
            <h3 class="text-subtitle-2 mb-3">Colors</h3>
            <v-row>
              <v-col v-for="(color, name) in colorSwatches" :key="name" cols="12" sm="6" md="4">
                <div class="color-block">
                  <div
                    class="swatch"
                    :style="{ backgroundColor: color }"
                  />
                  <div class="details">
                    <span class="name text-caption font-weight-medium">{{ name }}</span>
                    <span class="value text-caption">{{ color }}</span>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-6" />

          <!-- Typography Preview -->
          <div class="mb-6">
            <h3 class="text-subtitle-2 mb-3">Typography</h3>
            <div class="typography-samples">
              <div class="sample">
                <h1 class="text-h1">Heading 1</h1>
                <span class="sample-label">H1 Heading</span>
              </div>
              <div class="sample">
                <h2 class="text-h2">Heading 2</h2>
                <span class="sample-label">H2 Heading</span>
              </div>
              <div class="sample">
                <p class="text-body1">
                  This is body text. Font family: {{ activeTheme.typography?.fontFamily || 'system' }}.
                  Font size scale: {{ activeTheme.typography?.fontSizeScale || 1 }}x
                </p>
                <span class="sample-label">Body 1</span>
              </div>
              <div class="sample">
                <p class="text-body2">
                  This is smaller body text. It should be readable but slightly smaller than body1.
                </p>
                <span class="sample-label">Body 2</span>
              </div>
              <div class="sample">
                <p class="text-caption">
                  This is caption text. It's the smallest readable size.
                </p>
                <span class="sample-label">Caption</span>
              </div>
            </div>
          </div>

          <v-divider class="my-6" />

          <!-- Component Preview -->
          <div class="mb-6">
            <h3 class="text-subtitle-2 mb-3">Components</h3>

            <v-row>
              <v-col cols="12" sm="6">
                <v-btn color="primary" variant="elevated" block>
                  Primary Button
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn color="secondary" variant="elevated" block>
                  Secondary Button
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn color="accent" variant="elevated" block>
                  Accent Button
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn color="error" variant="elevated" block>
                  Error Button
                </v-btn>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <v-row>
              <v-col cols="12">
                <v-alert type="success" title="Success Alert">
                  This is a success message for your custom theme.
                </v-alert>
              </v-col>
              <v-col cols="12">
                <v-alert type="warning" title="Warning Alert">
                  This is a warning message for your custom theme.
                </v-alert>
              </v-col>
              <v-col cols="12">
                <v-alert type="error" title="Error Alert">
                  This is an error message for your custom theme.
                </v-alert>
              </v-col>
              <v-col cols="12">
                <v-alert type="info" title="Info Alert">
                  This is an info message for your custom theme.
                </v-alert>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-6" />

          <!-- Spacing Preview -->
          <div>
            <h3 class="text-subtitle-2 mb-3">Spacing</h3>
            <div class="text-caption mb-2">
              Scale: {{ activeTheme.spacing?.scale || 'normal' }}
            </div>

            <div class="spacing-demo">
              <div class="spacing-item">
                <div class="box" />
                <span class="text-caption">8px</span>
              </div>
              <div class="spacing-item">
                <div class="box" style="width: 48px" />
                <span class="text-caption">16px</span>
              </div>
              <div class="spacing-item">
                <div class="box" style="width: 96px" />
                <span class="text-caption">24px</span>
              </div>
              <div class="spacing-item">
                <div class="box" style="width: 144px" />
                <span class="text-caption">32px</span>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const activeTheme = computed(() => themeStore.activeTheme)

const colorSwatches = computed(() => ({
  Primary: activeTheme.value.colors.primary,
  Secondary: activeTheme.value.colors.secondary,
  Accent: activeTheme.value.colors.accent,
  Surface: activeTheme.value.colors.surface || (activeTheme.value.mode === 'dark' ? '#121212' : '#ffffff'),
  Error: activeTheme.value.colors.error || '#b3261e',
  Warning: activeTheme.value.colors.warning || '#f9a825',
  Success: activeTheme.value.colors.success || '#188038',
  Info: activeTheme.value.colors.info || '#1b6ef3',
}))
</script>

<style scoped lang="scss">
.theme-preview {
  .color-block {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.02);

    .swatch {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.12);
      flex-shrink: 0;
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .name {
        text-transform: capitalize;
      }

      .value {
        font-family: monospace;
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }

  .typography-samples {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .sample {
      padding: 12px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.02);
      border-left: 3px solid rgb(var(--v-theme-primary));

      .sample-label {
        display: block;
        margin-top: 8px;
        opacity: 0.7;
      }
    }
  }

  .spacing-demo {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .spacing-item {
      display: flex;
      align-items: center;
      gap: 12px;

      .box {
        height: 16px;
        background: linear-gradient(
          90deg,
          rgb(var(--v-theme-primary)) 0%,
          rgb(var(--v-theme-secondary)) 100%
        );
        border-radius: 2px;
      }
    }
  }
}
</style>
