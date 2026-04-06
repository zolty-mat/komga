<template>
  <div class="recommendations-page">
    <div class="page-header">
      <h1>Recommended for You</h1>
      <p class="subtitle">
        Personalized recommendations based on your reading history
      </p>
    </div>

    <div class="page-content">
      <!-- Loading State -->
      <div class="loading-state" v-if="loading">
        <p>Generating personalized recommendations...</p>
        <div class="spinner"></div>
      </div>

      <!-- Error State -->
      <div class="error-state" v-if="error">
        <p>{{ error }}</p>
        <button @click="retryGenerate" class="retry-btn">Retry</button>
      </div>

      <!-- No History State -->
      <div class="empty-state" v-if="!loading && !hasReadHistory">
        <p>👋 No reading history yet</p>
        <p class="help-text">Start reading books to get personalized recommendations!</p>
      </div>

      <!-- Recommendations Sections -->
      <div class="recommendations-container" v-if="!loading && hasReadHistory">
        <!-- Continue Series Section -->
        <recommendation-carousel
          v-if="shouldShow('continuation')"
          title="Continue Your Series"
          :recommendations="getRecommendations('continuation')"
          :items-per-page="4"
          empty-message="You're all caught up with your series!"
          @book-select="openBook"
          @book-details="showBookDetails"
          @rate-book="handleRateBook"
          @hide-book="handleHideBook"
        />

        <!-- By Favorite Authors Section -->
        <recommendation-carousel
          v-if="shouldShow('authors')"
          title="More from Your Favorite Authors"
          :recommendations="getRecommendations('authors')"
          :items-per-page="5"
          empty-message="No more books from your favorite authors"
          @book-select="openBook"
          @book-details="showBookDetails"
          @rate-book="handleRateBook"
          @hide-book="handleHideBook"
        />

        <!-- Similar to Recent Reads -->
        <recommendation-carousel
          v-if="shouldShow('similar')"
          title="Similar to What You've Read"
          :recommendations="getRecommendations('similar')"
          :items-per-page="5"
          empty-message="No similar books found"
          @book-select="openBook"
          @book-details="showBookDetails"
          @rate-book="handleRateBook"
          @hide-book="handleHideBook"
        />

        <!-- By Genre Section -->
        <recommendation-carousel
          v-if="shouldShow('genres')"
          title="Your Favorite Genres"
          :recommendations="getRecommendations('genres')"
          :items-per-page="5"
          empty-message="No recommendations by genre"
          @book-select="openBook"
          @book-details="showBookDetails"
          @rate-book="handleRateBook"
          @hide-book="handleHideBook"
        />

        <!-- New Arrivals Section -->
        <recommendation-carousel
          v-if="shouldShow('newArrivals')"
          title="New Arrivals You Might Like"
          :recommendations="getRecommendations('newArrivals')"
          :items-per-page="5"
          empty-message="No new arrivals matching your interests"
          @book-select="openBook"
          @book-details="showBookDetails"
          @rate-book="handleRateBook"
          @hide-book="handleHideBook"
        />

        <!-- Trending in Library -->
        <recommendation-carousel
          v-if="shouldShow('trending')"
          title="Trending in Your Library"
          :recommendations="getRecommendations('trending')"
          :items-per-page="5"
          empty-message="No trending books"
          @book-select="openBook"
          @book-details="showBookDetails"
          @rate-book="handleRateBook"
          @hide-book="handleHideBook"
        />

        <!-- Hidden Books Section -->
        <div class="hidden-section" v-if="hiddenBooks.length > 0">
          <h2>Hidden Recommendations</h2>
          <p class="section-subtitle">
            Books you've hidden from recommendations (you can restore them)
          </p>
          <div class="hidden-grid">
            <div
              class="hidden-book-item"
              v-for="bookId in hiddenBooks"
              :key="bookId"
              :book-id="bookId"
            >
              <button
                class="restore-btn"
                @click="restoreBook(bookId)"
                title="Restore to recommendations"
              >
                Restore
              </button>
              <span class="book-id">{{ bookId.substring(0, 8) }}...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Drawer -->
    <div class="settings-panel" v-if="showSettings">
      <div class="settings-content">
        <h3>Recommendation Settings</h3>
        <div class="setting-item">
          <label>
            <input
              type="checkbox"
              v-model="settings.enableGenreRecommendations"
              @change="updateSettings"
            />
            Genre-based recommendations
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input
              type="checkbox"
              v-model="settings.enableAuthorRecommendations"
              @change="updateSettings"
            />
            Author-based recommendations
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input
              type="checkbox"
              v-model="settings.enableSeriesContinuation"
              @change="updateSettings"
            />
            Series continuation
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input
              type="checkbox"
              v-model="settings.enableSimilarBooks"
              @change="updateSettings"
            />
            Similar books
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input
              type="checkbox"
              v-model="settings.enableNewArrivals"
              @change="updateSettings"
            />
            New arrivals
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input
              type="checkbox"
              v-model="settings.enableTrendingBooks"
              @change="updateSettings"
            />
            Trending books
          </label>
        </div>
        <button @click="closeSettings" class="close-settings">Close</button>
      </div>
    </div>

    <!-- FAB Button for Settings -->
    <button class="fab-settings" @click="toggleSettings" title="Recommendation Settings">
      ⚙️
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import RecommendationCarousel from '@/components/RecommendationCarousel.vue'
import { RecommendationScore } from '@/services/komga-recommendations.service'

