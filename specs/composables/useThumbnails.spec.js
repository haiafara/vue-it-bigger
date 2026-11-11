import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref, computed } from 'vue'
import { mount } from '@vue/test-utils'
import { useThumbnails } from '../../src/composables/useThumbnails.js'

function setup({ count = 20, nThumbs = 3, start = 0 } = {}) {
  const props = { nThumbs }
  const select = ref(start)
  const imagesThumb = computed(() =>
    Array.from({ length: count }, (_, i) => ({ thumb: `thumb-${i}.jpg`, type: undefined }))
  )
  let api
  const wrapper = mount({
    template: '<div />',
    setup() {
      api = useThumbnails(props, select, imagesThumb)
      return {}
    }
  })
  const indices = () => api.renderedThumbs.value.map((t) => t.index)
  return { api, select, wrapper, indices, props }
}

describe('useThumbnails', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('thumbStyle', () => {
    test('exposes the count, the maximum and the current index', () => {
      const { api, select } = setup({ count: 20, nThumbs: 5, start: 2 })
      expect(api.thumbStyle.value).toEqual({
        '--vib-thumbs-count': 20,
        '--vib-thumbs-max': 5,
        '--vib-thumb-index': 2
      })
      select.value = 7
      expect(api.thumbStyle.value['--vib-thumb-index']).toBe(7)
    })
  })

  describe('renderedThumbs', () => {
    test('renders the current thumbnail with a spare nThumbs + 1 on each side', () => {
      const { indices } = setup({ nThumbs: 3, start: 10 })
      expect(indices()).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14])
    })

    test('is clamped to the start and the end of the gallery', () => {
      const first = setup({ nThumbs: 3, start: 0 })
      expect(first.indices()).toEqual([0, 1, 2, 3, 4])

      const last = setup({ nThumbs: 3, start: 19 })
      expect(last.indices()).toEqual([15, 16, 17, 18, 19])
    })

    test('renders everything for a small gallery', () => {
      const { indices } = setup({ count: 4, nThumbs: 7 })
      expect(indices()).toEqual([0, 1, 2, 3])
    })

    test('keeps the thumb and the type of each media item', () => {
      const { api } = setup({ count: 2 })
      expect(api.renderedThumbs.value[1]).toEqual({ index: 1, thumb: 'thumb-1.jpg', type: undefined })
    })

    test('covers the whole stretch to a distant index while the strip slides', async () => {
      const { select, indices } = setup({ count: 100, nThumbs: 3, start: 0 })
      select.value = 90
      await Promise.resolve()
      const during = indices()
      expect(during[0]).toBe(0)
      expect(during[during.length - 1]).toBe(94)
      expect(during.length).toBe(95)
    })

    test('goes back to the usual slice once the strip has settled', async () => {
      const { select, indices } = setup({ count: 100, nThumbs: 3, start: 0 })
      select.value = 90
      await Promise.resolve()
      vi.advanceTimersByTime(349)
      expect(indices().length).toBe(95)
      vi.advanceTimersByTime(2)
      await Promise.resolve()
      expect(indices()).toEqual([86, 87, 88, 89, 90, 91, 92, 93, 94])
    })

    test('restarts the wait when the index changes again', async () => {
      const { select, indices } = setup({ count: 100, nThumbs: 3, start: 0 })
      select.value = 50
      await Promise.resolve()
      vi.advanceTimersByTime(300)
      select.value = 51
      await Promise.resolve()
      vi.advanceTimersByTime(300)
      expect(indices()[0]).toBe(0)
      vi.advanceTimersByTime(100)
      await Promise.resolve()
      expect(indices()[0]).toBe(47)
    })

    test('does not update after being unmounted', async () => {
      const { select, indices, wrapper } = setup({ count: 100, nThumbs: 3, start: 0 })
      select.value = 90
      await Promise.resolve()
      wrapper.unmount()
      vi.advanceTimersByTime(1000)
      await Promise.resolve()
      expect(indices()[0]).toBe(0)
    })
  })
})
