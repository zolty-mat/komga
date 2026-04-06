<template>
  <div class="recommendation-card">
    <div class="card-image" @click="$emit('click')">
      <img :src="bookThumbnail" :alt="book.name" />
      <div class="rating-badge" v-if="score">
        <span class="score">{{ formatScore(score) }}%</span>
      </div>
    </div>

    <div class="card-content">
      <h3 class="book-title">{{ book.name }}</h3>
      <p class="book-author" v-if="book.metadata?.authors?.length">
        {{ book.metadata.authors.map((a) => a.name).join(', ') }}
      </p>

      <div class="recommendation-reason" v-if="reasons && reasons.length">
        <span class="reason-badge" v-for="(reason, idx) in reasons.slice(0, 2)" :key="idx">
          {{ reason }}
        </span>
      </div>

      <div class="card-actions">
        <button
          class="action-btn like-btn"
          :class="{ active: feedback === 1 }"
          @click="$emit('rate', 1)"
          title="I like this recommendation"
        >
          👍
        </button>
        <button
          class="action-btn dislike-btn"
          :class="{ active: feedback === -1 }"
          @click="$emit('rate', -1)"
          title="Not interested in this"
        >
          👎
        </button>
        <button class="action-btn hide-btn" @click="$emit('hide')" title="Hide this recommendation">
          👁️‍🗨️
        </button>
        <button class="action-btn details-btn" @click="$emit('details')" title="View details">
          📖
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BookDto } from '@/types/komga-books'

export default Vue.extend({
  name: 'RecommendationCard',
  props: {
    book: {
      type: Object as () => BookDto,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    reasons: {
      type: Array as () => string[],
      default: () => [],
    },
    feedback: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    bookThumbnail(): string {
      return `/api/v1/books/${this.book.id}/thumbnail`
    },
  },
  methods: {
    formatScore(score: number): string {
      return Math.round(score * 100).toString()
    },
  },
})
</script>

<style scoped lang="scss">
.recommendation-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .card-image {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    cursor: pointer;
    background: #f0f0f0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .rating-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(76, 175, 80, 0.9);
      color: white;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;

      .score {
        display: block;
        text-align: center;
      }
    }
  }

  .card-content {
    padding: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;

    .book-title {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.3;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .book-author {
      margin: 0 0 8px 0;
      font-size: 12px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .recommendation-reason {
      margin: 8px 0;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      .reason-badge {
        display: inline-block;
        background: #e8f5e9;
        color: #2e7d32;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
      }
    }

    .card-actions {
      display: flex;
      gap: 4px;
      margin-top: auto;

      .action-btn {
        flex: 1;
        padding: 6px 4px;
        border: 1px solid #ddd;
        background: #f5f5f5;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;

        &:hover {
          background: #efefef;
          border-color: #bbb;
        }

        &.active {
          background: #c8e6c9;
          border-color: #4caf50;
        }

        &.like-btn.active {
          background: #c8e6c9;
          border-color: #4caf50;
        }

        &.dislike-btn.active {
          background: #ffcccc;
          border-color: #f44336;
        }
      }
    }
  }
}
</style>
