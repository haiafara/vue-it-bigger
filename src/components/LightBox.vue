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
            mode="out-in"
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
                :src="'https://www.youtube.com/embed/' + media[select].id + '?showinfo=0'"
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
            :currentMedia="currentMedia"
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
import LeftArrowIcon from './LeftArrowIcon'
import RightArrowIcon from './RightArrowIcon'
import CloseIcon from './CloseIcon'
import VideoIcon from './VideoIcon'

let Hammer

// istanbul ignore else
if (typeof window !== 'undefined') {
  Hammer = require('hammerjs')
}

export default {
  components: {
    LeftArrowIcon,
    RightArrowIcon,
    CloseIcon,
    VideoIcon,
  },

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
      imageTransitionName: 'vib-image-no-transition',
      timer: null,
      interactionTimer: null,
      interfaceHovered: false,
    }
  },

  computed: {
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
    },
  },

  mounted() {
    if (this.autoPlay) {
      this.timer = setInterval(this.nextImage, this.autoPlayTime)
    }

    this.onToggleLightBox(this.lightBoxShown)

    if (this.$refs.container) {
      const hammer = new Hammer(this.$refs.container)

      hammer.on('swiperight', this.previousImage)
      hammer.on('swipeleft', this.nextImage)

      this.$refs.container.addEventListener('mousedown', this.handleMouseActivity);
      this.$refs.container.addEventListener('mousemove', this.handleMouseActivity);
      this.$refs.container.addEventListener('touchmove', this.handleMouseActivity);
    }
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.addKeyEvent)

    if (this.autoPlay) {
      clearInterval(this.timer)
    }

    if (this.$refs.container) {
      this.$refs.container.removeEventListener('mousedown', this.handleMouseActivity);
      this.$refs.container.removeEventListener('mousemove', this.handleMouseActivity);
      this.$refs.container.removeEventListener('touchmove', this.handleMouseActivity);
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
    },

    onToggleLightBox(value) {
      if (value) this.onLightBoxOpen()
      else this.onLightBoxClose()
    },

    showImage(index) {
      this.select = index
      this.controlsHidden = false
      this.lightBoxShown = true
    },

    addKeyEvent(event) {
      switch (event.keyCode) {
        case 37: // left arrow
          this.previousImage()
          break
        case 39: // right arrow
          this.nextImage()
          break
        case 27: // esc
          this.closeLightBox()
          break
      }
    },

    closeLightBox() {
      if (this.$refs.video)
        this.$refs.video.pause();
      if (!this.closable) return;
      this.$set(this, 'lightBoxShown', false)
    },

    nextImage() {
      this.$set(this, 'select', (this.select + 1) % this.media.length)
    },

    previousImage() {
      this.$set(this, 'select', (this.select + this.media.length - 1) % this.media.length)
    },

    enableImageTransition() {
      this.handleMouseActivity()
      this.imageTransitionName = 'vib-image-transition'
    },

    disableImageTransition() {
      this.imageTransitionName = 'vib-image-no-transition'
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
  },
}
</script>

<style src="./style.css">
</style>
