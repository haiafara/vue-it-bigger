import { mount } from '@vue/test-utils'
import CloseIcon from '@/CloseIcon'
import LeftArrowIcon from '@/LeftArrowIcon'
import RightArrowIcon from '@/RightArrowIcon'
import VideoIcon from '@/VideoIcon'

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

