import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox'

describe('LightBox', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(LightBox, {
      propsData: {
        media: []
      }
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
