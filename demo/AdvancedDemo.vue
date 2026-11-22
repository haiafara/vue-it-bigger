<template>
  <div class="advanced-demo">
    <!-- Tab Navigation -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Description -->
    <div class="tab-description">
      <p>{{ currentTab.description }}</p>
      <p class="source-link">
        <a
          :href="currentTab.sourceUrl"
          target="_blank"
        >View source code on GitHub →</a>
      </p>
    </div>

    <!-- Active Tab Content -->
    <div class="tab-content">
      <component :is="currentTab.component" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import InteractiveControlsExample from './components/InteractiveControlsExample.vue'
import EventMonitorExample from './components/EventMonitorExample.vue'
import SlotsExample from './components/SlotsExample.vue'
import LazyLoadingExample from './components/LazyLoadingExample.vue'
import ProgrammaticControlExample from './components/ProgrammaticControlExample.vue'

// Tab definitions with their components and metadata
const tabs = [
  {
    id: 'interactive',
    label: 'Interactive Controls',
    description: 'Toggle props in real-time to see how they affect the lightbox behavior. This example demonstrates all configurable props.',
    component: InteractiveControlsExample,
    sourceUrl: 'https://github.com/haiafara/vue-it-bigger/blob/master/demo/components/InteractiveControlsExample.vue'
  },
  {
    id: 'events',
    label: 'Event Monitoring',
    description: 'See all lightbox events in real-time. This example shows how to listen to and handle the 7 different events emitted by the component.',
    component: EventMonitorExample,
    sourceUrl: 'https://github.com/haiafara/vue-it-bigger/blob/master/demo/components/EventMonitorExample.vue'
  },
  {
    id: 'slots',
    label: 'Custom Slots',
    description: 'Customize the lightbox appearance using slots. This example demonstrates all 6 available slots with creative implementations.',
    component: SlotsExample,
    sourceUrl: 'https://github.com/haiafara/vue-it-bigger/blob/master/demo/components/SlotsExample.vue'
  },
  {
    id: 'lazy',
    label: 'Lazy Loading',
    description: 'Load media items progressively as users navigate. This example shows the lazy loading pattern using lengthToLoadMore and the onLoad event.',
    component: LazyLoadingExample,
    sourceUrl: 'https://github.com/haiafara/vue-it-bigger/blob/master/demo/components/LazyLoadingExample.vue'
  },
  {
    id: 'programmatic',
    label: 'Programmatic Control',
    description: 'Control the lightbox programmatically using methods. This example shows how to use showImage(), nextImage(), previousImage(), and closeLightBox().',
    component: ProgrammaticControlExample,
    sourceUrl: 'https://github.com/haiafara/vue-it-bigger/blob/master/demo/components/ProgrammaticControlExample.vue'
  }
]

// Active tab state
const activeTab = ref('interactive')

// Current tab computed property
const currentTab = computed(() => {
  return tabs.find(tab => tab.id === activeTab.value)
})
</script>

<style scoped>
.advanced-demo {
  width: 100%;
}

/* Tab Navigation */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e5e5e5;
  flex-wrap: wrap;
}

.tabs button {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
  margin-bottom: -2px;
}

.tabs button:hover {
  color: #0066cc;
  background-color: #f5f5f5;
}

.tabs button.active {
  color: #0066cc;
  border-bottom-color: #0066cc;
}

/* Tab Description */
.tab-description {
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 6px;
  margin-bottom: 30px;
  border-left: 4px solid #0066cc;
}

.tab-description p {
  margin: 0 0 10px 0;
  color: #333;
}

.tab-description p:last-child {
  margin-bottom: 0;
}

.source-link {
  font-size: 14px;
}

.source-link a {
  color: #0066cc;
  font-weight: 500;
}

/* Tab Content */
.tab-content {
  min-height: 400px;
}

/* Responsive */
@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
    border-bottom: none;
  }

  .tabs button {
    border-bottom: none;
    border-left: 3px solid transparent;
    margin-bottom: 0;
    text-align: left;
  }

  .tabs button.active {
    border-left-color: #0066cc;
    border-bottom-color: transparent;
  }
}
</style>
