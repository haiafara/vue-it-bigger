import { describe, test, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox.vue'

import {
  mediaWithNineImages,
  mediaWithOneImageWithoutType,
  mediaWithTwoImagesWithType
} from '../fixtures'

describe('LightBox - allowLoop', () => {
  let wrapper

  function mountBox(props = {}) {
    wrapper = mount(LightBox, {
      props: { media: mediaWithNineImages, ...props }
    })
    return wrapper
  }

  const currentSrc = () => wrapper.find('img.vib-image').attributes('src')
  const press = (key) => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key }))
    return wrapper.vm.$nextTick()
  }
  async function swipe(fromX, toX) {
    const container = wrapper.find('.vib-container')
    await container.trigger('touchstart', { touches: [{ clientX: fromX, clientY: 100 }] })
    await container.trigger('touchend', {
      touches: [],
      changedTouches: [{ clientX: toX, clientY: 100 }]
    })
  }

  afterEach(() => {
    wrapper.unmount()
    document.querySelector('html').classList.remove('no-scroll')
    document.querySelector('body').classList.remove('vib-open')
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('by default', () => {
    test('loops from the last media to the first and back', async () => {
      mountBox({ startAt: 8 })
      expect(wrapper.find('.vib-arrow-right').exists()).toBe(true)
      await press('ArrowRight')
      expect(currentSrc()).toBe(mediaWithNineImages[0].src)
      expect(wrapper.find('.vib-arrow-left').exists()).toBe(true)
      await press('ArrowLeft')
      expect(currentSrc()).toBe(mediaWithNineImages[8].src)
    })
  })

  describe('when disabled', () => {
    test('hides the previous control on the first media only', () => {
      mountBox({ allowLoop: false })
      expect(wrapper.find('.vib-arrow-left').exists()).toBe(false)
      expect(wrapper.find('.vib-arrow-right').exists()).toBe(true)
    })

    test('hides the next control on the last media only', () => {
      mountBox({ allowLoop: false, startAt: 8 })
      expect(wrapper.find('.vib-arrow-left').exists()).toBe(true)
      expect(wrapper.find('.vib-arrow-right').exists()).toBe(false)
    })

    test('shows both controls in the middle', () => {
      mountBox({ allowLoop: false, startAt: 4 })
      expect(wrapper.find('.vib-arrow-left').exists()).toBe(true)
      expect(wrapper.find('.vib-arrow-right').exists()).toBe(true)
    })

    test('shows no controls for a single media', () => {
      mountBox({ allowLoop: false, media: mediaWithOneImageWithoutType })
      expect(wrapper.find('.vib-arrow').exists()).toBe(false)
    })

    test('the controls update while navigating', async () => {
      mountBox({ allowLoop: false, media: mediaWithTwoImagesWithType })
      await wrapper.find('.vib-arrow-right').trigger('click')
      expect(wrapper.find('.vib-arrow-right').exists()).toBe(false)
      await wrapper.find('.vib-arrow-left').trigger('click')
      expect(wrapper.find('.vib-arrow-left').exists()).toBe(false)
    })

    test('the arrow keys stop at the ends', async () => {
      mountBox({ allowLoop: false })
      await press('ArrowLeft')
      expect(currentSrc()).toBe(mediaWithNineImages[0].src)
      wrapper.vm.showImage(8)
      await wrapper.vm.$nextTick()
      await press('ArrowRight')
      expect(currentSrc()).toBe(mediaWithNineImages[8].src)
    })

    test('swiping stops at the ends', async () => {
      mountBox({ allowLoop: false })
      await swipe(100, 300) // swipe right = previous, on the first media
      expect(currentSrc()).toBe(mediaWithNineImages[0].src)
      await swipe(300, 100) // swipe left = next
      expect(currentSrc()).toBe(mediaWithNineImages[1].src)

      wrapper.vm.showImage(8)
      await wrapper.vm.$nextTick()
      await swipe(300, 100)
      expect(currentSrc()).toBe(mediaWithNineImages[8].src)
    })

    test('autoplay stops at the last media', async () => {
      vi.useFakeTimers()
      mountBox({
        allowLoop: false,
        autoPlay: true,
        autoPlayTime: 1000,
        media: mediaWithTwoImagesWithType
      })
      await vi.advanceTimersByTimeAsync(1000)
      expect(currentSrc()).toBe(mediaWithTwoImagesWithType[1].src)
      await vi.advanceTimersByTimeAsync(3000)
      expect(currentSrc()).toBe(mediaWithTwoImagesWithType[1].src)
    })

    test('the interface can hide again after the hovered control disappears', async () => {
      vi.useFakeTimers()
      mountBox({ allowLoop: false, media: mediaWithTwoImagesWithType })
      await wrapper.find('.vib-arrow-right').trigger('mouseover')
      await wrapper.find('.vib-arrow-right').trigger('click')
      expect(wrapper.find('.vib-arrow-right').exists()).toBe(false)

      await wrapper.find('.vib-container').trigger('mousemove')
      await vi.advanceTimersByTimeAsync(3100)
      expect(wrapper.find('.vib-arrow-left').classes()).toContain('vib-hidden')
    })

    test('showImage can still jump to any media', async () => {
      mountBox({ allowLoop: false })
      wrapper.vm.showImage(5)
      await wrapper.vm.$nextTick()
      expect(currentSrc()).toBe(mediaWithNineImages[5].src)
    })
  })
})
