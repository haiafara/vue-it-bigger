import { mount } from '@vue/test-utils'
import CloseIcon from '@/CloseIcon.vue'
import LeftArrowIcon from '@/LeftArrowIcon.vue'
import RightArrowIcon from '@/RightArrowIcon.vue'
import VideoIcon from '@/VideoIcon.vue'

describe('CloseIcon', () => {
  const wrapper = mount(CloseIcon)

  test('renders a svg element', () => {
    expect(wrapper.get('svg').exists()).toBe(true)
  })
})

describe('LeftArrowIcon', () => {
  const wrapper = mount(LeftArrowIcon)

  test('renders a svg element', () => {
    expect(wrapper.get('svg').exists()).toBe(true)
  })
})

describe('RightArrowIcon', () => {
  const wrapper = mount(RightArrowIcon)

  test('renders a svg element', () => {
    expect(wrapper.get('svg').exists()).toBe(true)
  })
})

describe('VideoIcon', () => {
  const wrapper = mount(VideoIcon)

  test('renders a svg element', () => {
    expect(wrapper.get('svg').exists()).toBe(true)
  })
})

