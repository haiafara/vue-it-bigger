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
        :style="{ '--vib-z-index': zIndex }"
        @mousedown="handleMouseActivity"
        @mousemove="handleMouseActivity"
        @touchmove="handleMouseActivity"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <div
          class="vib-content"
          @click.stop
          @wheel="handleWheel"
        >
          <transition :name="imageTransitionName">
            <div
              v-if="
                currentMedia.type == undefined || currentMedia.type == 'image'
              "
              :key="currentMedia.src"
              class="vib-image-container"
            >
              <div
                ref="zoomTarget"
                class="vib-image-zoom"
                :class="{ 'vib-zoomed': isZoomed, 'vib-panning': isPanning }"
                :style="transformStyle"
                @mousedown="handleMouseDown"
                @touchstart="handleZoomTouchStart"
                @touchmove="handleZoomTouchMove"
                @touchend="handleZoomTouchEnd"
                @touchcancel="handleZoomTouchEnd"
              >
                <img
                  :src="currentMedia.src"
                  :srcset="currentMedia.srcset || ''"
                  class="vib-image"
                  :alt="currentMedia.caption"
                  draggable="false"
                >
                <div class="vib-image-overlay">
                  <slot
                    name="imageOverlay"
                    :current-media="currentMedia"
                    :index="select"
                  />
                </div>
              </div>
            </div>
            <video
              v-else-if="currentMedia.type == 'video'"
              :key="currentMedia.sources[0].src"
              ref="video"
              controls
              :width="currentMedia.width"
              :height="currentMedia.height"
              :autoplay="currentMedia.autoplay"
              controlslist="nofullscreen"
            >
              <source
                v-for="source in currentMedia.sources"
                :key="source.src"
                :src="source.src"
                :type="source.type"
              >
            </video>
          </transition>
        </div>
        <!-- .vib-content -->

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
              style="position: absolute"
              @click.stop
            >
              <div class="video-background">
                <iframe
                  :id="'youtube-player-' + index"
                  :src="
                    'https://www.youtube.com/embed/' +
                      item.id +
                      '?enablejsapi=1&showinfo=0'
                  "
                  width="560"
                  height="315"
                  frameborder="0"
                  allowfullscreen
                />
              </div>
            </div>
          </transition>
        </template>

        <!-- Background for the row of controls, only shown on narrow screens -->
        <div
          class="vib-topbar vib-hideable"
          :class="{ 'vib-hidden': controlsHidden }"
          @click.stop
          @mouseover="interfaceHovered = true"
          @mouseleave="interfaceHovered = false"
        />

        <div
          v-if="showThumbs"
          class="vib-thumbnail-wrapper vib-hideable"
          :class="{ 'vib-hidden': controlsHidden }"
          :style="thumbStyle"
          @click.stop
          @mouseover="interfaceHovered = true"
          @mouseleave="interfaceHovered = false"
        >
          <div class="vib-thumbnail-viewport">
            <div class="vib-thumbnail-track">
              <div
                v-for="item in renderedThumbs"
                :key="
                  typeof item.thumb === 'string'
                    ? `${item.thumb}${item.index}`
                    : item.index
                "
                :style="{
                  '--vib-thumb-i': item.index,
                  backgroundImage: 'url(' + item.thumb + ')',
                }"
                :class="'vib-thumbnail' + (select === item.index ? '-active' : '')"
                @click.stop="showImage(item.index)"
              >
                <slot
                  v-if="item.type == 'video' || item.type == 'youtube'"
                  name="videoIcon"
                >
                  <VideoIcon />
                </slot>
              </div>
            </div>
          </div>
        </div>
        <!-- .vib-thumbnail-wrapper -->

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

        <div
          v-if="canZoom || isFullscreenSupported"
          class="vib-toolbar vib-hideable"
          :class="{ 'vib-hidden': controlsHidden }"
          @click.stop
          @mouseover="interfaceHovered = true"
          @mouseleave="interfaceHovered = false"
        >
          <button
            v-if="isFullscreenSupported"
            type="button"
            class="vib-toolbar-button vib-fullscreen"
            :title="isFullscreen ? exitFullscreenText : enterFullscreenText"
            @click.stop="toggleFullscreen()"
          >
            <slot
              v-if="isFullscreen"
              name="exitFullscreen"
            >
              <FullscreenExitIcon />
            </slot>
            <slot
              v-else
              name="enterFullscreen"
            >
              <FullscreenEnterIcon />
            </slot>
          </button>
          <template v-if="canZoom">
            <button
              type="button"
              class="vib-toolbar-button vib-zoom-in"
              :title="zoomInText"
              :disabled="isMaxZoom"
              @click.stop="zoomIn()"
            >
              <slot name="zoomIn">
                <ZoomInIcon />
              </slot>
            </button>
            <button
              type="button"
              class="vib-toolbar-button vib-zoom-out"
              :title="zoomOutText"
              :disabled="!isZoomed"
              @click.stop="zoomOut()"
            >
              <slot name="zoomOut">
                <ZoomOutIcon />
              </slot>
            </button>
          </template>
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
          v-if="media.length > 1 && canGoPrevious"
          type="button"
          class="vib-arrow vib-arrow-left vib-hideable"
          :class="{ 'vib-hidden': controlsHidden }"
          :title="previousText"
          @click.stop="previousImage()"
          @mouseover="interfaceHovered = true"
          @mouseleave="interfaceHovered = false"
          @vue:unmounted="interfaceHovered = false"
        >
          <slot name="previous">
            <LeftArrowIcon />
          </slot>
        </button>

        <button
          v-if="media.length > 1 && canGoNext"
          type="button"
          class="vib-arrow vib-arrow-right vib-hideable"
          :class="{ 'vib-hidden': controlsHidden }"
          :title="nextText"
          @click.stop="nextImage()"
          @mouseover="interfaceHovered = true"
          @mouseleave="interfaceHovered = false"
          @vue:unmounted="interfaceHovered = false"
        >
          <slot name="next">
            <RightArrowIcon />
          </slot>
        </button>
      </div>
      <!-- .vib-container -->
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import LeftArrowIcon from "./LeftArrowIcon.vue";
import RightArrowIcon from "./RightArrowIcon.vue";
import CloseIcon from "./CloseIcon.vue";
import VideoIcon from "./VideoIcon.vue";
import ZoomInIcon from "./ZoomInIcon.vue";
import ZoomOutIcon from "./ZoomOutIcon.vue";
import FullscreenEnterIcon from "./FullscreenEnterIcon.vue";
import FullscreenExitIcon from "./FullscreenExitIcon.vue";

