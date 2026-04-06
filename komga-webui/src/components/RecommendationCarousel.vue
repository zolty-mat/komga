<template>
  <div class="recommendation-carousel">
    <div class="carousel-header">
      <h2 class="carousel-title">{{ title }}</h2>
      <div class="carousel-controls" v-if="recommendations.length > itemsPerPage">
        <button
          class="nav-btn"
          @click="scrollLeft"
          :disabled="isAtStart"
          aria-label="Previous"
        >
          ← Prev
        </button>
        <div class="carousel-indicator">
          {{ currentPage + 1 }} of {{ Math.ceil(recommendations.length / itemsPerPage) }}
        </div>
        <button
          class="nav-btn"
          @click="scrollRight"
          :disabled="isAtEnd"
          aria-label="Next"
        >
          Next →
        </button>
      </div>
    </div>

    <div class="carousel-container" ref="container">
      <div class="carousel-track" :style="trackStyle">
        <div
          class="carousel-item"
          v-for="rec in recommendations"
          :key="rec.bookId"
          :style="itemStyle"
        >
          <recommendation-card
            :book="rec.book"
            :score="rec.score"
            :reasons="rec.reasons"
            :feedback="getFeedback(rec.bookId)"
            @click="$emit('book-select', rec.book)"
            @details="$emit('book-details', rec.book)"
            @rate="(rating) => rateBook(rec.bookId, rating)"
            @hide="hideBook(rec.bookId)"
          />
        </div>
      </div>
    </div>

    <div class="carousel-footer" v-if="recommendations.length === 0">
      <p>{{ emptyMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import RecommendationCard from './RecommendationCard.vue'
import { RecommendationScore } from '@/services/komga-recommendations.service'

export default Vue.extend({
  name: 'RecommendationCarousel',
  components: {
    RecommendationCard,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    recommendations: {
      type: Array as () => RecommendationScore[],
      default: () => [],
    },
    itemsPerPage: {
      type: Number,
      default: 5,
    },
    emptyMessage: {
      type: String,
      default: 'No recommendations available',
    },
  },
  data() {
    return {
      currentPage: 0,
    }
  },
  computed: {
    isAtStart(): boolean {
      return this.currentPage === 0
    },

    isAtEnd(): boolean {
      return (this.currentPage + 1) * this.itemsPerPage >= this.recommendations.length
    },

    trackStyle(): Record<string, string> {
      const offset = -(this.currentPage * this.itemsPerPage * 100) / this.itemsPerPage
      return {
        transform: `translateX(${offset}%)`,
        transition: 'transform 0.3s ease-in-out',
      }
    },

    itemStyle(): Record<string, string> {
      return {
        width: `${100 / this.itemsPerPage}%`,
        flexShrink: '0',
      }
    },
  },
  methods: {
    scrollLeft() {
      if (this.currentPage > 0) {
        this.currentPage--
      }
    },

    scrollRight() {
      const maxPage = Math.ceil(this.recommendations.length / this.itemsPerPage) - 1
      if (this.currentPage < maxPage) {
        this.currentPage++
      }
    },

    rateBook(bookId: string, rating: number) {
      this.$emit('rate-book', { bookId, rating })
    },

    hideBook(bookId: string) {
      this.$emit('hide-book', bookId)
    },

    getFeedback(bookId: string): number {
      return this.$store.getters['recommendations/getBookFeedback'](bookId)
    },
  },
})
</script>

<style scoped lang="scss">
.recommendation-carousel {
  margin: 24px 0;
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;

  .carousel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .carousel-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .carousel-controls {
      display: flex;
      gap: 12px;
      align-items: center;

      .nav-btn {
        padding: 6px 12px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s;

        &:hover:not(:disabled) {
          background: #f0f0f0;
          border-color: #bbb;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .carousel-indicator {
        font-size: 12px;
        color: #666;
        min-width: 60px;
        text-align: center;
      }
    }
  }

  .carousel-container {
    overflow: hidden;
    border-radius: 4px;

    .carousel-track {
      display: flex;
      gap: 12px;

      .carousel-item {
        padding: 4px;
        min-width: 0;
      }
    }
  }

  .carousel-footer {
    text-align: center;
    padding: 24px 16px;
    color: #999;
    font-size: 14px;
  }
}
</style>
