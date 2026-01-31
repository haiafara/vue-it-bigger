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
            <div
              v-else-if="media[select].type == 'youtube'"
              class="video-background"
            >
              <iframe
                :id="'youtube-player-' + select"
                ref="youtubeIframe"
                :src="'https://www.youtube.com/embed/' + media[select].id + '?enablejsapi=1&showinfo=0'"
                width="560"
                height="315"
                frameborder="0"
                allowfullscreen
              />
            </div>
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

<script>
import LeftArrowIcon from './LeftArrowIcon.vue'
import RightArrowIcon from './RightArrowIcon.vue'
import CloseIcon from './CloseIcon.vue'
import VideoIcon from './VideoIcon.vue'

export default {
  components: {
    LeftArrowIcon,
    RightArrowIcon,
    CloseIcon,
    VideoIcon,
  },

  emits: [
    'onImageChanged',
    'onLoad',
    'onLastIndex',
    'onFirstIndex',
    'onStartIndex',
    'onOpened',
    'onClosed',
  ],

  props: {
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

    // Mode
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
      default: 0
    },

    closeText: {
      type: String,
      default: 'Close (Esc)'
    },

    previousText: {
      type: String,
      default: 'Previous',
    },

    nextText: {
      type: String,
      default: 'Next',
    },
  },

  data() {
    return {
      select: this.startAt,
      lightBoxShown: this.showLightBox,
      controlsHidden: false,
      imageTransitionsEnabled: false,
      slideDirection: 'next',
      timer: null,
      interactionTimer: null,
      interfaceHovered: false,
      touchStartX: 0,
      touchStartY: 0,
      youtubePlayer: null,
      youtubeApiLoaded: false,
    }
  },

  computed: {
    imageTransitionName() {
      if (!this.imageTransitionsEnabled) return 'vib-image-no-transition'
      return this.slideDirection === 'next'
        ? 'vib-image-slide-next'
        : 'vib-image-slide-prev'
    },

    currentMedia() {
      return this.media[this.select]
    },

    thumbIndex() {
      const halfDown = Math.floor(this.nThumbs / 2)

      if (this.select >= halfDown && this.select < this.media.length - halfDown)
        return {
          begin: this.select - halfDown + (1 - this.nThumbs % 2),
          end: this.select + halfDown,
        }

      if (this.select < halfDown)
        return {
          begin: 0,
          end: this.nThumbs - 1,
        }

      return {
        begin: this.media.length - this.nThumbs,
        end: this.media.length - 1,
      }
    },

    imagesThumb() {
      return this.media.map(({ thumb, type }) => ({ thumb, type }))
    },
  },

  watch: {
    lightBoxShown(value) {
      // istanbul ignore else
      if (document != null) {
        this.onToggleLightBox(value)
      }
    },

    select() {
      this.$emit('onImageChanged', this.select)

      if (this.select >= this.media.length - this.lengthToLoadMore - 1)
        this.$emit('onLoad')

      if (this.select === this.media.length - 1)
        this.$emit('onLastIndex')

      if (this.select === 0)
        this.$emit('onFirstIndex')

      if (this.select === this.startAt)
        this.$emit('onStartIndex')

      this.preloadAdjacentImages()

      // Initialize YouTube player when switching to a YouTube video
      if (this.media[this.select] && this.media[this.select].type === 'youtube') {
        this.$nextTick(() => {
          this.initYouTubePlayer()
        })
      }
    },
  },

  mounted() {
    if (this.autoPlay) {
      this.timer = setInterval(this.nextImage, this.autoPlayTime)
    }

    this.onToggleLightBox(this.lightBoxShown)

    if (this.$refs.container) {
      // Native touch event swipe detection
      this.$refs.container.addEventListener('touchstart', this.handleTouchStart);
      this.$refs.container.addEventListener('touchend', this.handleTouchEnd);
      this.$refs.container.addEventListener('mousedown', this.handleMouseActivity);
      this.$refs.container.addEventListener('mousemove', this.handleMouseActivity);
      this.$refs.container.addEventListener('touchmove', this.handleMouseActivity);
    }

    // Initialize YouTube player if initial media is a YouTube video
    if (this.media[this.select] && this.media[this.select].type === 'youtube') {
      this.$nextTick(() => {
        this.initYouTubePlayer()
      })
    }
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.addKeyEvent)

    if (this.autoPlay) {
      clearInterval(this.timer)
    }

    if (this.$refs.container) {
      this.$refs.container.removeEventListener('mousedown', this.handleMouseActivity);
      this.$refs.container.removeEventListener('mousemove', this.handleMouseActivity);
      this.$refs.container.removeEventListener('touchmove', this.handleMouseActivity);
      this.$refs.container.removeEventListener('touchstart', this.handleTouchStart);
      this.$refs.container.removeEventListener('touchend', this.handleTouchEnd);
    }

    // Clean up YouTube player
    if (this.youtubePlayer && typeof this.youtubePlayer.destroy === 'function') {
      this.youtubePlayer.destroy()
      this.youtubePlayer = null
    }
  },

  methods: {
    onLightBoxOpen() {
      this.$emit('onOpened')

      if (this.disableScroll) {
        document.querySelector('html').classList.add('no-scroll')
      }

      document.querySelector('body').classList.add('vib-open')
      document.addEventListener('keydown', this.addKeyEvent)

      if (this.$refs.video && this.$refs.video.autoplay) {
        this.$refs.video.play()
      }

      this.preloadAdjacentImages()
    },

    onLightBoxClose() {
      this.$emit('onClosed')

      if (this.disableScroll) {
        document.querySelector('html').classList.remove('no-scroll')
      }

      document.querySelector('body').classList.remove('vib-open')
      document.removeEventListener('keydown', this.addKeyEvent)

      if (this.$refs.video) {
        this.$refs.video.pause()
        this.$refs.video.currentTime = '0'
      }

      // Pause YouTube video when closing lightbox
      this.pauseYouTubeVideo()
    },

    onToggleLightBox(value) {
      if (value) this.onLightBoxOpen()
      else this.onLightBoxClose()
    },

    showImage(index) {
      this.slideDirection = index > this.select ? 'next' : 'prev'
      this.select = index
      this.controlsHidden = false
      this.lightBoxShown = true
    },

    addKeyEvent(event) {
      switch (event.key) {
        case 'ArrowLeft':
          this.previousImage()
          break
        case 'ArrowRight':
          this.nextImage()
          break
        case 'Escape':
          this.closeLightBox()
          break
      }
    },

    closeLightBox() {
      if (this.$refs.video)
        this.$refs.video.pause();
      // Pause YouTube video when closing lightbox
      this.pauseYouTubeVideo();
      if (!this.closable) return;
      this.lightBoxShown = false
    },

    nextImage() {
      this.slideDirection = 'next'
      this.select = (this.select + 1) % this.media.length
    },

    previousImage() {
      this.slideDirection = 'prev'
      this.select = (this.select + this.media.length - 1) % this.media.length
    },

    enableImageTransition() {
      this.handleMouseActivity()
      this.imageTransitionsEnabled = true
    },

    disableImageTransition() {
      this.imageTransitionsEnabled = false
    },

    handleMouseActivity() {
      clearTimeout(this.interactionTimer);

      if (this.controlsHidden) {
        this.controlsHidden = false
      }

      if (this.interfaceHovered) {
        this.stopInteractionTimer()
      } else {
        this.startInteractionTimer()
      }
    },

    startInteractionTimer() {
      this.interactionTimer = setTimeout(() => {
        this.controlsHidden = true
      }, this.interfaceHideTime)
    },

    stopInteractionTimer() {
      this.interactionTimer = null
    },

    preloadAdjacentImages() {
      const len = this.media.length
      if (len <= 1) return

      const nextIndex = (this.select + 1) % len
      const prevIndex = (this.select + len - 1) % len

      ;[nextIndex, prevIndex].forEach(index => {
        const item = this.media[index]
        if (item.type === undefined || item.type === 'image') {
          const img = new Image()
          img.src = item.src
          if (item.srcset) {
            img.srcset = item.srcset
          }
        }
      })
    },

    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX
      this.touchStartY = event.touches[0].clientY
    },

    handleTouchEnd(event) {
      const touchEndX = event.changedTouches[0].clientX
      const touchEndY = event.changedTouches[0].clientY
      const deltaX = touchEndX - this.touchStartX
      const deltaY = touchEndY - this.touchStartY

      // Detect horizontal swipe (more horizontal than vertical movement)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.previousImage()
        } else {
          this.nextImage()
        }
      }
    },

    loadYouTubeApi() {
      if (this.youtubeApiLoaded) return

      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

      // Set up global callback for YouTube API
      window.onYouTubeIframeAPIReady = () => {
        this.youtubeApiLoaded = true
        this.initYouTubePlayer()
      }
    },

    initYouTubePlayer() {
      if (!this.media[this.select] || this.media[this.select].type !== 'youtube') {
        return
      }

      const iframeId = 'youtube-player-' + this.select
      const iframe = document.getElementById(iframeId)

      if (!iframe) return

      // If API is not loaded yet, load it
      if (!window.YT || !window.YT.Player) {
        this.loadYouTubeApi()
        return
      }

      // Create new player instance
      if (this.youtubePlayer) {
        this.youtubePlayer.destroy()
      }

      this.youtubePlayer = new window.YT.Player(iframeId, {
        events: {
          onReady: () => {
            // Player is ready
          },
          onError: () => {
            // YouTube player error
          },
        },
      })
    },

    pauseYouTubeVideo() {
      if (this.youtubePlayer && typeof this.youtubePlayer.pauseVideo === 'function') {
        try {
          this.youtubePlayer.pauseVideo()
        } catch {
          // Error pausing YouTube video
        }
      }
    },
  },
}
</script>

<style src="./style.css">
</style>
