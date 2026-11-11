import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useFullscreen } from '../../src/composables/useFullscreen.js'

/* global HTMLElement, Event */

const DOC_PROPS = [
  'fullscreenEnabled',
  'webkitFullscreenEnabled',
  'fullscreenElement',
  'webkitFullscreenElement',
  'exitFullscreen',
  'webkitExitFullscreen'
]
const EL_PROPS = ['requestFullscreen', 'webkitRequestFullscreen']

function setDoc(name, value) {
  Object.defineProperty(document, name, { value, configurable: true, writable: true })
}

function setup(propsOverride = {}, container = document.createElement('div')) {
  const props = { fullscreenable: true, ...propsOverride }
  const emit = vi.fn()
  const containerRef = ref(container)
  let api
  const wrapper = mount({
    template: '<div />',
    setup() {
      api = useFullscreen(props, emit, containerRef)
      return {}
    }
  })
  return { api, emit, wrapper, containerRef, container }
}

function enterFullscreenOf(el, event = 'fullscreenchange', prop = 'fullscreenElement') {
  setDoc(prop, el)
  document.dispatchEvent(new Event(event))
}

describe('useFullscreen', () => {
  beforeEach(() => {
    setDoc('fullscreenEnabled', true)
    setDoc('fullscreenElement', null)
    setDoc('exitFullscreen', vi.fn())
    HTMLElement.prototype.requestFullscreen = vi.fn()
  })

  afterEach(() => {
    DOC_PROPS.forEach((name) => delete document[name])
    EL_PROPS.forEach((name) => delete HTMLElement.prototype[name])
    vi.restoreAllMocks()
  })

  describe('support detection', () => {
    test('is supported when the standard API is available', () => {
      expect(setup().api.isSupported.value).toBe(true)
    })

    test('is supported through the webkit prefix', () => {
      delete document.fullscreenEnabled
      setDoc('webkitFullscreenEnabled', true)
      expect(setup().api.isSupported.value).toBe(true)
    })

    test('is not supported without the API', () => {
      delete document.fullscreenEnabled
      expect(setup().api.isSupported.value).toBe(false)
    })

    test('is not supported when fullscreenable is false', () => {
      expect(setup({ fullscreenable: false }).api.isSupported.value).toBe(false)
    })
  })

  describe('entering', () => {
    test('requests full screen on the container', () => {
      const { api, container } = setup()
      api.enterFullscreen()
      expect(HTMLElement.prototype.requestFullscreen).toHaveBeenCalledTimes(1)
      expect(HTMLElement.prototype.requestFullscreen.mock.contexts[0]).toBe(container)
    })

    test('falls back to the webkit prefixed request', () => {
      delete HTMLElement.prototype.requestFullscreen
      HTMLElement.prototype.webkitRequestFullscreen = vi.fn()
      const { api } = setup()
      api.enterFullscreen()
      expect(HTMLElement.prototype.webkitRequestFullscreen).toHaveBeenCalledTimes(1)
    })

    test('does nothing when unsupported', () => {
      delete document.fullscreenEnabled
      setup().api.enterFullscreen()
      expect(HTMLElement.prototype.requestFullscreen).not.toHaveBeenCalled()
    })

    test('does nothing without a container element', () => {
      const { api } = setup({}, null)
      api.enterFullscreen()
      expect(HTMLElement.prototype.requestFullscreen).not.toHaveBeenCalled()
    })

    test('swallows a rejected request', async () => {
      HTMLElement.prototype.requestFullscreen = vi.fn().mockRejectedValue(new Error('denied'))
      const { api } = setup()
      api.enterFullscreen()
      await Promise.resolve()
      expect(api.isFullscreen.value).toBe(false)
    })

    test('swallows a synchronous throw', () => {
      HTMLElement.prototype.requestFullscreen = vi.fn(() => {
        throw new Error('nope')
      })
      const { api } = setup()
      expect(() => api.enterFullscreen()).not.toThrow()
    })
  })

  describe('state tracking', () => {
    test('follows fullscreenchange for its own container and emits', () => {
      const { api, emit, container } = setup()
      enterFullscreenOf(container)
      expect(api.isFullscreen.value).toBe(true)
      expect(emit).toHaveBeenLastCalledWith('onFullscreenChange', true)

      enterFullscreenOf(null)
      expect(api.isFullscreen.value).toBe(false)
      expect(emit).toHaveBeenLastCalledWith('onFullscreenChange', false)
    })

    test('does not emit again when the state is unchanged', () => {
      const { emit, container } = setup()
      enterFullscreenOf(container)
      enterFullscreenOf(container)
      expect(emit).toHaveBeenCalledTimes(1)
    })

    test('ignores another element going full screen', () => {
      const { api, emit } = setup()
      enterFullscreenOf(document.createElement('video'))
      expect(api.isFullscreen.value).toBe(false)
      expect(emit).not.toHaveBeenCalled()
    })

    test('listens to the webkit prefixed event', () => {
      const { api, container } = setup()
      enterFullscreenOf(container, 'webkitfullscreenchange', 'webkitFullscreenElement')
      expect(api.isFullscreen.value).toBe(true)
    })
  })

  describe('exiting', () => {
    test('exits when this container is full screen', () => {
      const { api, container } = setup()
      enterFullscreenOf(container)
      api.exitFullscreen()
      expect(document.exitFullscreen).toHaveBeenCalledTimes(1)
    })

    test('falls back to the webkit prefixed exit', () => {
      delete document.exitFullscreen
      setDoc('webkitExitFullscreen', vi.fn())
      const { api, container } = setup()
      enterFullscreenOf(container)
      api.exitFullscreen()
      expect(document.webkitExitFullscreen).toHaveBeenCalledTimes(1)
    })

    test('does nothing when not full screen', () => {
      setup().api.exitFullscreen()
      expect(document.exitFullscreen).not.toHaveBeenCalled()
    })
  })

  test('toggleFullscreen enters, then exits', () => {
    const { api, container } = setup()
    api.toggleFullscreen()
    expect(HTMLElement.prototype.requestFullscreen).toHaveBeenCalledTimes(1)
    enterFullscreenOf(container)
    api.toggleFullscreen()
    expect(document.exitFullscreen).toHaveBeenCalledTimes(1)
  })

  test('unmounting removes the listeners and exits full screen', () => {
    const { emit, container, wrapper } = setup()
    enterFullscreenOf(container)
    emit.mockClear()
    wrapper.unmount()
    expect(document.exitFullscreen).toHaveBeenCalledTimes(1)
    enterFullscreenOf(null)
    expect(emit).not.toHaveBeenCalled()
  })
})
