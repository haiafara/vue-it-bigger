import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox.vue'

import {
  mediaWithOneImageWithoutType,
  mediaWithNineImages,
  mediaWithOneVideoWithAutoplay
} from '../fixtures'

/* global HTMLMediaElement, Event, MouseEvent */

describe('LightBox - Interaction', () => {
  let wrapper

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    document.querySelector('html').classList.remove('no-scroll')
    document.querySelector('body').classList.remove('vib-open')
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('keyboard navigation', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages
        }
      })
    })

    test('right arrow advances to next image', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[1].src)
    })

    test('left arrow goes to previous image', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await wrapper.vm.$nextTick()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[0].src)
    })

    test('escape closes the lightbox', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.vib-container').element.style.display).toBe('none')
    })

    test('right arrow wraps from last to first (circular)', async () => {
      // Navigate to last image
      for (let i = 0; i < 8; i++) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
        await wrapper.vm.$nextTick()
      }
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[8].src)

      // Wrap around to first
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[0].src)
    })

    test('left arrow wraps from first to last (circular)', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[8].src)
    })
  })

  describe('click navigation', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages
        }
      })
    })

    test('clicking next arrow advances to next image', async () => {
      await wrapper.find('.vib-arrow-right').trigger('click')
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[1].src)
    })

    test('clicking previous arrow goes to previous image', async () => {
      await wrapper.find('.vib-arrow-right').trigger('click')
      await wrapper.find('.vib-arrow-left').trigger('click')
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[0].src)
    })

    test('clicking a thumbnail navigates to that image', async () => {
      const allThumbs = wrapper.findAll('.vib-thumbnail-wrapper > div')
      await allThumbs[3].trigger('click')
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[3].src)
    })
  })

  describe('container click to close', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages
        }
      })
    })

    test('clicking the outer container closes the lightbox', async () => {
      const rootDiv = wrapper.find('.vib-container').element.parentElement
      await rootDiv.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.vib-container').element.style.display).toBe('none')
    })

    test('clicking on content area does not close (stopPropagation)', async () => {
      await wrapper.find('.vib-content').trigger('click')
      expect(wrapper.find('.vib-container').element.style.display).not.toBe('none')
    })
  })

  describe('touch/swipe gestures', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages
        }
      })
    })

    test('swipe left navigates to next image', async () => {
      const container = wrapper.find('.vib-container').element

      const touchStart = new Event('touchstart')
      touchStart.touches = [{ clientX: 200, clientY: 100 }]
      container.dispatchEvent(touchStart)

      const touchEnd = new Event('touchend')
      touchEnd.changedTouches = [{ clientX: 100, clientY: 100 }]
      container.dispatchEvent(touchEnd)

      await wrapper.vm.$nextTick()
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[1].src)
    })

    test('swipe right navigates to previous image', async () => {
      const container = wrapper.find('.vib-container').element

      const touchStart = new Event('touchstart')
      touchStart.touches = [{ clientX: 100, clientY: 100 }]
      container.dispatchEvent(touchStart)

      const touchEnd = new Event('touchend')
      touchEnd.changedTouches = [{ clientX: 200, clientY: 100 }]
      container.dispatchEvent(touchEnd)

      await wrapper.vm.$nextTick()
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[8].src)
    })

    test('vertical swipe does not navigate', () => {
      const container = wrapper.find('.vib-container').element

      const touchStart = new Event('touchstart')
      touchStart.touches = [{ clientX: 100, clientY: 100 }]
      container.dispatchEvent(touchStart)

      const touchEnd = new Event('touchend')
      touchEnd.changedTouches = [{ clientX: 100, clientY: 300 }]
      container.dispatchEvent(touchEnd)

      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[0].src)
    })

    test('small horizontal swipe (< 50px) does not navigate', () => {
      const container = wrapper.find('.vib-container').element

      const touchStart = new Event('touchstart')
      touchStart.touches = [{ clientX: 100, clientY: 100 }]
      container.dispatchEvent(touchStart)

      const touchEnd = new Event('touchend')
      touchEnd.changedTouches = [{ clientX: 130, clientY: 100 }]
      container.dispatchEvent(touchEnd)

      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[0].src)
    })
  })

  describe('autoplay', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    test('advances to next image after autoPlayTime (3000ms default)', async () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages,
          autoPlay: true
        }
      })

      vi.advanceTimersByTime(3000)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[1].src)

      vi.advanceTimersByTime(3000)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[2].src)
    })

    test('respects custom autoPlayTime', async () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages,
          autoPlay: true,
          autoPlayTime: 1000
        }
      })

      vi.advanceTimersByTime(1000)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[1].src)

      vi.advanceTimersByTime(1000)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[2].src)
    })

    test('clears interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages,
          autoPlay: true
        }
      })

      wrapper.unmount()
      expect(clearIntervalSpy).toHaveBeenCalled()
    })
  })

  describe('mouse activity and control hiding', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType
        }
      })
    })

    test('controls start visible', () => {
      const hideableElements = wrapper.findAll('.vib-hideable')
      hideableElements.forEach(el => {
        expect(el.classes()).not.toContain('vib-hidden')
      })
    })

    test('controls hide after interfaceHideTime of inactivity', async () => {
      await wrapper.find('.vib-container').trigger('mousemove')

      vi.advanceTimersByTime(3000)
      await wrapper.vm.$nextTick()

      const hideableElements = wrapper.findAll('.vib-hideable')
      hideableElements.forEach(el => {
        expect(el.classes()).toContain('vib-hidden')
      })
    })

    test('mouse movement resets the hide timer', async () => {
      await wrapper.find('.vib-container').trigger('mousemove')
      vi.advanceTimersByTime(2000)

      await wrapper.find('.vib-container').trigger('mousemove')
      vi.advanceTimersByTime(2000)

      const hideableElements = wrapper.findAll('.vib-hideable')
      hideableElements.forEach(el => {
        expect(el.classes()).not.toContain('vib-hidden')
      })

      vi.advanceTimersByTime(1000)
      await wrapper.vm.$nextTick()

      hideableElements.forEach(el => {
        expect(el.classes()).toContain('vib-hidden')
      })
    })

    test('hovering over interface prevents hiding', async () => {
      await wrapper.find('.vib-thumbnail-wrapper').trigger('mouseover')
      await wrapper.find('.vib-container').trigger('mousemove')

      vi.advanceTimersByTime(5000)
      await wrapper.vm.$nextTick()

      const hideableElements = wrapper.findAll('.vib-hideable')
      hideableElements.forEach(el => {
        expect(el.classes()).not.toContain('vib-hidden')
      })
    })

    test('respects custom interfaceHideTime', async () => {
      wrapper.unmount()
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType,
          interfaceHideTime: 1000
        }
      })

      await wrapper.find('.vib-container').trigger('mousemove')
      vi.advanceTimersByTime(1000)
      await wrapper.vm.$nextTick()

      const hideableElements = wrapper.findAll('.vib-hideable')
      hideableElements.forEach(el => {
        expect(el.classes()).toContain('vib-hidden')
      })
    })
  })

  describe('video close behavior', () => {
    beforeEach(() => {
      vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => {})
      vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})

      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneVideoWithAutoplay
        }
      })
    })

    test('pauses video on close', async () => {
      const rootDiv = wrapper.find('.vib-container').element.parentElement
      await rootDiv.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wrapper.vm.$nextTick()

      expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled()
    })

    test('resets video currentTime to 0 on close', async () => {
      const rootDiv = wrapper.find('.vib-container').element.parentElement
      await rootDiv.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wrapper.vm.$nextTick()

      expect(wrapper.find('video').element.currentTime).toBe(0)
    })
  })

  describe('close with closable: false', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages,
          closable: false
        }
      })
    })

    test('escape key does not close the lightbox', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      expect(wrapper.find('.vib-container').element.style.display).not.toBe('none')
    })

    test('container click does not close the lightbox', async () => {
      const rootDiv = wrapper.find('.vib-container').element.parentElement
      await rootDiv.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.vib-container').element.style.display).not.toBe('none')
    })

    test('close button is not rendered', () => {
      expect(wrapper.find('.vib-close').exists()).toBe(false)
    })
  })
})
