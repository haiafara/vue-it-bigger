import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox'

import { mediaWithOneVideoWithoutAutoplay } from '../props'

describe('LightBox', () => {
  describe('given one video without autoplay in the media array', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LightBox, {
        propsData: {
          media: mediaWithOneVideoWithoutAutoplay
        }
      })
    })

    afterEach(() => {
      wrapper.destroy()
    })

    test('renders one video element', () => {
      expect(wrapper.find('video').exists()).toBe(true)
    })

    test('renders one active thumbnail element', () => {
      expect(wrapper.find('div.vib-thumbnail-active').exists()).toBe(true)
    })

    test('the thumbnail has the video icon', () => {
      expect(wrapper.find('div.vib-thumbnail-active svg').exists()).toBe(true)
    })
  })
})