export default Vue.extend({
  name: 'Recommendations',
  components: {
    RecommendationCarousel,
  },
  data() {
    return {
      showSettings: false,
    }
  },
  computed: {
    ...mapState('recommendations', {
      recommendations: 'recommendations',
      hiddenBooks: (state: any) => Array.from(state.hiddenBooks),
      settings: 'settings',
      loading: 'loading',
      error: 'error',
      userPreferences: 'userPreferences',
    }),
    ...mapGetters('recommendations', ['hasReadHistory', 'recommendationStats']),

    hasReadHistory(): boolean {
      return this.$store.getters['recommendations/hasReadHistory']
    },

    hiddenBooks(): string[] {
      return Array.from(this.$store.state.recommendations.hiddenBooks)
    },

    settings(): any {
      return this.$store.state.recommendations.settings
    },

    loading(): boolean {
      return this.$store.state.recommendations.loading
    },

    error(): string | null {
      return this.$store.state.recommendations.error
    },
  },
  watch: {
    settings: {
      handler(newSettings) {
        localStorage.setItem(
          'komga_recommendation_settings',
          JSON.stringify(newSettings),
        )
      },
      deep: true,
    },
  },
  mounted() {
    // Load saved settings
    const saved = localStorage.getItem('komga_recommendation_settings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        this.$store.dispatch('recommendations/updateSettings', settings)
      } catch (e) {
        // Failed to load settings, using defaults
      }
    }

    // Generate recommendations if we have read history
    if (this.hasReadHistory) {
      this.generateRecommendations()
    }
  },
  methods: {
    async generateRecommendations() {
      // This would be called with actual book data from parent or api
      // Recommendations will be generated based on reading history
    },

    getRecommendations(type: string): RecommendationScore[] {
      return this.$store.getters['recommendations/getVisibleRecommendations'](type)
    },

    shouldShow(type: string): boolean {
      const recs = this.getRecommendations(type)
      const settingKey = `enable${type.charAt(0).toUpperCase()}${type.slice(1)}`
      return recs && recs.length > 0 && this.settings[settingKey] !== false
    },

    handleRateBook({ bookId, rating }: { bookId: string; rating: number }) {
      this.$store.dispatch('recommendations/rateRecommendation', { bookId, rating })
    },

    handleHideBook(bookId: string) {
      this.$store.dispatch('recommendations/hideBook', bookId)
    },

    restoreBook(bookId: string) {
      this.$store.dispatch('recommendations/restoreBook', bookId)
    },

    toggleSettings() {
      this.showSettings = !this.showSettings
    },

    closeSettings() {
      this.showSettings = false
    },

    updateSettings() {
      this.$store.dispatch('recommendations/updateSettings', this.settings)
    },

    retryGenerate() {
      this.generateRecommendations()
    },

    openBook(book: any) {
      this.$router.push(`/books/${book.id}`)
    },

    showBookDetails(book: any) {
      this.$router.push(`/books/${book.id}`)
    },
  },
})
</script>

<style scoped lang="scss">
.recommendations-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;

  .page-header {
    margin-bottom: 32px;

    h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 700;
      color: #333;
    }

    .subtitle {
      margin: 0;
      font-size: 16px;
      color: #666;
    }
  }

  .page-content {
    .loading-state {
      text-align: center;
      padding: 40px;
      color: #666;

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #4caf50;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 16px auto;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    }

    .error-state {
      background: #ffebee;
      border: 1px solid #f44336;
      border-radius: 8px;
      padding: 16px;
      color: #c62828;
      text-align: center;

      p {
        margin: 8px 0;
      }

      .retry-btn {
        margin-top: 12px;
        padding: 8px 16px;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;

        &:hover {
          background: #d32f2f;
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 60px 24px;
      color: #999;

      p {
        margin: 8px 0;
        font-size: 16px;
      }

      .help-text {
        color: #bbb;
        font-size: 14px;
      }
    }

    .recommendations-container {
      .hidden-section {
        margin-top: 40px;
        padding: 20px;
        background: #f5f5f5;
        border-radius: 8px;

        h2 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .section-subtitle {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #666;
        }

        .hidden-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;

          .hidden-book-item {
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;

            .restore-btn {
              width: 100%;
              padding: 6px 8px;
              background: #4caf50;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
              font-weight: 500;

              &:hover {
                background: #45a049;
              }
            }

            .book-id {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
  }

  .fab-settings {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #4caf50;
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s;
    z-index: 100;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
  }

  .settings-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    z-index: 200;
    overflow-y: auto;
    animation: slideIn 0.3s ease-out;

    @keyframes slideIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    .settings-content {
      padding: 20px;

      h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 600;
      }

      .setting-item {
        margin: 12px 0;

        label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
          color: #333;
          gap: 8px;

          input[type='checkbox'] {
            cursor: pointer;
          }
        }
      }

      .close-settings {
        width: 100%;
        margin-top: 24px;
        padding: 10px;
        background: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;

        &:hover {
          background: #e0e0e0;
        }
      }
    }
  }
}
</style>
