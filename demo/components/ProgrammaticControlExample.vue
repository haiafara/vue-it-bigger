<template>
  <div class="programmatic-control-example">
    <div class="intro">
      <h3>Programmatic Control</h3>
      <p>
        You can control the lightbox programmatically using the <code>showImage(index)</code> method
        exposed via template refs. This allows you to open the lightbox at any specific image from
        your application code.
      </p>
    </div>

    <div class="control-panels">
      <!-- Jump to Specific Image -->
      <div class="control-panel">
        <h4>Jump to Specific Image</h4>
        <p>Open the lightbox directly at a specific index:</p>

        <div class="button-grid">
          <button
            v-for="index in 9"
            :key="index"
            @click="showImageAt(index - 1)"
            class="image-button"
          >
            Image {{ index }}
          </button>
        </div>

        <div class="code-snippet">
          <pre>// Get lightbox reference
const lightbox = ref(null)

// Open at specific index
lightbox.value.showImage(3)</pre>
        </div>
      </div>

      <!-- Quick Navigation -->
      <div class="control-panel">
        <h4>Quick Navigation Shortcuts</h4>
        <p>Create custom navigation buttons for common actions:</p>

        <div class="nav-buttons">
          <button @click="showFirst" class="nav-button">
            ⏮ First Image
          </button>
          <button @click="showMiddle" class="nav-button">
            ⏺ Middle Image
          </button>
          <button @click="showLast" class="nav-button">
            ⏭ Last Image
          </button>
          <button @click="showRandom" class="nav-button">
            🎲 Random Image
          </button>
        </div>

        <div class="code-snippet">
          <pre>// Navigation helpers
const showFirst = () => lightbox.value.showImage(0)
const showLast = () => lightbox.value.showImage(media.length - 1)
const showRandom = () => {
  const randomIndex = Math.floor(Math.random() * media.length)
  lightbox.value.showImage(randomIndex)
}</pre>
        </div>
      </div>

      <!-- Index Input -->
      <div class="control-panel">
        <h4>User Input Control</h4>
        <p>Let users enter an image number to jump to:</p>

        <div class="input-control">
          <label>
            Enter image number (1-{{ media.length }}):
            <input
              type="number"
              v-model.number="userInput"
              :min="1"
              :max="media.length"
              @keyup.enter="showUserInput"
            >
          </label>
          <button @click="showUserInput" class="go-button">Go</button>
        </div>

        <div class="code-snippet">
          <pre>// Handle user input
const userInput = ref(1)
const showUserInput = () => {
  const index = userInput.value - 1
  if (index >= 0 && index < media.length) {
    lightbox.value.showImage(index)
  }
}</pre>
        </div>
      </div>

      <!-- Event-Driven Control -->
      <div class="control-panel">
        <h4>Event-Driven Opening</h4>
        <p>Trigger the lightbox from any event or user interaction:</p>

        <div class="event-triggers">
          <button @click="handleSearch" class="trigger-button">
            🔍 Search and Open
          </button>
          <button @click="handleDeepLink" class="trigger-button">
            🔗 Deep Link Simulation
          </button>
          <button @click="handleNotification" class="trigger-button">
            🔔 Notification Click
          </button>
        </div>

        <div class="code-snippet">
          <pre>// Event handlers that open lightbox
const handleSearch = () => {
  // Simulate search result click
  const resultIndex = 4
  lightbox.value.showImage(resultIndex)
}

const handleDeepLink = () => {
  // Parse URL parameter and open image
  const urlParams = new URLSearchParams(window.location.search)
  const imageId = urlParams.get('image')
  if (imageId) lightbox.value.showImage(imageId)
}</pre>
        </div>
      </div>
    </div>

    <!-- Thumbnail Gallery -->
    <div class="gallery-section">
      <h4>Or click any thumbnail (traditional approach)</h4>
      <ul class="thumbnail-list">
        <li
          v-for="(image, index) in media"
          :key="index"
        >
          <img
            :src="image.thumb"
            @click="showImageAt(index)"
            alt=""
          >
          <div class="item-number">{{ index + 1 }}</div>
        </li>
      </ul>
    </div>

    <!-- LightBox Component -->
    <LightBox
      ref="lightbox"
      :media="media"
      :show-caption="true"
      :show-light-box="false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LightBox from 'vue-it-bigger'
import { richMedia } from '../data/advancedMedia.js'

// Media data
const media = richMedia

// Lightbox ref - this is key for programmatic control
const lightbox = ref(null)

// User input
const userInput = ref(1)

// Basic control - open at specific index
const showImageAt = (index) => {
  lightbox.value.showImage(index)
}

// Navigation shortcuts
const showFirst = () => {
  lightbox.value.showImage(0)
}

const showMiddle = () => {
  const middleIndex = Math.floor(media.length / 2)
  lightbox.value.showImage(middleIndex)
}

const showLast = () => {
  lightbox.value.showImage(media.length - 1)
}

const showRandom = () => {
  const randomIndex = Math.floor(Math.random() * media.length)
  lightbox.value.showImage(randomIndex)
}

// User input control
const showUserInput = () => {
  const index = userInput.value - 1
  if (index >= 0 && index < media.length) {
    lightbox.value.showImage(index)
  } else {
    alert(`Please enter a number between 1 and ${media.length}`)
  }
}

// Event-driven examples
const handleSearch = () => {
  // Simulate finding a specific image from search
  const resultIndex = 4
  lightbox.value.showImage(resultIndex)
}

const handleDeepLink = () => {
  // Simulate opening from a URL parameter
  // In a real app, you'd parse window.location.search
  const imageIndex = 6
  lightbox.value.showImage(imageIndex)
}

const handleNotification = () => {
  // Simulate opening from a notification click
  const notificationImageIndex = 2
  lightbox.value.showImage(notificationImageIndex)
}
</script>

<style scoped>
.programmatic-control-example {
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

/* Control Panels */
.control-panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.control-panel {
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
}

.control-panel h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}

.control-panel > p {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
}

/* Button Grid */
.button-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 15px;
}

.image-button {
  padding: 10px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.image-button:hover {
  background: #0052a3;
}

/* Navigation Buttons */
.nav-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.nav-button {
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: left;
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Input Control */
.input-control {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  margin-bottom: 15px;
}

.input-control label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 14px;
  color: #333;
}

.input-control input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.go-button {
  padding: 8px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.go-button:hover {
  background: #218838;
}

/* Event Triggers */
.event-triggers {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.trigger-button {
  padding: 12px 16px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: left;
}

.trigger-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

/* Code Snippets */
.code-snippet {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 12px;
  overflow-x: auto;
}

.code-snippet pre {
  margin: 0;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
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

/* Responsive */
@media (max-width: 768px) {
  .control-panels {
    grid-template-columns: 1fr;
  }

  .button-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .thumbnail-list {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
