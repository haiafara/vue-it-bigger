import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox.vue'

import { mediaWithOneVideoWithAutoplay } from '../props'

describe('LightBox', () => {
  describe('given one video with autoplay in the media array', () => {
    let wrapper

    const pauseStub = vi
      .spyOn(window.HTMLMediaElement.prototype, 'pause')
      .mockImplementation(() => {})
    const playStub = vi
      .spyOn(window.HTMLMediaElement.prototype, 'play')
      .mockImplementation(() => {})

    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneVideoWithAutoplay
        }
      })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    describe('showImage', () => {
      test('calls play on the video', () => {
        expect(playStub).toHaveBeenCalled()
      })
    })

    describe('closeLightBox', () => {
      test('calls pause on the video', async () => {
        wrapper.vm.closeLightBox()
        expect(pauseStub).toHaveBeenCalledTimes(1)
      })
    })
  })
})