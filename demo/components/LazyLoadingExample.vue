<template>
  <div class="lazy-loading-example">
    <div class="intro">
      <h3>Progressive Media Loading</h3>
      <p>
        This example demonstrates how to load media items progressively as users navigate through the gallery.
        When you get close to the end of the loaded images, the <code>onLoad</code> event fires, allowing you
        to fetch and append more items.
      </p>
    </div>

    <div class="stats">
      <div class="stat-item">
        <span class="stat-label">Loaded:</span>
        <span class="stat-value">{{ media.length }} items</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Total Available:</span>
        <span class="stat-value">{{ totalAvailable }} items</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Status:</span>
        <span class="stat-value" :class="{ 'loading': loading }">
          {{ loading ? 'Loading...' : 'Ready' }}
        </span>
      </div>
    </div>

    <div class="explanation">
      <h4>How it works</h4>
      <ol>
        <li>Set the <code>lengthToLoadMore</code> prop to specify how many items from the end trigger loading</li>
        <li>Listen to the <code>onLoad</code> event to know when to fetch more items</li>
        <li>Append new items to your media array</li>
        <li>The lightbox automatically updates to include the new items</li>
      </ol>

      <div class="code-snippet">
        <pre>&lt;LightBox
  :media="media"
  :lengthToLoadMore="3"
  @onLoad="loadMoreItems"
/&gt;

&lt;script&gt;
const loadMoreItems = () => {
  // Fetch more items from your API
  const newItems = await fetchMoreItems()
  media.value.push(...newItems)
}
&lt;/script&gt;</pre>
      </div>
    </div>

    <div class="gallery-section">
      <h4>Click to open and navigate to the end to trigger loading</h4>

      <!-- Thumbnail Gallery -->
      <ul class="thumbnail-list">
        <li
          v-for="(image, index) in media"
          :key="index"
        >
          <img
            :src="image.thumb"
            @click="openGallery(index)"
            alt=""
          >
          <div class="item-number">{{ index + 1 }}</div>
        </li>
      </ul>

      <!-- Loading Indicator -->
      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Loading more items...</p>
      </div>

      <!-- LightBox Component with lazy loading -->
      <LightBox
        ref="lightbox"
        :media="media"
        :show-caption="true"
        :show-light-box="false"
        :lengthToLoadMore="3"
        @onLoad="loadMoreItems"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LightBox from 'vue-it-bigger'
import { getInitialMedia, generateMediaItems } from '../data/advancedMedia.js'

// Media data - start with initial set
const media = ref(getInitialMedia(15))
const loading = ref(false)
const totalAvailable = 100

// Lightbox ref
const lightbox = ref(null)

// Load more items
const loadMoreItems = () => {
  // Prevent multiple simultaneous loads
  if (loading.value) return

  // Check if we've reached the limit
  if (media.value.length >= totalAvailable) {
    return
  }

  loading.value = true

  // Simulate API delay (500ms)
  setTimeout(() => {
    const startIndex = media.value.length
    const itemsToLoad = Math.min(10, totalAvailable - media.value.length)
    const newItems = generateMediaItems(itemsToLoad, startIndex)

    // Append new items to the media array
    media.value.push(...newItems)

    loading.value = false
  }, 500)
}

// Open gallery at specific index
const openGallery = (index) => {
  lightbox.value.showImage(index)
}
</script>

<style scoped>
.lazy-loading-example {
  width: 100%;
}

.intro {
  background: #e7f3ff;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 25px;
  border-left: 4px solid #0066cc;
}

.intro h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #004085;
}

.intro p {
  margin: 0;
  color: #004085;
  line-height: 1.6;
}

.intro code {
  background: rgba(255, 255, 255, 0.7);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #0066cc;
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.stat-item {
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.stat-value.loading {
  color: #0066cc;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Explanation */
.explanation {
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
}

.explanation h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.explanation ol {
  margin: 0 0 20px 0;
  padding-left: 25px;
  line-height: 1.8;
  color: #666;
}

.explanation code {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #e83e8c;
}

/* Code Snippet */
.code-snippet {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  overflow-x: auto;
}

.code-snippet pre {
  margin: 0;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
}

/* Gallery Section */
.gallery-section {
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
}

.gallery-section h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.thumbnail-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.thumbnail-list li {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 4px;
}

.thumbnail-list img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s;
}

.thumbnail-list img:hover {
  transform: scale(1.05);
}

.item-number {
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  pointer-events: none;
}

/* Loading Indicator */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 2px dashed #dee2e6;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top-color: #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-indicator p {
  margin: 0;
  color: #666;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .stats {
    grid-template-columns: 1fr;
  }

  .thumbnail-list {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
