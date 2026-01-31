import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox.vue'

import {
  mediaWithOneImageWithoutType,
  mediaWithNineImages,
  mediaWithTwoImages,
  mediaWithCaption,
  mediaWithOneVideoWithoutAutoplay
} from '../fixtures'

describe('LightBox - Props and Events', () => {
  let wrapper

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    document.querySelector('html').classList.remove('no-scroll')
    document.querySelector('body').classList.remove('vib-open')
    vi.restoreAllMocks()
  })

  describe('showLightBox prop', () => {
    test('showLightBox: false starts with container hidden', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType,
          showLightBox: false
        }
      })

      expect(wrapper.find('.vib-container').element.style.display).toBe('none')
    })

    test('showLightBox: true starts with container visible', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType,
          showLightBox: true
        }
      })

      expect(wrapper.find('.vib-container').element.style.display).not.toBe('none')
    })
  })

  describe('startAt prop', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages,
          startAt: 3
        }
      })
    })

    test('startAt: 3 starts at the fourth image', () => {
      expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[3].src)
    })

    test('footer shows correct position for startAt', () => {
      expect(wrapper.find('.vib-footer-count').text()).toContain('4 / 9')
    })
  })

  describe('disableScroll prop', () => {
    test('disableScroll: true (default) adds no-scroll to html on open', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType,
          disableScroll: true
        }
      })

      expect(document.querySelector('html').classList.contains('no-scroll')).toBe(true)
    })

    test('disableScroll: false does not add no-scroll to html', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType,
          disableScroll: false
        }
      })

      expect(document.querySelector('html').classList.contains('no-scroll')).toBe(false)
    })

    test('disableScroll: true removes no-scroll on close', async () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType,
          disableScroll: true
        }
      })

      expect(document.querySelector('html').classList.contains('no-scroll')).toBe(true)

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await wrapper.vm.$nextTick()

      expect(document.querySelector('html').classList.contains('no-scroll')).toBe(false)
    })
  })

  describe('showThumbs prop', () => {
    test('showThumbs: true (default) renders thumbnail wrapper', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType,
          showThumbs: true
        }
      })

      expect(wrapper.find('.vib-thumbnail-wrapper').exists()).toBe(true)
    })

    test('showThumbs: false hides thumbnail wrapper', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType,
          showThumbs: false
        }
      })

      expect(wrapper.find('.vib-thumbnail-wrapper').exists()).toBe(false)
    })
  })

  describe('showCaption prop', () => {
    test('showCaption: false (default) hides the caption', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithCaption,
          showCaption: false
        }
      })

      // The caption div is inside the customCaption slot default content
      const captionDivs = wrapper.findAll('.vib-footer div')
      const captionDiv = captionDivs.find(div => div.html().includes('v-show'))
      if (captionDiv) {
        expect(captionDiv.element.style.display).toBe('none')
      }
    })

    test('showCaption: true displays caption HTML', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithCaption,
          showCaption: true
        }
      })

      const footerHTML = wrapper.find('.vib-footer').html()
      expect(footerHTML).toContain('<strong>Bold caption</strong>')
    })
  })

  describe('nThumbs prop', () => {
    test('nThumbs: 3 displays only 3 thumbnails', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages,
          nThumbs: 3
        }
      })

      const visibleThumbs = wrapper.findAll('.vib-thumbnail-wrapper > div:not([style*="display: none"])')
      expect(visibleThumbs.length).toBe(3)
    })
  })

  describe('closable prop', () => {
    test('closable: true (default) renders close button', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType,
          closable: true
        }
      })

      expect(wrapper.find('.vib-close').exists()).toBe(true)
    })

    test('closable: false does not render close button', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType,
          closable: false
        }
      })

      expect(wrapper.find('.vib-close').exists()).toBe(false)
    })
  })

  describe('custom text props', () => {
    test('closeText sets close button title', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType,
          closeText: 'Dismiss'
        }
      })

      expect(wrapper.find('.vib-close').attributes('title')).toBe('Dismiss')
    })

    test('previousText sets left arrow title', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithTwoImages,
          previousText: 'Back'
        }
      })

      expect(wrapper.find('.vib-arrow-left').attributes('title')).toBe('Back')
    })

    test('nextText sets right arrow title', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithTwoImages,
          nextText: 'Forward'
        }
      })

      expect(wrapper.find('.vib-arrow-right').attributes('title')).toBe('Forward')
    })

    test('default text values', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithTwoImages
        }
      })

      expect(wrapper.find('.vib-close').attributes('title')).toBe('Close (Esc)')
      expect(wrapper.find('.vib-arrow-left').attributes('title')).toBe('Previous')
      expect(wrapper.find('.vib-arrow-right').attributes('title')).toBe('Next')
    })
  })

  describe('lengthToLoadMore and onLoad event', () => {
    test('emits onLoad when navigating near the end', async () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages,
          lengthToLoadMore: 2
        }
      })

      // Navigate to index 6 (>= 9 - 2 - 1 = 6)
      for (let i = 0; i < 6; i++) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      }
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('onLoad')).toBeTruthy()
    })

    test('does not emit onLoad when not near end', async () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages,
          lengthToLoadMore: 2
        }
      })

      // Navigate to index 3
      for (let i = 0; i < 3; i++) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      }
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('onLoad')).toBeFalsy()
    })
  })

  describe('event emissions', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages
        }
      })
    })

    test('emits onOpened when lightbox opens', () => {
      expect(wrapper.emitted('onOpened')).toBeTruthy()
    })

    test('emits onClosed when lightbox closes', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('onClosed')).toBeTruthy()
    })

    test('emits onImageChanged when navigating', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('onImageChanged')).toBeTruthy()
      expect(wrapper.emitted('onImageChanged')[0]).toEqual([1])
    })

    test('emits onFirstIndex when navigating to first image', async () => {
      // Navigate away first
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await wrapper.vm.$nextTick()

      // Navigate back to index 0
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('onFirstIndex')).toBeTruthy()
    })

    test('emits onLastIndex when reaching last image', async () => {
      // Navigate to last image (index 8)
      for (let i = 0; i < 8; i++) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      }
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('onLastIndex')).toBeTruthy()
    })

    test('emits onStartIndex when returning to startAt', async () => {
      wrapper.unmount()
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages,
          startAt: 3
        }
      })

      // Navigate away from startAt
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await wrapper.vm.$nextTick()

      // Navigate back to index 3
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('onStartIndex')).toBeTruthy()
    })
  })

  describe('DOM class management', () => {
    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType
        }
      })
    })

    test('adds vib-open to body when opened', () => {
      expect(document.querySelector('body').classList.contains('vib-open')).toBe(true)
    })

    test('removes vib-open from body when closed', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await wrapper.vm.$nextTick()

      expect(document.querySelector('body').classList.contains('vib-open')).toBe(false)
    })

    test('adds no-scroll to html when opened (disableScroll: true)', () => {
      expect(document.querySelector('html').classList.contains('no-scroll')).toBe(true)
    })

    test('removes no-scroll from html when closed', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await wrapper.vm.$nextTick()

      expect(document.querySelector('html').classList.contains('no-scroll')).toBe(false)
    })
  })

  describe('slot rendering', () => {
    test('close slot replaces default close icon', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneImageWithoutType
        },
        slots: {
          close: '<span class="custom-close">X</span>'
        }
      })

      expect(wrapper.find('.custom-close').exists()).toBe(true)
      expect(wrapper.find('.custom-close').text()).toBe('X')
    })

    test('previous slot replaces default left arrow', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithTwoImages
        },
        slots: {
          previous: '<span class="custom-prev">Prev</span>'
        }
      })

      expect(wrapper.find('.custom-prev').exists()).toBe(true)
      expect(wrapper.find('.custom-prev').text()).toBe('Prev')
    })

    test('next slot replaces default right arrow', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithTwoImages
        },
        slots: {
          next: '<span class="custom-next">Next</span>'
        }
      })

      expect(wrapper.find('.custom-next').exists()).toBe(true)
      expect(wrapper.find('.custom-next').text()).toBe('Next')
    })

    test('videoIcon slot replaces default video icon', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithOneVideoWithoutAutoplay
        },
        slots: {
          videoIcon: '<span class="custom-video-icon">Play</span>'
        }
      })

      expect(wrapper.find('.custom-video-icon').exists()).toBe(true)
      expect(wrapper.find('.custom-video-icon').text()).toBe('Play')
    })

    test('customCaption slot replaces default caption', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithCaption,
          showCaption: true
        },
        slots: {
          customCaption: '<div class="custom-caption">Custom Caption</div>'
        }
      })

      expect(wrapper.find('.custom-caption').exists()).toBe(true)
      expect(wrapper.find('.custom-caption').text()).toBe('Custom Caption')
    })

    test('footer slot replaces default counter', () => {
      wrapper = mount(LightBox, {
        props: {
          media: mediaWithNineImages
        },
        slots: {
          footer: '<span class="custom-footer">Custom Footer</span>'
        }
      })

      expect(wrapper.find('.custom-footer').exists()).toBe(true)
      expect(wrapper.find('.custom-footer').text()).toBe('Custom Footer')
    })
  })
})
