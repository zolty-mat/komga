<template>
  <div class="appearance-settings">
    <v-container>
      <v-row class="mb-8">
        <v-col>
          <h2 class="text-h5 mb-2">
            {{
              $formatMessage({
                description: 'Appearance settings: title',
                defaultMessage: 'Appearance Settings',
                id: 'appearance-title',
              })
            }}
          </h2>
          <p class="text-body2 text-disabled">
            {{
              $formatMessage({
                description: 'Appearance settings: subtitle',
                defaultMessage: 'Customize the look and feel of the application',
                id: 'appearance-subtitle',
              })
            }}
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" lg="8">
          <v-tabs v-model="activeTab">
            <v-tab
              value="theme-selector"
              :text="
                $formatMessage({
                  description: 'Appearance settings: theme selector tab',
                  defaultMessage: 'Themes',
                  id: 'appearance-themes-tab',
                })
              "
            />

            <v-tab
              value="customizer"
              :text="
                $formatMessage({
                  description: 'Appearance settings: customizer tab',
                  defaultMessage: 'Create Theme',
                  id: 'appearance-customizer-tab',
                })
              "
            />

            <v-tab
              value="import-export"
              :text="
                $formatMessage({
                  description: 'Appearance settings: import/export tab',
                  defaultMessage: 'Import / Export',
                  id: 'appearance-import-export-tab',
                })
              "
            />
          </v-tabs>

          <v-window v-model="activeTab" class="mt-6">
            <!-- Theme Selector Tab -->
            <v-window-item value="theme-selector">
              <ThemeSelector />
            </v-window-item>

            <!-- Customizer Tab -->
            <v-window-item value="customizer">
              <ThemeCustomizer @theme-created="onThemeCreated" @error="onError" />
            </v-window-item>

            <!-- Import/Export Tab -->
            <v-window-item value="import-export">
              <v-card variant="outlined">
                <v-card-title>
                  {{
                    $formatMessage({
                      description: 'Appearance settings: import/export title',
                      defaultMessage: 'Export & Import Themes',
                      id: 'appearance-import-export-title',
                    })
                  }}
                </v-card-title>

                <v-card-text>
                  <!-- Export Section -->
                  <div class="mb-8">
                    <h3 class="text-subtitle-1 mb-4">
                      {{
                        $formatMessage({
                          description: 'Appearance settings: export section',
                          defaultMessage: 'Export Theme',
                          id: 'appearance-export-section',
                        })
                      }}
                    </h3>

                    <v-select
                      v-model="selectedExportTheme"
                      :items="exportThemeOptions"
                      item-title="name"
                      item-value="id"
                      label="Select theme to export"
                      outlined
                      dense
                      class="mb-4"
                    />

                    <v-btn
                      color="primary"
                      variant="elevated"
                      @click="exportTheme"
                      :disabled="!selectedExportTheme"
                    >
                      {{
                        $formatMessage({
                          description: 'Appearance settings: export button',
                          defaultMessage: 'Export as JSON',
                          id: 'appearance-export-btn',
                        })
                      }}
                    </v-btn>
                  </div>

                  <v-divider class="my-6" />

                  <!-- Import Section -->
                  <div>
                    <h3 class="text-subtitle-1 mb-4">
                      {{
                        $formatMessage({
                          description: 'Appearance settings: import section',
                          defaultMessage: 'Import Theme',
                          id: 'appearance-import-section',
                        })
                      }}
                    </h3>

                    <v-file-input
                      ref="fileInput"
                      v-model="importFile"
                      label="Select theme JSON file"
                      accept=".json"
                      outlined
                      dense
                      class="mb-4"
                    />

                    <v-btn
                      color="primary"
                      variant="elevated"
                      @click="importTheme"
                      :disabled="!importFile || importFile.length === 0"
                    >
                      {{
                        $formatMessage({
                          description: 'Appearance settings: import button',
                          defaultMessage: 'Import Theme',
                          id: 'appearance-import-btn',
                        })
                      }}
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>

        <!-- Preview Sidebar -->
        <v-col cols="12" lg="4">
          <ThemePreview />
        </v-col>
      </v-row>

      <!-- Snackbar Notifications -->
      <v-snackbar v-model="showSuccess" color="success" timeout="3000">
        {{ successMessage }}
      </v-snackbar>

      <v-snackbar v-model="showError" color="error" timeout="5000">
        {{ errorMessage }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import ThemeSelector from '@/components/theme/ThemeSelector.vue'
import ThemeCustomizer from '@/components/theme/ThemeCustomizer.vue'
import ThemePreview from '@/components/theme/ThemePreview.vue'
import type { ThemeConfig } from '@/utils/theme'

const themeStore = useThemeStore()

const activeTab = ref('theme-selector')
const selectedExportTheme = ref<string>('')
const importFile = ref<File[]>([])
const fileInput = ref()

const showSuccess = ref(false)
const successMessage = ref('')
const showError = ref(false)
const errorMessage = ref('')

const exportThemeOptions = computed(() => themeStore.allThemes)

function onThemeCreated(theme: ThemeConfig) {
  successMessage.value = `Theme "${theme.name}" created successfully!`
  showSuccess.value = true
  activeTab.value = 'theme-selector'
}

function onError(error: string) {
  errorMessage.value = error
  showError.value = true
}

function exportTheme() {
  if (!selectedExportTheme.value) return

  try {
    const json = themeStore.exportTheme(selectedExportTheme.value)
    const theme = themeStore.getThemeById(selectedExportTheme.value)
    const filename = `theme-${theme?.name.replace(/\s+/g, '-').toLowerCase()}.json`

    // Create download link
    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(json)}`)
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    successMessage.value = `Theme exported as ${filename}`
    showSuccess.value = true
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Failed to export theme')
  }
}

function importTheme() {
  if (!importFile.value || importFile.value.length === 0) return

  const file = importFile.value[0]
  const reader = new FileReader()

  reader.onload = (event) => {
    try {
      const json = event.target?.result as string
      const theme = themeStore.importTheme(json)
      themeStore.setActiveTheme(theme.id)

      successMessage.value = `Theme "${theme.name}" imported successfully!`
      showSuccess.value = true

      // Reset file input
      importFile.value = []
      fileInput.value?.clearInput?.()

      activeTab.value = 'theme-selector'
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to import theme')
    }
  }

  reader.readAsText(file)
}
</script>

<style scoped lang="scss">
.appearance-settings {
  .v-card {
    transition: all 0.2s ease;
  }
}
</style>
