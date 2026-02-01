<template>
  <div @click.stop="closeLightBox">
    <transition
      mode="out-in"
      name="vib-container-transition"
      @afterEnter="enableImageTransition"
      @beforeLeave="disableImageTransition"
    >
      <div
        v-if="media && media.length > 0"
        v-show="lightBoxShown"
        ref="container"
        class="vib-container"
      >
        <div
          class="vib-content"
          @click.stop
        >
          <transition
            :name="imageTransitionName"
          >
            <img
              v-if="currentMedia.type == undefined || currentMedia.type == 'image'"
              :key="currentMedia.src"
              :src="currentMedia.src"
              :srcset="currentMedia.srcset || ''"
              class="vib-image"
              :alt="currentMedia.caption"
            >
            <video
              v-else-if="currentMedia.type == 'video'"
              :key="currentMedia.sources[0].src"
              ref="video"
              controls
              :width="currentMedia.width"
              :height="currentMedia.height"
              :autoplay="currentMedia.autoplay"
            >
              <source
                v-for="source in currentMedia.sources"
                :key="source.src"
                :src="source.src"
                :type="source.type"
              >
            </video>
          </transition>
        </div> <!-- .vib-content -->

        <!-- Persistent YouTube iframes - outside transition to preserve playback state -->
        <template
          v-for="(item, index) in media"
          :key="'youtube-' + index"
        >
          <transition :name="imageTransitionName">
            <div
              v-if="item.type === 'youtube' && visitedYoutubeIndices.has(index)"
              v-show="select === index"
              class="vib-content"
              style="position: absolute;"
              @click.stop
            >
              <div class="video-background">
                <iframe
                  :id="'youtube-player-' + index"
                  :src="'https://www.youtube.com/embed/' + item.id + '?enablejsapi=1&showinfo=0'"
                  width="560"
                  height="315"
                  frameborder="0"
                  allowfullscreen
                />
              </div>
            </div>
          </transition>
        </template>

        <div
          v-if="showThumbs"
          class="vib-thumbnail-wrapper vib-hideable"
          :class="{ 'vib-hidden': controlsHidden }"
          @click.stop
          @mouseover="interfaceHovered = true"
          @mouseleave="interfaceHovered = false"
        >
          <div
            v-for="(image, index) in imagesThumb"
            v-show="index >= thumbIndex.begin && index <= thumbIndex.end"
            :key="typeof image.thumb === 'string' ? `${image.thumb}${index}` : index"
            :style="{ backgroundImage: 'url(' + image.thumb + ')' }"
            :class="'vib-thumbnail' + (select === index ? '-active' : '')"
            @click.stop="showImage(index)"
          >
            <slot
              v-if="image.type == 'video' || image.type == 'youtube'"
              name="videoIcon"
            >
              <VideoIcon />
            </slot>
          </div>
        </div> <!-- .vib-thumbnail-wrapper -->

        <div
          class="vib-footer vib-hideable"
          :class="{ 'vib-hidden': controlsHidden }"
          @mouseover="interfaceHovered = true"
          @mouseleave="interfaceHovered = false"
        >
          <slot
            name="customCaption"
            :current-media="currentMedia"
          >
            <div
              v-show="showCaption"
              v-html="currentMedia.caption"
            />
          </slot>

          <div class="vib-footer-count">
            <slot
              name="footer"
              :current="select + 1"
              :total="media.length"
            >
              {{ select + 1 }} / {{ media.length }}
            </slot>
          </div>
        </div>

        <button
          v-if="closable"
          type="button"
          :title="closeText"
          class="vib-close vib-hideable"
          :class="{ 'vib-hidden': controlsHidden }"
          @mouseover="interfaceHovered = true"
          @mouseleave="interfaceHovered = false"
        >
          <slot name="close">
            <CloseIcon />
          </slot>
        </button>

        <button
          v-if="media.length > 1"
          type="button"
          class="vib-arrow vib-arrow-left vib-hideable"
          :class="{ 'vib-hidden': controlsHidden }"
          :title="previousText"
          @click.stop="previousImage()"
          @mouseover="interfaceHovered = true"
          @mouseleave="interfaceHovered = false"
        >
          <slot name="previous">
            <LeftArrowIcon />
          </slot>
        </button>

        <button
          v-if="media.length > 1"
          type="button"
          class="vib-arrow vib-arrow-right vib-hideable"
          :class="{ 'vib-hidden': controlsHidden }"
          :title="nextText"
          @click.stop="nextImage()"
          @mouseover="interfaceHovered = true"
          @mouseleave="interfaceHovered = false"
        >
          <slot name="next">
            <RightArrowIcon />
          </slot>
        </button>
      </div> <!-- .vib-container -->
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import LeftArrowIcon from './LeftArrowIcon.vue'
import RightArrowIcon from './RightArrowIcon.vue'
import CloseIcon from './CloseIcon.vue'
import VideoIcon from './VideoIcon.vue'

import { useNavigation } from '../composables/useNavigation.js'
import { useUIControls } from '../composables/useUIControls.js'
import { useTouchSwipe } from '../composables/useTouchSwipe.js'
import { useYouTube } from '../composables/useYouTube.js'
import { useLightboxLifecycle } from '../composables/useLightboxLifecycle.js'

