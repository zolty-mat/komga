<template>
  <div class="recommendation-widget">
    <div class="widget-header">
      <h3>Recommended for You</h3>
      <router-link to="/recommendations" class="view-all-link">View All →</router-link>
    </div>

    <div class="widget-loading" v-if="loading">
      <p>Loading recommendations...</p>
    </div>

    <div class="widget-content" v-else-if="displayedRecommendations.length > 0">
      <div class="recommendations-grid">
        <div
          class="recommendation-item"
          v-for="rec in displayedRecommendations"
          :key="rec.bookId"
          @click="openBook(rec.book)"
        >
          <div class="item-image">
            <img :src="getThumbnail(rec.book.id)" :alt="rec.book.name" />
          </div>
          <div class="item-info">
            <h4 class="item-title">{{ rec.book.name }}</h4>
            <p class="item-author" v-if="rec.book.metadata?.authors?.length">
              {{ rec.book.metadata.authors[0].name }}
            </p>
            <div class="item-reason" v-if="rec.reasons && rec.reasons.length">
              <span>{{ rec.reasons[0] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="widget-empty" v-else>
      <p>Start reading to get personalized recommendations</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { RecommendationScore } from '@/services/komga-recommendations.service'

export default Vue.extend({
  name: 'RecommendationWidget',
  props: {
    limit: {
      type: Number,
      default: 6,
    },
  },
  computed: {
    ...mapState('recommendations', {
      recommendations: 'recommendations',
      loading: 'loading',
    }),
    ...mapGetters('recommendations', ['getVisibleRecommendations', 'hasReadHistory']),

    displayedRecommendations(): RecommendationScore[] {
      // Get recommendations from multiple types and combine
      const allRecs: RecommendationScore[] = []
      const types = ['continuation', 'similar', 'genres', 'authors', 'newArrivals', 'trending']

      for (const type of types) {
        const recs = this.$store.getters['recommendations/getVisibleRecommendations'](type)
        if (recs && recs.length > 0) {
          allRecs.push(...recs)
        }
      }

      // Remove duplicates and sort by score
      const seen = new Set<string>()
      return allRecs
        .filter((rec) => {
          if (seen.has(rec.bookId)) return false
          seen.add(rec.bookId)
          return true
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, this.limit)
    },
  },
  methods: {
    getThumbnail(bookId: string): string {
      return `/api/v1/books/${bookId}/thumbnail`
    },

    openBook(book: any) {
      this.$router.push(`/books/${book.id}`)
    },
  },
})
</script>

<style scoped lang="scss">
.recommendation-widget {
  background: white;
  border-radius: 8px;
  border: 1px solid #eee;
  padding: 20px;
  margin: 20px 0;

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .view-all-link {
      text-decoration: none;
      color: #4caf50;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.2s;

      &:hover {
        color: #45a049;
      }
    }
  }

  .widget-loading {
    text-align: center;
    padding: 20px;
    color: #999;

    p {
      margin: 0;
    }
  }

  .widget-content {
    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 16px;
    }

    .recommendation-item {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      border-radius: 6px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .item-image {
        width: 100%;
        height: 140px;
        overflow: hidden;
        background: #f0f0f0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .item-info {
        padding: 8px;
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #fafafa;

        .item-title {
          margin: 0 0 4px 0;
          font-size: 13px;
          font-weight: 600;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .item-author {
          margin: 0 0 4px 0;
          font-size: 11px;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-reason {
          font-size: 10px;
          color: #999;
          margin-top: auto;

          span {
            display: inline-block;
            background: #e8f5e9;
            color: #2e7d32;
            padding: 1px 4px;
            border-radius: 2px;
          }
        }
      }
    }
  }

  .widget-empty {
    text-align: center;
    padding: 20px;
    color: #999;

    p {
      margin: 0;
      font-size: 14px;
    }
  }
}
</style>
