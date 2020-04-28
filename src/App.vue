<template>
  <div
    id="app"
    style="background-color: yellow; padding: 0; margin: 0"
    class="row"
  >
    <div>
      <ul
        style="margin: 5px 0 0 5px; padding: 0"
      >
        <li
          v-for="(image, index) in media"
          :key="index"
          style="display: inline-block; margin: 0 5px 5px 0"
        >
          <img
            :src="image.thumb"
            style="height: 100px"
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
import LightBox from 'components/LightBox'

import siteLoading from './siteloading.gif'
import media from './dummy'

export default {
  components: {
    LightBox,
  },

  data () {
    return {
      media,
      siteLoading,
    }
  },

  methods: {
    openGallery(index) {
      this.$refs.lightbox.showImage(index)
    }
  }
}
</script>
