import { describe, test, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox.vue'

import { mediaWithOneImageWithType } from '../props'

describe('LightBox', () => {
  describe('given one image with type specified in the media array', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithType
        }
      })
    })

    test('the thumbnail does not have the video icon', () => {
      expect(wrapper.find('div.vib-thumbnail-active svg').exists()).toBe(false)
    })
  })
})