const props = defineProps({
  media: {
    type: Array,
    required: true,
  },

  disableScroll: {
    type: Boolean,
    default: true,
  },

  showLightBox: {
    type: Boolean,
    default: true,
  },

  closable: {
    type: Boolean,
    default: true,
  },

  startAt: {
    type: Number,
    default: 0,
  },

  nThumbs: {
    type: Number,
    default: 7,
  },

  showThumbs: {
    type: Boolean,
    default: true,
  },

  autoPlay: {
    type: Boolean,
    default: false,
  },

  autoPlayTime: {
    type: Number,
    default: 3000,
  },

  interfaceHideTime: {
    type: Number,
    default: 3000,
  },

  showCaption: {
    type: Boolean,
    default: false,
  },

  lengthToLoadMore: {
    type: Number,
    default: 0,
  },

  closeText: {
    type: String,
    default: 'Close (Esc)',
  },

  previousText: {
    type: String,
    default: 'Previous',
  },

  nextText: {
    type: String,
    default: 'Next',
  },
})

const emit = defineEmits([
  'onImageChanged',
  'onLoad',
  'onLastIndex',
  'onFirstIndex',
  'onStartIndex',
  'onOpened',
  'onClosed',
])

// Template refs
const container = ref(null)
const video = ref(null)

// --- Composables (order matters for dependencies) ---

const {
  select,
  imageTransitionName,
  currentMedia,
  thumbIndex,
  imagesThumb,
  showImage: navShowImage,
  nextImage,
  previousImage,
  enableImageTransition: navEnableImageTransition,
  disableImageTransition,
  preloadAdjacentImages,
} = useNavigation(props)

const {
  controlsHidden,
  interfaceHovered,
  handleMouseActivity,
  clearInteraction,
} = useUIControls(props)

const { handleTouchStart, handleTouchEnd } = useTouchSwipe(nextImage, previousImage)

const {
  visitedYoutubeIndices,
  initYouTubePlayer,
  pauseYouTubeVideo,
  markVisited,
  cleanupYouTubePlayers,
} = useYouTube(props, select)

// Keyboard handler — defined here because it calls across composable boundaries
function addKeyEvent(event) {
  switch (event.key) {
    case 'ArrowLeft':
      previousImage()
      break
    case 'ArrowRight':
      nextImage()
      break
    case 'Escape':
      closeLightBox()
      break
  }
}

const {
  lightBoxShown,
  closeLightBox,
  onToggleLightBox,
} = useLightboxLifecycle(
  props, emit, video,
  pauseYouTubeVideo, preloadAdjacentImages, addKeyEvent
)

// Wrapped showImage — adds cross-composable side effects
function showImage(index) {
  navShowImage(index)
  controlsHidden.value = false
  lightBoxShown.value = true
}

// Wrapped enableImageTransition — triggers mouse activity first
function enableImageTransition() {
  handleMouseActivity()
  navEnableImageTransition()
}

// --- Watchers ---

watch(lightBoxShown, (value) => {
  // istanbul ignore else
  if (document != null) {
    onToggleLightBox(value)
  }
})

watch(select, (newVal, oldVal) => {
  emit('onImageChanged', select.value)

  if (select.value >= props.media.length - props.lengthToLoadMore - 1)
    emit('onLoad')

  if (select.value === props.media.length - 1)
    emit('onLastIndex')

  if (select.value === 0)
    emit('onFirstIndex')

  if (select.value === props.startAt)
    emit('onStartIndex')

  preloadAdjacentImages()

  // Pause the YouTube video we are navigating away from
  if (props.media[oldVal] && props.media[oldVal].type === 'youtube') {
    pauseYouTubeVideo(oldVal)
  }

  // Initialize YouTube player when switching to a YouTube video
  if (props.media[select.value] && props.media[select.value].type === 'youtube') {
    markVisited(select.value)
    nextTick(() => {
      initYouTubePlayer(select.value)
    })
  }
})

// --- Lifecycle ---

let timer = null

onMounted(() => {
  if (props.autoPlay) {
    timer = setInterval(nextImage, props.autoPlayTime)
  }

  onToggleLightBox(lightBoxShown.value)

  if (container.value) {
    container.value.addEventListener('touchstart', handleTouchStart)
    container.value.addEventListener('touchend', handleTouchEnd)
    container.value.addEventListener('mousedown', handleMouseActivity)
    container.value.addEventListener('mousemove', handleMouseActivity)
    container.value.addEventListener('touchmove', handleMouseActivity)
  }

  // Initialize YouTube player if initial media is a YouTube video
  if (props.media[select.value] && props.media[select.value].type === 'youtube') {
    markVisited(select.value)
    nextTick(() => {
      initYouTubePlayer(select.value)
    })
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', addKeyEvent)

  if (props.autoPlay) {
    clearInterval(timer)
  }

  if (container.value) {
    container.value.removeEventListener('mousedown', handleMouseActivity)
    container.value.removeEventListener('mousemove', handleMouseActivity)
    container.value.removeEventListener('touchmove', handleMouseActivity)
    container.value.removeEventListener('touchstart', handleTouchStart)
    container.value.removeEventListener('touchend', handleTouchEnd)
  }

  cleanupYouTubePlayers()
  clearInteraction()
})

// Expose for external callers (e.g. this.$refs.lightbox.showImage(index))
defineExpose({
  showImage,
  enableImageTransition,
  disableImageTransition,
  handleMouseActivity,
  preloadAdjacentImages,
  imageTransitionName,
})
</script>

<style src="./style.css">
</style>