import { useNavigation } from "../composables/useNavigation.js";
import { useUIControls } from "../composables/useUIControls.js";
import { useTouchSwipe } from "../composables/useTouchSwipe.js";
import { useZoom } from "../composables/useZoom.js";
import { useThumbnails } from "../composables/useThumbnails.js";
import { useFullscreen } from "../composables/useFullscreen.js";
import { useYouTube } from "../composables/useYouTube.js";
import { useLightboxLifecycle } from "../composables/useLightboxLifecycle.js";

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

  allowLoop: {
    type: Boolean,
    default: true,
  },

  zIndex: {
    type: Number,
    default: undefined,
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
    default: "Close (Esc)",
  },

  previousText: {
    type: String,
    default: "Previous",
  },

  nextText: {
    type: String,
    default: "Next",
  },

  zoomable: {
    type: Boolean,
    default: true,
  },

  maxZoom: {
    type: Number,
    default: 4,
  },

  zoomInText: {
    type: String,
    default: "Zoom in",
  },

  zoomOutText: {
    type: String,
    default: "Zoom out",
  },

  fullscreenable: {
    type: Boolean,
    default: true,
  },

  enterFullscreenText: {
    type: String,
    default: "Enter full screen (F)",
  },

  exitFullscreenText: {
    type: String,
    default: "Exit full screen (F)",
  },
});

const emit = defineEmits([
  "onImageChanged",
  "onLoad",
  "onLastIndex",
  "onFirstIndex",
  "onStartIndex",
  "onOpened",
  "onClosed",
  "onFullscreenChange",
]);

// Template refs
const container = ref(null);
const video = ref(null);
const zoomTarget = ref(null);

// --- Composables (order matters for dependencies) ---

const {
  select,
  imageTransitionName,
  currentMedia,
  canGoPrevious,
  canGoNext,
  imagesThumb,
  showImage: navShowImage,
  nextImage,
  previousImage,
  enableImageTransition: navEnableImageTransition,
  disableImageTransition,
  preloadAdjacentImages,
} = useNavigation(props);

const { renderedThumbs, thumbStyle } = useThumbnails(props, select, imagesThumb);

