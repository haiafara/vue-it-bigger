import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox.vue'

import {
  mediaWithOneImageWithoutType,
  mediaWithNineImages,
  mediaWithOneVideoWithAutoplay,
  mediaWithTwoImagesWithType,
  mediaWithTwoImagesWithSrcset
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

    test('mouse activity restores hidden controls', async () => {
      const container = wrapper.find('.vib-container').element

      // First, trigger mouse activity to start the hide timer
      const mouseMoveEvent1 = new MouseEvent('mousemove', { bubbles: true })
      container.dispatchEvent(mouseMoveEvent1)

      // Wait for controls to hide
      vi.advanceTimersByTime(3000)
      await wrapper.vm.$nextTick()

      // Verify controls are hidden
      expect(wrapper.vm.controlsHidden).toBe(true)

      // Now trigger mouse activity again - this should restore the controls
      const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true })
      container.dispatchEvent(mouseDownEvent)
      await wrapper.vm.$nextTick()

      // Verify controls are restored
      expect(wrapper.vm.controlsHidden).toBe(false)
    })
  })

  describe('transition lifecycle methods', () => {
    test('disableImageTransition sets transition to no-transition', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType
        }
      })

      // Enable transitions first
      wrapper.vm.imageTransitionsEnabled = true

      // Call the method directly to test it
      wrapper.vm.disableImageTransition()

      expect(wrapper.vm.imageTransitionName).toBe('vib-image-no-transition')
    })

    test('enableImageTransition sets transition and calls handleMouseActivity', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType
        }
      })

      const handleMouseActivitySpy = vi.spyOn(wrapper.vm, 'handleMouseActivity')

      // Ensure transitions are disabled first
      wrapper.vm.imageTransitionsEnabled = false

      // Call the method directly to test it
      wrapper.vm.enableImageTransition()

      expect(wrapper.vm.imageTransitionName).toMatch(/^vib-image-slide-(next|prev)$/)
      expect(handleMouseActivitySpy).toHaveBeenCalled()
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

  describe('preloadAdjacentImages', () => {
    test('preloads srcset when available on adjacent images', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithTwoImagesWithSrcset
        }
      })

      const imageSpy = vi.spyOn(globalThis, 'Image').mockImplementation(() => ({}))

      wrapper.vm.preloadAdjacentImages()

      expect(imageSpy).toHaveBeenCalled()
      const createdImage = imageSpy.mock.results[0].value
      expect(createdImage.src).toBe(mediaWithTwoImagesWithSrcset[1].src)
      expect(createdImage.srcset).toBe(mediaWithTwoImagesWithSrcset[1].srcset)

      imageSpy.mockRestore()
    })

    test('preloads adjacent images with explicit type "image"', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithTwoImagesWithType
        }
      })

      const imageSpy = vi.spyOn(globalThis, 'Image').mockImplementation(() => ({}))

      wrapper.vm.preloadAdjacentImages()

      expect(imageSpy).toHaveBeenCalled()
      const createdImage = imageSpy.mock.results[0].value
      expect(createdImage.src).toBe(mediaWithTwoImagesWithType[1].src)

      imageSpy.mockRestore()
    })
  })

  describe('slide direction', () => {
    test('imageTransitionName returns slide-prev when direction is prev', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages
        }
      })

      wrapper.vm.imageTransitionsEnabled = true
      wrapper.vm.slideDirection = 'prev'

      expect(wrapper.vm.imageTransitionName).toBe('vib-image-slide-prev')
    })

    test('showImage sets direction to prev when target index is before current', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages,
          startAt: 5
        }
      })

      wrapper.vm.showImage(2)

      expect(wrapper.vm.slideDirection).toBe('prev')
      expect(wrapper.vm.select).toBe(2)
    })
  })
})
