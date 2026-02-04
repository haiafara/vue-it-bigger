<template>
  <div class="event-monitor-example">
    <div class="layout">
      <!-- Gallery Section -->
      <div class="gallery-section">
        <h3>Open the lightbox and navigate to trigger events</h3>
        <p class="instructions">
          Click a thumbnail to open, navigate between images, and watch the event log update in real-time.
        </p>

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
          </li>
        </ul>

        <!-- LightBox Component with event listeners -->
        <LightBox
          ref="lightbox"
          :media="media"
          :show-caption="true"
          :show-light-box="false"
          @onOpened="handleOpened"
          @onClosed="handleClosed"
          @onImageChanged="handleImageChanged"
          @onFirstIndex="handleFirstIndex"
          @onLastIndex="handleLastIndex"
          @onStartIndex="handleStartIndex"
          @onLoad="handleLoad"
        />
      </div>

      <!-- Event Log Section -->
      <div class="event-log-section">
        <div class="event-log-header">
          <h3>Event Log</h3>
          <button class="clear-button" @click="clearEvents">Clear Log</button>
        </div>

        <div class="event-explanation">
          <p>The lightbox emits 7 different events:</p>
          <ul>
            <li><code>onOpened</code> - Fired when lightbox opens</li>
            <li><code>onClosed</code> - Fired when lightbox closes</li>
            <li><code>onImageChanged</code> - Fired when image changes (includes index)</li>
            <li><code>onFirstIndex</code> - Fired when navigating to first image</li>
            <li><code>onLastIndex</code> - Fired when navigating to last image</li>
            <li><code>onStartIndex</code> - Fired when returning to starting image</li>
            <li><code>onLoad</code> - Fired when more items need to be loaded</li>
          </ul>
        </div>

        <div class="event-list">
          <div
            v-if="events.length === 0"
            class="no-events"
          >
            No events yet. Open the lightbox to see events appear here.
          </div>

          <div
            v-for="event in events"
            :key="event.id"
            class="event-item"
            :class="'event-' + event.type"
          >
            <div class="event-badge">{{ event.name }}</div>
            <div class="event-details">
              <span class="event-time">{{ event.timestamp }}</span>
              <span v-if="event.payload !== null" class="event-payload">
                {{ event.payload }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LightBox from 'vue-it-bigger'
import { richMedia } from '../data/advancedMedia.js'

// Media data
const media = richMedia

// Lightbox ref
const lightbox = ref(null)

// Event log
const events = ref([])

// Event tracking function
const trackEvent = (eventName, eventType, payload = null) => {
  events.value.unshift({
    id: Date.now() + Math.random(), // Ensure uniqueness
    name: eventName,
    type: eventType,
    payload,
    timestamp: new Date().toLocaleTimeString()
  })

  // Keep only last 50 events
  if (events.value.length > 50) {
    events.value.pop()
  }
}

// Event handlers
const handleOpened = () => {
  trackEvent('onOpened', 'opened')
}

const handleClosed = () => {
  trackEvent('onClosed', 'closed')
}

const handleImageChanged = (index) => {
  trackEvent('onImageChanged', 'changed', `index: ${index}`)
}

const handleFirstIndex = () => {
  trackEvent('onFirstIndex', 'boundary', 'Reached first image')
}

const handleLastIndex = () => {
  trackEvent('onLastIndex', 'boundary', 'Reached last image')
}

const handleStartIndex = () => {
  trackEvent('onStartIndex', 'boundary', 'Returned to starting image')
}

const handleLoad = () => {
  trackEvent('onLoad', 'load', 'Load more items requested')
}

// Clear event log
const clearEvents = () => {
  events.value = []
}

// Open gallery at specific index
const openGallery = (index) => {
  lightbox.value.showImage(index)
}
</script>

<style scoped>
.event-monitor-example {
  width: 100%;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
}

/* Gallery Section */
.gallery-section h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

.instructions {
  margin: 0 0 20px 0;
  color: #666;
  font-size: 14px;
}

.thumbnail-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.thumbnail-list li {
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

/* Event Log Section */
.event-log-section {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  height: fit-content;
  max-height: 800px;
  display: flex;
  flex-direction: column;
}

.event-log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #dee2e6;
  background: white;
}

.event-log-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.clear-button {
  padding: 6px 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-button:hover {
  background: #c82333;
}

/* Event Explanation */
.event-explanation {
  padding: 15px 20px;
  background: #fff3cd;
  border-bottom: 1px solid #ffeaa7;
}

.event-explanation p {
  margin: 0 0 10px 0;
  font-size: 13px;
  font-weight: 600;
  color: #856404;
}

.event-explanation ul {
  margin: 0;
  padding-left: 20px;
  font-size: 12px;
  color: #856404;
}

.event-explanation li {
  margin-bottom: 4px;
}

.event-explanation code {
  background: #fff;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 11px;
}

/* Event List */
.event-list {
  padding: 15px;
  overflow-y: auto;
  flex: 1;
}

.no-events {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-style: italic;
}

.event-item {
  background: white;
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 10px;
  border-left: 4px solid;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.event-item.event-opened {
  border-left-color: #28a745;
}

.event-item.event-closed {
  border-left-color: #dc3545;
}

.event-item.event-changed {
  border-left-color: #007bff;
}

.event-item.event-boundary {
  border-left-color: #fd7e14;
}

.event-item.event-load {
  border-left-color: #6f42c1;
}

.event-badge {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.event-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.event-time {
  color: #999;
  font-family: 'Monaco', 'Courier New', monospace;
}

.event-payload {
  color: #666;
  font-style: italic;
  background: #f8f9fa;
  padding: 2px 8px;
  border-radius: 3px;
}

/* Responsive */
@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .event-log-section {
    max-height: 500px;
  }
}

@media (max-width: 768px) {
  .thumbnail-list {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
