<template>
  <div class="interactive-controls-example">
    <div class="layout">
      <!-- Control Panel -->
      <div class="controls-panel">
        <h3>Configure Props</h3>

        <div class="control-section">
          <h4>Boolean Props</h4>

          <label class="checkbox-control">
            <input type="checkbox" v-model="config.showCaption">
            <span>showCaption</span>
          </label>

          <label class="checkbox-control">
            <input type="checkbox" v-model="config.autoPlay">
            <span>autoPlay</span>
          </label>

          <label class="checkbox-control">
            <input type="checkbox" v-model="config.showThumbs">
            <span>showThumbs</span>
          </label>

          <label class="checkbox-control">
            <input type="checkbox" v-model="config.disableScroll">
            <span>disableScroll</span>
          </label>

          <label class="checkbox-control">
            <input type="checkbox" v-model="config.closable">
            <span>closable</span>
          </label>
        </div>

        <div class="control-section">
          <h4>Number Props</h4>

          <div class="slider-control">
            <label>nThumbs: {{ config.nThumbs }}</label>
            <input
              type="range"
              v-model.number="config.nThumbs"
              min="3"
              max="11"
            >
            <span class="hint">Number of visible thumbnails (3-11)</span>
          </div>

          <div class="slider-control">
            <label>autoPlayTime: {{ config.autoPlayTime }}ms</label>
            <input
              type="range"
              v-model.number="config.autoPlayTime"
              min="1000"
              max="10000"
              step="500"
            >
            <span class="hint">Time between auto-play slides</span>
          </div>

          <div class="slider-control">
            <label>interfaceHideTime: {{ config.interfaceHideTime }}ms</label>
            <input
              type="range"
              v-model.number="config.interfaceHideTime"
              min="1000"
              max="10000"
              step="500"
            >
            <span class="hint">Time before interface auto-hides</span>
          </div>

          <div class="number-control">
            <label>startAt: </label>
            <input
              type="number"
              v-model.number="config.startAt"
              min="0"
              :max="media.length - 1"
            >
            <span class="hint">Initial image index (0-{{ media.length - 1 }})</span>
          </div>
        </div>

        <div class="control-section">
          <h4>Text Props</h4>

          <div class="text-control">
            <label>closeText:</label>
            <input type="text" v-model="config.closeText">
          </div>

          <div class="text-control">
            <label>previousText:</label>
            <input type="text" v-model="config.previousText">
          </div>

          <div class="text-control">
            <label>nextText:</label>
            <input type="text" v-model="config.nextText">
          </div>
        </div>

        <button class="reset-button" @click="resetConfig">
          Reset to Defaults
        </button>
      </div>

      <!-- Gallery Preview -->
      <div class="gallery-preview">
        <h3>Click any thumbnail to test</h3>

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

        <!-- LightBox Component with dynamic props -->
        <LightBox
          ref="lightbox"
          :media="media"
          :show-caption="config.showCaption"
          :auto-play="config.autoPlay"
          :show-thumbs="config.showThumbs"
          :disable-scroll="config.disableScroll"
          :closable="config.closable"
          :n-thumbs="config.nThumbs"
          :auto-play-time="config.autoPlayTime"
          :interface-hide-time="config.interfaceHideTime"
          :start-at="config.startAt"
          :close-text="config.closeText"
          :previous-text="config.previousText"
          :next-text="config.nextText"
          :show-light-box="false"
        />
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

// Lightbox ref for programmatic control
const lightbox = ref(null)

// Default configuration matching LightBox defaults
const getDefaultConfig = () => ({
  showCaption: false,
  autoPlay: false,
  showThumbs: true,
  disableScroll: true,
  closable: true,
  nThumbs: 7,
  autoPlayTime: 3000,
  interfaceHideTime: 3000,
  startAt: 0,
  closeText: 'Close (Esc)',
  previousText: 'Previous',
  nextText: 'Next',
})

// Reactive configuration
const config = ref(getDefaultConfig())

// Reset to defaults
const resetConfig = () => {
  config.value = getDefaultConfig()
}

// Open gallery at specific index
const openGallery = (index) => {
  lightbox.value.showImage(index)
}
</script>

<style scoped>
.interactive-controls-example {
  width: 100%;
}

.layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
}

/* Control Panel */
.controls-panel {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.controls-panel h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
}

.control-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #dee2e6;
}

.control-section:last-of-type {
  border-bottom: none;
}

.control-section h4 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Checkbox Controls */
.checkbox-control {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  user-select: none;
}

.checkbox-control input[type="checkbox"] {
  margin-right: 8px;
  cursor: pointer;
}

.checkbox-control span {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #333;
}

/* Slider Controls */
.slider-control {
  margin-bottom: 15px;
}

.slider-control label {
  display: block;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  margin-bottom: 5px;
  color: #333;
}

.slider-control input[type="range"] {
  width: 100%;
  margin-bottom: 5px;
}

.slider-control .hint {
  display: block;
  font-size: 11px;
  color: #666;
  font-style: italic;
}

/* Number Controls */
.number-control {
  margin-bottom: 15px;
}

.number-control label {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #333;
}

.number-control input[type="number"] {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
}

.number-control .hint {
  display: block;
  font-size: 11px;
  color: #666;
  font-style: italic;
  margin-top: 5px;
}

/* Text Controls */
.text-control {
  margin-bottom: 15px;
}

.text-control label {
  display: block;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  margin-bottom: 5px;
  color: #333;
}

.text-control input[type="text"] {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
}

/* Reset Button */
.reset-button {
  width: 100%;
  padding: 10px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.reset-button:hover {
  background: #0052a3;
}

/* Gallery Preview */
.gallery-preview h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
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

/* Responsive */
@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .controls-panel {
    position: static;
  }
}

@media (max-width: 768px) {
  .thumbnail-list {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
