<template>
  <div class="slots-example">
    <div class="intro">
      <p>
        The lightbox provides 6 slots for customization. Each example below demonstrates
        one or more slots. Click "Open Example" to see the customization in action.
      </p>
    </div>

    <!-- Example 1: Custom Close Button -->
    <div class="slot-demo">
      <div class="demo-header">
        <h3>1. Custom Close Button</h3>
        <button class="open-button" @click="openExample1">Open Example</button>
      </div>
      <p class="demo-description">
        Use the <code>close</code> slot to customize the close button appearance.
      </p>
      <div class="code-snippet">
        <pre>&lt;LightBox :media="media"&gt;
  &lt;template #close&gt;
    &lt;span class="custom-close"&gt;✕ CLOSE&lt;/span&gt;
  &lt;/template&gt;
&lt;/LightBox&gt;</pre>
      </div>

      <LightBox
        ref="lightbox1"
        :media="media"
        :show-light-box="false"
      >
        <template #close>
          <span class="custom-close">✕ CLOSE</span>
        </template>
      </LightBox>
    </div>

    <!-- Example 2: Custom Navigation Arrows -->
    <div class="slot-demo">
      <div class="demo-header">
        <h3>2. Custom Navigation Arrows</h3>
        <button class="open-button" @click="openExample2">Open Example</button>
      </div>
      <p class="demo-description">
        Use the <code>previous</code> and <code>next</code> slots to customize navigation arrows.
      </p>
      <div class="code-snippet">
        <pre>&lt;LightBox :media="media"&gt;
  &lt;template #previous&gt;
    &lt;span class="custom-arrow"&gt;← BACK&lt;/span&gt;
  &lt;/template&gt;
  &lt;template #next&gt;
    &lt;span class="custom-arrow"&gt;NEXT →&lt;/span&gt;
  &lt;/template&gt;
&lt;/LightBox&gt;</pre>
      </div>

      <LightBox
        ref="lightbox2"
        :media="media"
        :show-light-box="false"
      >
        <template #previous>
          <span class="custom-arrow">← BACK</span>
        </template>
        <template #next>
          <span class="custom-arrow">NEXT →</span>
        </template>
      </LightBox>
    </div>

    <!-- Example 3: Custom Footer with Progress Bar -->
    <div class="slot-demo">
      <div class="demo-header">
        <h3>3. Custom Footer with Progress Bar</h3>
        <button class="open-button" @click="openExample3">Open Example</button>
      </div>
      <p class="demo-description">
        Use the <code>footer</code> slot to create a custom counter. The slot provides
        <code>current</code> and <code>total</code> props.
      </p>
      <div class="code-snippet">
        <pre>&lt;LightBox :media="media"&gt;
  &lt;template #footer="{ current, total }"&gt;
    &lt;div class="custom-footer"&gt;
      &lt;div class="progress-bar"&gt;
        &lt;div :style="{ width: (current / total * 100) + '%' }"&gt;&lt;/div&gt;
      &lt;/div&gt;
      &lt;span&gt;Image {{ current }} of {{ total }}&lt;/span&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/LightBox&gt;</pre>
      </div>

      <LightBox
        ref="lightbox3"
        :media="media"
        :show-light-box="false"
      >
        <template #footer="{ current, total }">
          <div class="custom-footer">
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: (current / total * 100) + '%' }"></div>
            </div>
            <span class="progress-text">Image {{ current }} of {{ total }}</span>
          </div>
        </template>
      </LightBox>
    </div>

    <!-- Example 4: Custom Caption with Rich Metadata -->
    <div class="slot-demo">
      <div class="demo-header">
        <h3>4. Custom Caption with Rich Metadata</h3>
        <button class="open-button" @click="openExample4">Open Example</button>
      </div>
      <p class="demo-description">
        Use the <code>customCaption</code> slot to display rich metadata.
        The slot provides the <code>currentMedia</code> object.
      </p>
      <div class="code-snippet">
        <pre>&lt;LightBox :media="media"&gt;
  &lt;template #customCaption="{ currentMedia }"&gt;
    &lt;div class="rich-caption"&gt;
      &lt;h3&gt;{{ currentMedia.title }}&lt;/h3&gt;
      &lt;p&gt;📷 {{ currentMedia.camera }}&lt;/p&gt;
      &lt;p&gt;📍 {{ currentMedia.location }}&lt;/p&gt;
      &lt;p&gt;{{ currentMedia.description }}&lt;/p&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/LightBox&gt;</pre>
      </div>

      <LightBox
        ref="lightbox4"
        :media="media"
        :show-light-box="false"
      >
        <template #customCaption="{ currentMedia }">
          <div class="rich-caption">
            <h3 class="caption-title">{{ currentMedia.title }}</h3>
            <p class="caption-meta">📷 {{ currentMedia.camera }}</p>
            <p class="caption-meta">📍 {{ currentMedia.location }}</p>
            <p class="caption-description">{{ currentMedia.description }}</p>
          </div>
        </template>
      </LightBox>
    </div>

    <!-- Example 5: Custom Video Icon -->
    <div class="slot-demo">
      <div class="demo-header">
        <h3>5. Custom Video Icon</h3>
        <button class="open-button" @click="openExample5">Open Example</button>
      </div>
      <p class="demo-description">
        Use the <code>videoIcon</code> slot to customize the play icon overlay on video thumbnails.
      </p>
      <div class="code-snippet">
        <pre>&lt;LightBox :media="media"&gt;
  &lt;template #videoIcon&gt;
    &lt;div class="custom-play-icon"&gt;▶ PLAY VIDEO&lt;/div&gt;
  &lt;/template&gt;
