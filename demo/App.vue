<template>
  <div
    id="app"
  >
    <div>
      <ul
        style="margin: 0; padding: 0"
      >
        <li
          v-for="(image, index) in media"
          :key="index"
          style="display: inline-block; margin: 0 5px 5px 0"
        >
          <img
            :src="image.thumb"
            style="height: 100px; cursor: pointer"
            @click="openGallery(index)"
          >
        </li>
      </ul>

      <LightBox
        ref="lightbox"
        :media="media"
        :show-caption="true"
        :show-light-box="false"
      />
    </div>
  </div>
</template>

<script>
import LightBox from 'vue-it-bigger'

import media from './media'
import packageJson from '../package.json'

export default {
  components: {
    LightBox,
  },

  data () {
    return {
      media,
      version: packageJson.version,
    }
  },

  mounted() {
    // Update footer with version
    const footer = document.getElementById('footer')
    if (footer) {
      footer.innerHTML = `All images by <a href="https://photos.rusiczki.net">János Rusiczki</a>.<br>Using vue-it-bigger v${this.version}.`
    }
  },

  methods: {
    openGallery(index) {
      this.$refs.lightbox.showImage(index)
    }
  }
}
</script>
