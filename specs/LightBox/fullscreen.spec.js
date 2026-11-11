import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox.vue'

import {
  mediaWithNineImages,
  mediaWithOneVideoWithoutAutoplay
} from '../fixtures'

/* global HTMLElement, Event */

function setDoc(name, value) {
  Object.defineProperty(document, name, { value, configurable: true, writable: true })
}

describe('LightBox - Full screen', () => {
  let wrapper

  function mountBox(props = {}, options = {}) {
    wrapper = mount(LightBox, {
      props: { media: mediaWithNineImages, ...props },
      ...options
    })
    return wrapper
  }

  const press = (key) => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key }))
    return wrapper.vm.$nextTick()
  }

  async function setFullscreen(active) {
    setDoc('fullscreenElement', active ? wrapper.find('.vib-container').element : null)
    document.dispatchEvent(new Event('fullscreenchange'))
    await wrapper.vm.$nextTick()
  }

  beforeEach(() => {
    setDoc('fullscreenEnabled', true)
    setDoc('fullscreenElement', null)
    setDoc('exitFullscreen', vi.fn())
    HTMLElement.prototype.requestFullscreen = vi.fn()
  })

  afterEach(() => {
    wrapper.unmount()
    ;['fullscreenEnabled', 'fullscreenElement', 'exitFullscreen'].forEach(
      (name) => delete document[name]
    )
    delete HTMLElement.prototype.requestFullscreen
    document.querySelector('html').classList.remove('no-scroll')
    document.querySelector('body').classList.remove('vib-open')
    vi.restoreAllMocks()
  })

  test('renders the button for images and for videos', () => {
    mountBox()
    expect(wrapper.find('.vib-fullscreen').exists()).toBe(true)
    wrapper.unmount()

    mountBox({ media: mediaWithOneVideoWithoutAutoplay })
    expect(wrapper.find('.vib-fullscreen').exists()).toBe(true)
    expect(wrapper.find('.vib-zoom-in').exists()).toBe(false)
  })

  test('is hidden when the API is unavailable', () => {
    delete document.fullscreenEnabled
    mountBox({ media: mediaWithOneVideoWithoutAutoplay })
    expect(wrapper.find('.vib-toolbar').exists()).toBe(false)
  })

  test('is hidden when fullscreenable is false', () => {
    mountBox({ fullscreenable: false })
    expect(wrapper.find('.vib-fullscreen').exists()).toBe(false)
    expect(wrapper.find('.vib-zoom-in').exists()).toBe(true)
  })

  test('clicking the button requests full screen on the container', async () => {
    mountBox()
    await wrapper.find('.vib-fullscreen').trigger('click')
    const request = HTMLElement.prototype.requestFullscreen
    expect(request).toHaveBeenCalledTimes(1)
    expect(request.mock.contexts[0].classList.contains('vib-container')).toBe(true)
    expect(wrapper.find('.vib-container').isVisible()).toBe(true)
  })

  test('title and icon follow the full screen state, and the event is emitted', async () => {
    mountBox()
    const button = () => wrapper.find('.vib-fullscreen')
    expect(button().attributes('title')).toBe('Enter full screen (F)')
    const enterIcon = button().html()

    await setFullscreen(true)
    expect(button().attributes('title')).toBe('Exit full screen (F)')
    expect(button().html()).not.toBe(enterIcon)
    expect(wrapper.emitted('onFullscreenChange')[0]).toEqual([true])

    await button().trigger('click')
    expect(document.exitFullscreen).toHaveBeenCalledTimes(1)

    await setFullscreen(false)
    expect(button().attributes('title')).toBe('Enter full screen (F)')
    expect(wrapper.emitted('onFullscreenChange')[1]).toEqual([false])
  })

  test('the f key toggles full screen', async () => {
    mountBox()
    await press('f')
    expect(HTMLElement.prototype.requestFullscreen).toHaveBeenCalledTimes(1)
    await setFullscreen(true)
    await press('F')
    expect(document.exitFullscreen).toHaveBeenCalledTimes(1)
  })

  test('closing the lightbox exits full screen', async () => {
    mountBox()
    await setFullscreen(true)
    await press('Escape')
    expect(document.exitFullscreen).toHaveBeenCalledTimes(1)
  })

  test('renders custom slots and texts', async () => {
    mountBox(
      { enterFullscreenText: 'Bigger', exitFullscreenText: 'Smaller' },
      {
        slots: {
          enterFullscreen: '<b class="my-enter">in</b>',
          exitFullscreen: '<b class="my-exit">out</b>'
        }
      }
    )
    expect(wrapper.find('.my-enter').exists()).toBe(true)
    expect(wrapper.find('.vib-fullscreen').attributes('title')).toBe('Bigger')

    await setFullscreen(true)
    expect(wrapper.find('.my-exit').exists()).toBe(true)
    expect(wrapper.find('.vib-fullscreen').attributes('title')).toBe('Smaller')
  })

  test('the full screen button stays first, so it does not move between images and videos', () => {
    mountBox()
    expect(wrapper.find('.vib-toolbar').element.firstElementChild.classList.contains('vib-fullscreen')).toBe(true)
    wrapper.unmount()

    mountBox({ media: mediaWithOneVideoWithoutAutoplay })
    expect(wrapper.find('.vib-toolbar').element.firstElementChild.classList.contains('vib-fullscreen')).toBe(true)
  })

  test('video slides hide the browser\'s own full screen button', () => {
    mountBox({ media: mediaWithOneVideoWithoutAutoplay })
    expect(wrapper.find('video').attributes('controlslist')).toBe('nofullscreen')
  })

  test('exposes toggleFullscreen', () => {
    mountBox()
    wrapper.vm.toggleFullscreen()
    expect(HTMLElement.prototype.requestFullscreen).toHaveBeenCalledTimes(1)
  })
})
