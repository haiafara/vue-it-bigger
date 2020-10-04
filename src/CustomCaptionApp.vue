<template>
  <div
    id="custom-caption-app"
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
        ref="customCaptionLightbox"
        :media="media"
        :show-caption="true"
        :show-light-box="false"
      >
        <template v-slot:customCaption="slotProps">
          {{ slotProps.currentMedia.caption }}<br>
          There could be some description here.
        </template>
      </LightBox>
    </div>
  </div>
</template>

<script>
import LightBox from 'components/LightBox'

import media from './media'

export default {
  components: {
    LightBox,
  },

  data () {
    return {
      media,
    }
  },

  methods: {
    openGallery(index) {
      this.$refs.customCaptionLightbox.showImage(index)
    },
  }
}
</script>
