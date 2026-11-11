import { describe, test, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox.vue'

import {
  mediaWithNineImages,
  mediaWithOneVideoWithoutAutoplay
} from '../fixtures'

/* global MouseEvent */

describe('LightBox - Zoom', () => {
  let wrapper

  function mountBox(props = {}, options = {}) {
    wrapper = mount(LightBox, {
      props: { media: mediaWithNineImages, ...props },
      ...options
    })
    return wrapper
  }

  const transform = () => wrapper.find('.vib-image-zoom').attributes('style')
  const press = (key) => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key }))
    return wrapper.vm.$nextTick()
  }

  afterEach(() => {
    wrapper.unmount()
    document.querySelector('html').classList.remove('no-scroll')
    document.querySelector('body').classList.remove('vib-open')
    vi.restoreAllMocks()
  })

  test('renders zoom buttons for images', () => {
    mountBox()
    expect(wrapper.find('.vib-zoom-in').exists()).toBe(true)
    expect(wrapper.find('.vib-zoom-out').exists()).toBe(true)
  })

  test('does not render zoom buttons for videos', () => {
    mountBox({ media: mediaWithOneVideoWithoutAutoplay })
    expect(wrapper.find('.vib-zoom').exists()).toBe(false)
  })

  test('does not render zoom buttons when zoomable is false', () => {
    mountBox({ zoomable: false })
    expect(wrapper.find('.vib-zoom').exists()).toBe(false)
  })

  test('zoom in button scales the image; zoom out is disabled at 1', async () => {
    mountBox()
    expect(wrapper.find('.vib-zoom-out').attributes('disabled')).toBeDefined()
    await wrapper.find('.vib-zoom-in').trigger('click')
    expect(transform()).toContain('scale(1.5)')
    expect(wrapper.find('.vib-zoom-out').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.vib-image-zoom').classes()).toContain('vib-zoomed')
  })

  test('zoom in is disabled at maxZoom', async () => {
    mountBox({ maxZoom: 1.5 })
    await wrapper.find('.vib-zoom-in').trigger('click')
    expect(wrapper.find('.vib-zoom-in').attributes('disabled')).toBeDefined()
  })

  test('zoom out button reverts zoom', async () => {
    mountBox()
    await wrapper.find('.vib-zoom-in').trigger('click')
    await wrapper.find('.vib-zoom-out').trigger('click')
    expect(transform()).toContain('scale(1)')
  })

  test('clicking a zoom button does not close the lightbox', async () => {
    mountBox()
    await wrapper.find('.vib-zoom-in').trigger('click')
    expect(wrapper.find('.vib-container').isVisible()).toBe(true)
  })

  test('scroll wheel zooms', async () => {
    mountBox()
    await wrapper.find('.vib-content').trigger('wheel', { deltaY: -100 })
    expect(transform()).not.toContain('scale(1)')
  })

  test('scroll wheel is ignored when zoomable is false', async () => {
    mountBox({ zoomable: false })
    await wrapper.find('.vib-content').trigger('wheel', { deltaY: -100 })
    expect(transform()).toContain('scale(1)')
  })

  test('keyboard + / - / 0 zoom in, out and reset', async () => {
    mountBox()
    await press('+')
    expect(transform()).toContain('scale(1.5)')
    await press('-')
    expect(transform()).toContain('scale(1)')
    await press('=')
    await press('0')
    expect(transform()).toContain('scale(1)')
  })

  test('navigating to another image resets zoom', async () => {
    mountBox()
    await wrapper.find('.vib-zoom-in').trigger('click')
    await press('ArrowRight')
    expect(transform()).toContain('scale(1)')
  })

  test('swipe does not navigate while zoomed', async () => {
    mountBox()
    await wrapper.find('.vib-zoom-in').trigger('click')
    const container = wrapper.find('.vib-container')
    await container.trigger('touchstart', { touches: [{ clientX: 300, clientY: 100 }] })
    await container.trigger('touchend', {
      touches: [],
      changedTouches: [{ clientX: 100, clientY: 100 }]
    })
    expect(wrapper.find('img.vib-image').attributes('src')).toBe(mediaWithNineImages[0].src)
  })

  test('exposes zoomIn / zoomOut / resetZoom', async () => {
    mountBox()
    wrapper.vm.zoomIn()
    await wrapper.vm.$nextTick()
    expect(transform()).toContain('scale(1.5)')
    wrapper.vm.resetZoom()
    await wrapper.vm.$nextTick()
    expect(transform()).toContain('scale(1)')
  })

  test('renders custom zoom slots and titles', () => {
    mountBox(
      { zoomInText: 'Bigger', zoomOutText: 'Smaller' },
      { slots: { zoomIn: '<b class="my-in">+</b>', zoomOut: '<b class="my-out">-</b>' } }
    )
    expect(wrapper.find('.my-in').exists()).toBe(true)
    expect(wrapper.find('.my-out').exists()).toBe(true)
    expect(wrapper.find('.vib-zoom-in').attributes('title')).toBe('Bigger')
    expect(wrapper.find('.vib-zoom-out').attributes('title')).toBe('Smaller')
  })

  test('wires up mouse and touch handlers on the zoomable image', async () => {
    mountBox()
    await wrapper.find('.vib-zoom-in').trigger('click')
    const zoomed = wrapper.find('.vib-image-zoom')
    await zoomed.trigger('mousedown', { button: 0, clientX: 10, clientY: 10 })
    expect(zoomed.classes()).toContain('vib-panning')
    window.dispatchEvent(new MouseEvent('mouseup'))
    await wrapper.vm.$nextTick()
    expect(zoomed.classes()).not.toContain('vib-panning')

    const finger = { clientX: 10, clientY: 10 }
    await zoomed.trigger('touchstart', { touches: [finger] })
    expect(zoomed.classes()).toContain('vib-panning')
    await zoomed.trigger('touchmove', { touches: [{ clientX: 20, clientY: 20 }] })
    await zoomed.trigger('touchend', { touches: [] })
    expect(zoomed.classes()).not.toContain('vib-panning')
    await zoomed.trigger('touchstart', { touches: [finger] })
    await zoomed.trigger('touchcancel', { touches: [] })
    expect(zoomed.classes()).not.toContain('vib-panning')
  })

  test('hovering the zoom buttons keeps the interface visible', async () => {
    mountBox()
    const toolbar = wrapper.find('.vib-zoom')
    await toolbar.trigger('mouseover')
    await toolbar.trigger('mouseleave')
    expect(toolbar.exists()).toBe(true)
  })

  test('closing the lightbox resets the zoom', async () => {
    mountBox()
    await wrapper.find('.vib-zoom-in').trigger('click')
    expect(transform()).toContain('scale(1.5)')
    await press('Escape')
    expect(transform()).toContain('scale(1)')
  })

  test('the 0 key does nothing on a video slide', async () => {
    mountBox({ media: mediaWithOneVideoWithoutAutoplay })
    await press('0')
    expect(wrapper.find('.vib-image-zoom').exists()).toBe(false)
  })
})