const {
  controlsHidden,
  interfaceHovered,
  handleMouseActivity,
  clearInteraction,
} = useUIControls(props);

const {
  isZoomed,
  isMaxZoom,
  isPanning,
  canZoom,
  transformStyle,
  zoomIn,
  zoomOut,
  resetZoom,
  handleWheel,
  handleMouseDown,
  handleZoomTouchStart,
  handleZoomTouchMove,
  handleZoomTouchEnd,
} = useZoom(props, currentMedia, zoomTarget);

const {
  isFullscreen,
  isSupported: isFullscreenSupported,
  exitFullscreen,
  toggleFullscreen,
} = useFullscreen(props, emit, container);

const { handleTouchStart, handleTouchEnd } = useTouchSwipe(
  nextImage,
  previousImage,
  () => isZoomed.value,
);

const {
  visitedYoutubeIndices,
  initYouTubePlayer,
  pauseYouTubeVideo,
  markVisited,
  cleanupYouTubePlayers,
} = useYouTube(props, select);

// Keyboard handler — defined here because it calls across composable boundaries
function addKeyEvent(event) {
  switch (event.key) {
    case "ArrowLeft":
      previousImage();
      break;
    case "ArrowRight":
      nextImage();
      break;
    case "Escape":
      closeLightBox();
      break;
    case "+":
    case "=":
      zoomIn();
      break;
    case "-":
      zoomOut();
      break;
    case "0":
      if (canZoom.value) resetZoom();
      break;
    case "f":
    case "F":
      toggleFullscreen();
      break;
  }
}

const {
  lightBoxShown,
  closeLightBox,
  onToggleLightBox,
  releasePage,
} = useLightboxLifecycle(
  props,
  emit,
  video,
  pauseYouTubeVideo,
  preloadAdjacentImages,
  addKeyEvent,
);

// Wrapped showImage — adds cross-composable side effects
function showImage(index) {
  navShowImage(index);
  controlsHidden.value = false;
  lightBoxShown.value = true;
}

// Wrapped enableImageTransition — triggers mouse activity first
function enableImageTransition() {
  handleMouseActivity();
  navEnableImageTransition();
}

// --- Watchers ---

watch(lightBoxShown, (value) => {
  if (!value) {
    resetZoom();
    exitFullscreen();
  }
  // istanbul ignore else
  if (document != null) {
    onToggleLightBox(value);
  }
});

watch(select, (newVal, oldVal) => {
  resetZoom();
  emit("onImageChanged", select.value);

  if (select.value >= props.media.length - props.lengthToLoadMore - 1)
    emit("onLoad");

  if (select.value === props.media.length - 1) emit("onLastIndex");

  if (select.value === 0) emit("onFirstIndex");

  if (select.value === props.startAt) emit("onStartIndex");

  preloadAdjacentImages();

  // Pause the YouTube video we are navigating away from
  if (props.media[oldVal] && props.media[oldVal].type === "youtube") {
    pauseYouTubeVideo(oldVal);
  }

  // Initialize YouTube player when switching to a YouTube video
  if (
    props.media[select.value] &&
    props.media[select.value].type === "youtube"
  ) {
    markVisited(select.value);
    nextTick(() => {
      initYouTubePlayer(select.value);
    });
  }
});

// --- Lifecycle ---

let timer = null;

onMounted(() => {
  if (props.autoPlay) {
    timer = setInterval(nextImage, props.autoPlayTime);
  }

  onToggleLightBox(lightBoxShown.value);

  // Initialize YouTube player if initial media is a YouTube video
  if (
    props.media[select.value] &&
    props.media[select.value].type === "youtube"
  ) {
    markVisited(select.value);
    nextTick(() => {
      initYouTubePlayer(select.value);
    });
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", addKeyEvent);

  // The component can be destroyed while open (e.g. navigating away); make
  // sure the page doesn't stay locked
  if (lightBoxShown.value) releasePage();

  if (props.autoPlay) {
    clearInterval(timer);
  }

  cleanupYouTubePlayers();
  clearInteraction();
});

// Expose for external callers (e.g. this.$refs.lightbox.showImage(index))
defineExpose({
  showImage,
  enableImageTransition,
  disableImageTransition,
  handleMouseActivity,
  preloadAdjacentImages,
  imageTransitionName,
  zoomIn,
  zoomOut,
  resetZoom,
  toggleFullscreen,
});
</script>

<style src="./style.css"></style>
