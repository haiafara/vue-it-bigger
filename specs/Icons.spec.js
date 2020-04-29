import { mount } from '@vue/test-utils'
import CloseIcon from '@/CloseIcon'
import LeftArrowIcon from '@/LeftArrowIcon'
import RightArrowIcon from '@/RightArrowIcon'
import VideoIcon from '@/VideoIcon'

describe('CloseIcon', () => {
  const wrapper = mount(CloseIcon)

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders a svg element', () => {
    expect(wrapper.contains('svg')).toBe(true)
  })
})

describe('LeftArrowIcon', () => {
  const wrapper = mount(LeftArrowIcon)

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders a svg element', () => {
    expect(wrapper.contains('svg')).toBe(true)
  })
})

describe('RightArrowIcon', () => {
  const wrapper = mount(RightArrowIcon)

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders a svg element', () => {
    expect(wrapper.contains('svg')).toBe(true)
  })
})

describe('VideoIcon', () => {
  const wrapper = mount(VideoIcon)

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders a svg element', () => {
    expect(wrapper.contains('svg')).toBe(true)
  })
})

