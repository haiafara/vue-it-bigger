import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CloseIcon from '@/CloseIcon.vue'
import LeftArrowIcon from '@/LeftArrowIcon.vue'
import RightArrowIcon from '@/RightArrowIcon.vue'
import VideoIcon from '@/VideoIcon.vue'

describe('CloseIcon', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(CloseIcon)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('renders a svg element', () => {
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})

describe('LeftArrowIcon', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(LeftArrowIcon)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('renders a svg element', () => {
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})

describe('RightArrowIcon', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(RightArrowIcon)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('renders a svg element', () => {
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})

describe('VideoIcon', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(VideoIcon)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('renders a svg element', () => {
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
