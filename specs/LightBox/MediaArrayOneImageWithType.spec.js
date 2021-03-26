import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox'

import { mediaWithOneImageWithType } from '../props'

describe('LightBox', () => {
  describe('given one image with type specified in the media array', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LightBox, {
        propsData: {
          media: mediaWithOneImageWithType
        }
      })
    })

    test('the thumbnail does not have the video icon', () => {
      expect(wrapper.find('div.vib-thumbnail-active svg').exists()).toBe(false)
    })
  })
})