&lt;/LightBox&gt;</pre>
      </div>

      <LightBox
        ref="lightbox5"
        :media="videoMedia"
        :show-light-box="false"
      >
        <template #videoIcon>
          <div class="custom-play-icon">▶ PLAY VIDEO</div>
        </template>
      </LightBox>
    </div>

    <!-- Example 6: All Slots Combined -->
    <div class="slot-demo">
      <div class="demo-header">
        <h3>6. All Slots Combined</h3>
        <button class="open-button" @click="openExample6">Open Example</button>
      </div>
      <p class="demo-description">
        You can use multiple slots together for a fully customized lightbox experience.
      </p>

      <LightBox
        ref="lightbox6"
        :media="media"
        :show-light-box="false"
      >
        <template #close>
          <span class="custom-close">✕ CLOSE</span>
        </template>
        <template #previous>
          <span class="custom-arrow">← BACK</span>
        </template>
        <template #next>
          <span class="custom-arrow">NEXT →</span>
        </template>
        <template #footer="{ current, total }">
          <div class="custom-footer">
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: (current / total * 100) + '%' }"></div>
            </div>
            <span class="progress-text">Image {{ current }} of {{ total }}</span>
          </div>
        </template>
        <template #customCaption="{ currentMedia }">
          <div class="rich-caption">
            <h3 class="caption-title">{{ currentMedia.title }}</h3>
            <p class="caption-meta">📷 {{ currentMedia.camera }} | 📍 {{ currentMedia.location }}</p>
            <p class="caption-description">{{ currentMedia.description }}</p>
          </div>
        </template>
      </LightBox>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LightBox from 'vue-it-bigger'
import { richMedia } from '../data/advancedMedia.js'

// Media data
const media = richMedia

// Video-only media for video icon demo
const videoMedia = richMedia.filter(item => item.type === 'video' || item.type === 'youtube')

// Lightbox refs
const lightbox1 = ref(null)
const lightbox2 = ref(null)
const lightbox3 = ref(null)
const lightbox4 = ref(null)
const lightbox5 = ref(null)
const lightbox6 = ref(null)

// Open example lightboxes
const openExample1 = () => lightbox1.value.showImage(0)
const openExample2 = () => lightbox2.value.showImage(0)
const openExample3 = () => lightbox3.value.showImage(0)
const openExample4 = () => lightbox4.value.showImage(2) // Open at image with rich metadata
const openExample5 = () => lightbox5.value.showImage(0) // Open at first video
const openExample6 = () => lightbox6.value.showImage(0)
</script>

<style scoped>
.slots-example {
  width: 100%;
}

.intro {
  background: #e7f3ff;
  padding: 15px 20px;
  border-radius: 6px;
  margin-bottom: 30px;
  border-left: 4px solid #0066cc;
}

.intro p {
  margin: 0;
  color: #004085;
}

/* Slot Demo Sections */
.slot-demo {
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.demo-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.open-button {
  padding: 8px 16px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.open-button:hover {
  background: #0052a3;
}

.demo-description {
  margin: 0 0 15px 0;
  color: #666;
  line-height: 1.6;
}

.demo-description code {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #e83e8c;
}

/* Code Snippets */
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
  line-height: 1.5;
  color: #333;
}

/* Custom Slot Styles */
:deep(.custom-close) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 1px;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

:deep(.custom-close:hover) {
  transform: scale(1.05);
}

:deep(.custom-arrow) {
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 2px;
  color: white;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 15px 25px;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

:deep(.custom-arrow:hover) {
  transform: scale(1.1);
}

:deep(.custom-footer) {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

:deep(.progress-bar-container) {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

:deep(.progress-bar) {
  height: 100%;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

:deep(.progress-text) {
  font-size: 16px;
  font-weight: 600;
  color: white;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

:deep(.rich-caption) {
  text-align: left;
  max-width: 600px;
  margin: 0 auto;
}

:deep(.caption-title) {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

:deep(.caption-meta) {
  margin: 5px 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

:deep(.caption-description) {
  margin: 10px 0 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

:deep(.custom-play-icon) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
  padding: 15px 25px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

/* Responsive */
@media (max-width: 768px) {
  .demo-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .open-button {
    width: 100%;
  }

  .code-snippet {
    overflow-x: scroll;
  }
}
</style>
