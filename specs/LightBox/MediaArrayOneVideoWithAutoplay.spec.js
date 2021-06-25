import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox'

import { mediaWithOneVideoWithAutoplay } from '../props'

describe('LightBox', () => {
  describe('given one video with autoplay in the media array', () => {
    let wrapper

    const pauseStub = jest
      .spyOn(window.HTMLMediaElement.prototype, 'pause')
      .mockImplementation(() => {})
    const playStub = jest
      .spyOn(window.HTMLMediaElement.prototype, 'play')
      .mockImplementation(() => {})

    beforeEach(() => {
      wrapper = mount(LightBox, {
        propsData: {
          media: mediaWithOneVideoWithAutoplay
        }
      })
    })

    afterEach(() => {
      wrapper.destroy()
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