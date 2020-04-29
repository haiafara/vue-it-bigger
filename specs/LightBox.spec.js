import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox'

describe('LightBox', () => {
  const wrapper = mount(LightBox, {
    propsData: {
      media: []
    }
  })

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
