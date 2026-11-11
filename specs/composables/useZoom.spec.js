import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useZoom } from '../../src/composables/useZoom.js'

/* global MouseEvent */

function setup(propsOverride = {}, media = { src: 'a.jpg' }, el = { offsetWidth: 800, offsetHeight: 600 }) {
  const props = { zoomable: true, maxZoom: 4, ...propsOverride }
  const currentMedia = ref(media)
  const zoomEl = ref(el)
  let zoom
  const wrapper = mount({
    template: '<div />',
    setup() {
      zoom = useZoom(props, currentMedia, zoomEl)
      return {}
    }
  })
  return { zoom, wrapper, currentMedia }
}

const touch = (x, y) => ({ clientX: x, clientY: y })

describe('useZoom', () => {
  beforeEach(() => {
    vi.stubGlobal('innerWidth', 400)
    vi.stubGlobal('innerHeight', 300)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('starts unzoomed', () => {
    const { zoom } = setup()
    expect(zoom.scale.value).toBe(1)
    expect(zoom.isZoomed.value).toBe(false)
  })

  test('zoomIn / zoomOut step and clamp to [1, maxZoom]', () => {
    const { zoom } = setup({ maxZoom: 2 })
    zoom.zoomIn()
    expect(zoom.scale.value).toBe(1.5)
    zoom.zoomIn()
    expect(zoom.scale.value).toBe(2)
    expect(zoom.isMaxZoom.value).toBe(true)
    zoom.zoomOut()
    zoom.zoomOut()
    zoom.zoomOut()
    expect(zoom.scale.value).toBe(1)
    expect(zoom.isZoomed.value).toBe(false)
  })

  test('zooming out to 1 resets the pan', () => {
    const { zoom } = setup()
    zoom.zoomTo(2, 100, 50)
    expect(zoom.translateX.value).not.toBe(0)
    zoom.zoomTo(1)
    expect(zoom.translateX.value).toBe(0)
    expect(zoom.translateY.value).toBe(0)
  })

  test('zoomTo keeps the origin point fixed', () => {
    const { zoom } = setup()
    zoom.zoomTo(2, 100, 50)
    // translate = origin - origin * ratio
    expect(zoom.translateX.value).toBe(-100)
    expect(zoom.translateY.value).toBe(-50)
  })

  test('pan is clamped to the zoomed image bounds', () => {
    const { zoom } = setup()
    zoom.zoomTo(2, 10000, 10000)
    // (800*2 - 400) / 2 = 600 ; (600*2 - 300) / 2 = 450
    expect(Math.abs(zoom.translateX.value)).toBeLessThanOrEqual(600)
    expect(Math.abs(zoom.translateY.value)).toBeLessThanOrEqual(450)
  })

  test('does nothing for videos or when zoomable is false', () => {
    const video = setup({}, { type: 'video' })
    video.zoom.zoomIn()
    expect(video.zoom.scale.value).toBe(1)
    expect(video.zoom.canZoom.value).toBe(false)

    const disabled = setup({ zoomable: false })
    disabled.zoom.zoomIn()
    expect(disabled.zoom.scale.value).toBe(1)
  })

  test('resetZoom restores the default state', () => {
    const { zoom } = setup()
    zoom.zoomTo(3, 50, 50)
    zoom.resetZoom()
    expect(zoom.scale.value).toBe(1)
    expect(zoom.translateX.value).toBe(0)
    expect(zoom.translateY.value).toBe(0)
  })

  describe('wheel', () => {
    test('zooms in on scroll up and prevents default', () => {
      const { zoom } = setup()
      const event = { deltaY: -100, clientX: 200, clientY: 150, preventDefault: vi.fn() }
      zoom.handleWheel(event)
      expect(event.preventDefault).toHaveBeenCalled()
      expect(zoom.scale.value).toBeGreaterThan(1)
    })

    test('zooms out on scroll down', () => {
      const { zoom } = setup()
      zoom.zoomTo(2)
      zoom.handleWheel({ deltaY: 100, clientX: 200, clientY: 150, preventDefault: vi.fn() })
      expect(zoom.scale.value).toBeLessThan(2)
    })

    test('is ignored for non-images', () => {
      const { zoom } = setup({}, { type: 'video' })
      const event = { deltaY: -100, clientX: 0, clientY: 0, preventDefault: vi.fn() }
      zoom.handleWheel(event)
      expect(event.preventDefault).not.toHaveBeenCalled()
      expect(zoom.scale.value).toBe(1)
    })
  })

  describe('mouse panning', () => {
    test('does nothing when not zoomed', () => {
      const { zoom } = setup()
      zoom.handleMouseDown({ button: 0, clientX: 0, clientY: 0, preventDefault: vi.fn() })
      expect(zoom.isPanning.value).toBe(false)
    })

    test('drags the image when zoomed and cleans up on mouseup', () => {
      const removeSpy = vi.spyOn(window, 'removeEventListener')
      const { zoom } = setup()
      zoom.zoomTo(3)
      zoom.handleMouseDown({ button: 0, clientX: 100, clientY: 100, preventDefault: vi.fn() })
      expect(zoom.isPanning.value).toBe(true)

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 130, clientY: 90 }))
      expect(zoom.translateX.value).toBe(30)
      expect(zoom.translateY.value).toBe(-10)

      window.dispatchEvent(new MouseEvent('mouseup'))
      expect(zoom.isPanning.value).toBe(false)
      expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 500 }))
      expect(zoom.translateX.value).toBe(30)
    })

    test('ignores non-primary buttons', () => {
      const { zoom } = setup()
      zoom.zoomTo(2)
      zoom.handleMouseDown({ button: 2, clientX: 0, clientY: 0, preventDefault: vi.fn() })
      expect(zoom.isPanning.value).toBe(false)
    })

    test('removes listeners on unmount', () => {
      const removeSpy = vi.spyOn(window, 'removeEventListener')
      const { zoom, wrapper } = setup()
      zoom.zoomTo(2)
      zoom.handleMouseDown({ button: 0, clientX: 0, clientY: 0, preventDefault: vi.fn() })
      wrapper.unmount()
      expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
    })
  })

  describe('touch', () => {
    test('pinch scales relative to the start distance', () => {
      const { zoom } = setup()
      zoom.handleZoomTouchStart({ touches: [touch(150, 150), touch(250, 150)] })
      expect(zoom.isPinching.value).toBe(true)

      const move = { touches: [touch(100, 150), touch(300, 150)], preventDefault: vi.fn() }
      zoom.handleZoomTouchMove(move)
      expect(move.preventDefault).toHaveBeenCalled()
      expect(zoom.scale.value).toBeCloseTo(2)

      zoom.handleZoomTouchEnd({ touches: [] })
      expect(zoom.isPinching.value).toBe(false)
    })

    test('one finger pans when zoomed', () => {
      const { zoom } = setup()
      zoom.zoomTo(3)
      zoom.handleZoomTouchStart({ touches: [touch(100, 100)] })
      expect(zoom.isPanning.value).toBe(true)
      const move = { touches: [touch(120, 110)], preventDefault: vi.fn() }
      zoom.handleZoomTouchMove(move)
      expect(move.preventDefault).toHaveBeenCalled()
      expect(zoom.translateX.value).toBe(20)
      expect(zoom.translateY.value).toBe(10)
      zoom.handleZoomTouchEnd({ touches: [] })
      expect(zoom.isPanning.value).toBe(false)
    })

    test('one finger does not pan when not zoomed', () => {
      const { zoom } = setup()
      zoom.handleZoomTouchStart({ touches: [touch(100, 100)] })
      expect(zoom.isPanning.value).toBe(false)
    })

    test('lifting one finger after a pinch continues as a pan', () => {
      const { zoom } = setup()
      zoom.handleZoomTouchStart({ touches: [touch(150, 150), touch(250, 150)] })
      zoom.handleZoomTouchMove({ touches: [touch(100, 150), touch(300, 150)], preventDefault: vi.fn() })
      zoom.handleZoomTouchEnd({ touches: [touch(300, 150)] })
      expect(zoom.isPinching.value).toBe(false)
      expect(zoom.isPanning.value).toBe(true)
    })

    test('touch is ignored for non-images', () => {
      const { zoom } = setup({}, { type: 'video' })
      zoom.handleZoomTouchStart({ touches: [touch(0, 0), touch(10, 0)] })
      expect(zoom.isPinching.value).toBe(false)
    })
  })
})
