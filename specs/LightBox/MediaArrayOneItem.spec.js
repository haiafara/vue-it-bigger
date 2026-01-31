import { describe, test, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox.vue'

describe('LightBox', () => {
  describe('given one item in the media array', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: ['test']
        }
      })
    })

    test('does render the container div', () => {
      expect(wrapper.find('.vib-container').exists()).toBe(true)
    })
  })
})