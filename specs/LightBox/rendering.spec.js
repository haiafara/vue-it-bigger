import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox.vue'

import {
  mediaWithOneImageWithoutType,
  mediaWithOneImageWithType,
  mediaWithSrcset,
  mediaWithOneVideoWithoutAutoplay,
  mediaWithOneVideoWithAutoplay,
  mediaWithOneYoutube,
  mediaWithNineImages,
  mediaWithTwoImages,
  mediaWithNonStringThumb
} from '../fixtures'

/* global HTMLMediaElement */

describe('LightBox - Rendering', () => {
  let wrapper

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    document.querySelector('html').classList.remove('no-scroll')
    document.querySelector('body').classList.remove('vib-open')
    vi.restoreAllMocks()
  })

  describe('empty media array', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: [],
          showLightBox: false
        }
      })
    })

    test('does not render the container', () => {
      expect(wrapper.find('.vib-container').exists()).toBe(false)
    })
  })

  describe('image without explicit type', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType
        }
      })
    })

    test('renders an img element with vib-image class', () => {
      expect(wrapper.find('img.vib-image').exists()).toBe(true)
    })

    test('sets the img src from the media item', () => {
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithOneImageWithoutType[0].src)
    })

    test('renders one active thumbnail', () => {
      expect(wrapper.find('.vib-thumbnail-active').exists()).toBe(true)
    })

    test('thumbnail does not show video icon', () => {
      expect(wrapper.find('.vib-thumbnail-active svg').exists()).toBe(false)
    })
  })

  describe('image with explicit type', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithType
        }
      })
    })

    test('renders an img element', () => {
      expect(wrapper.find('img.vib-image').exists()).toBe(true)
    })

    test('thumbnail does not show video icon', () => {
      expect(wrapper.find('.vib-thumbnail-active svg').exists()).toBe(false)
    })
  })

  describe('image with srcset', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithSrcset
        }
      })
    })

    test('renders img with srcset attribute', () => {
      expect(wrapper.find('img.vib-image').attributes('srcset')).toBe('http://test/test-image-2x.jpg 2x')
    })

    test('renders img with alt from caption', () => {
      expect(wrapper.find('img.vib-image').attributes('alt')).toBe('Test caption')
    })
  })

  describe('video without autoplay', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneVideoWithoutAutoplay
        }
      })
    })

    test('renders a video element', () => {
      expect(wrapper.find('video').exists()).toBe(true)
    })

    test('video has controls attribute', () => {
      expect(wrapper.find('video').attributes('controls')).toBeDefined()
    })

    test('renders source element with correct src', () => {
      expect(wrapper.find('video source').attributes('src')).toBe('http://test/test-video.mp4')
    })

    test('thumbnail shows video icon', () => {
      expect(wrapper.find('.vib-thumbnail-active svg').exists()).toBe(true)
    })
  })

  describe('video with autoplay', () => {
    beforeEach(() => {
      vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => {})
      vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})

      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneVideoWithAutoplay
        }
      })
    })

    test('renders a video element with autoplay', () => {
      expect(wrapper.find('video').attributes('autoplay')).toBeDefined()
    })

    test('calls play on mount when lightbox is open', () => {
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
    })
  })

  describe('youtube media', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneYoutube
        }
      })
    })

    test('renders a div with video-background class', () => {
      expect(wrapper.find('div.video-background').exists()).toBe(true)
    })

    test('renders an iframe', () => {
      expect(wrapper.find('iframe').exists()).toBe(true)
    })

    test('iframe src contains the youtube id', () => {
      expect(wrapper.find('iframe').attributes('src')).toBe('https://www.youtube.com/embed/testid?enablejsapi=1&showinfo=0')
    })

    test('thumbnail shows video icon', () => {
      expect(wrapper.find('.vib-thumbnail-active svg').exists()).toBe(true)
    })
  })

  describe('thumbnail rendering with multiple images', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages
        }
      })
    })

    test('shows first image by default', () => {
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[0].src)
    })

    test('shows one active thumbnail', () => {
      expect(wrapper.findAll('.vib-thumbnail-active').length).toBe(1)
    })

    test('displays 7 thumbnails (nThumbs default)', () => {
      const visibleThumbs = wrapper.findAll('.vib-thumbnail-wrapper > div:not([style*="display: none"])')
      expect(visibleThumbs.length).toBe(7)
    })

    test('first visible thumb is the first media item', () => {
      const visibleThumbs = wrapper.findAll('.vib-thumbnail-wrapper > div:not([style*="display: none"])')
      expect(visibleThumbs[0].element.style.backgroundImage).toBe(`url("${mediaWithNineImages[0].thumb}")`)
    })

    test('last visible thumb is the seventh media item', () => {
      const visibleThumbs = wrapper.findAll('.vib-thumbnail-wrapper > div:not([style*="display: none"])')
      expect(visibleThumbs[6].element.style.backgroundImage).toBe(`url("${mediaWithNineImages[6].thumb}")`)
    })
  })

  describe('thumbnail window sliding', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages
        }
      })
    })

    test('clicking last thumbnail shifts window', async () => {
      const allThumbs = wrapper.findAll('.vib-thumbnail-wrapper > div')
      await allThumbs[8].trigger('click')
      await wrapper.vm.$nextTick()

      const visibleThumbs = wrapper.findAll('.vib-thumbnail-wrapper > div:not([style*="display: none"])')
      expect(visibleThumbs[0].element.style.backgroundImage).toBe(`url("${mediaWithNineImages[2].thumb}")`)
      expect(visibleThumbs[6].element.style.backgroundImage).toBe(`url("${mediaWithNineImages[8].thumb}")`)
    })

    test('clicking middle thumbnail centers window', async () => {
      const allThumbs = wrapper.findAll('.vib-thumbnail-wrapper > div')
      await allThumbs[4].trigger('click')
      await wrapper.vm.$nextTick()

      const visibleThumbs = wrapper.findAll('.vib-thumbnail-wrapper > div:not([style*="display: none"])')
      expect(visibleThumbs[0].element.style.backgroundImage).toBe(`url("${mediaWithNineImages[1].thumb}")`)
      expect(visibleThumbs[6].element.style.backgroundImage).toBe(`url("${mediaWithNineImages[7].thumb}")`)
    })
  })

  describe('footer counter', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages
        }
      })
    })

    test('displays "1 / 9" by default', () => {
      expect(wrapper.find('.vib-footer-count').text()).toContain('1 / 9')
    })
  })

  describe('arrow buttons with single item', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType
        }
      })
    })

    test('does not render arrow buttons', () => {
      expect(wrapper.find('.vib-arrow-left').exists()).toBe(false)
      expect(wrapper.find('.vib-arrow-right').exists()).toBe(false)
    })
  })

  describe('arrow buttons with multiple items', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithTwoImages
        }
      })
    })

    test('renders left arrow button', () => {
      expect(wrapper.find('.vib-arrow-left').exists()).toBe(true)
    })

    test('renders right arrow button', () => {
      expect(wrapper.find('.vib-arrow-right').exists()).toBe(true)
    })
  })

  describe('thumbnail key generation', () => {
    test('uses index as key when thumb is not a string', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNonStringThumb
        }
      })

      // Check that the component renders without errors
      expect(wrapper.find('.vib-container').exists()).toBe(true)

      // Verify that thumbnails are rendered
      const thumbnails = wrapper.findAll('.vib-thumbnail-wrapper > div')
      expect(thumbnails.length).toBeGreaterThan(0)
    })
  })
})
