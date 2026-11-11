import { describe, test, expect, vi } from 'vitest'
import { useTouchSwipe } from '../../src/composables/useTouchSwipe.js'

const point = (x, y) => ({ clientX: x, clientY: y })
const start = (x, y, count = 1) => ({ touches: Array(count).fill(point(x, y)) })
const end = (x, y, remaining = 0) => ({
  touches: Array(remaining).fill(point(x, y)),
  changedTouches: [point(x, y)],
})

describe('useTouchSwipe', () => {
  test('swiping left goes to next, right goes to previous', () => {
    const next = vi.fn()
    const prev = vi.fn()
    const { handleTouchStart, handleTouchEnd } = useTouchSwipe(next, prev)

    handleTouchStart(start(200, 100))
    handleTouchEnd(end(100, 100))
    expect(next).toHaveBeenCalledTimes(1)

    handleTouchStart(start(100, 100))
    handleTouchEnd(end(200, 100))
    expect(prev).toHaveBeenCalledTimes(1)
  })

  test('short or mostly vertical swipes do nothing', () => {
    const next = vi.fn()
    const prev = vi.fn()
    const { handleTouchStart, handleTouchEnd } = useTouchSwipe(next, prev)

    handleTouchStart(start(100, 100))
    handleTouchEnd(end(130, 100))
    handleTouchStart(start(100, 100))
    handleTouchEnd(end(170, 300))
    expect(next).not.toHaveBeenCalled()
    expect(prev).not.toHaveBeenCalled()
  })

  test('does not navigate while blocked (e.g. zoomed)', () => {
    const next = vi.fn()
    const { handleTouchStart, handleTouchEnd } = useTouchSwipe(next, vi.fn(), () => true)
    handleTouchStart(start(200, 100))
    handleTouchEnd(end(100, 100))
    expect(next).not.toHaveBeenCalled()
  })

  test('does not navigate after a multi-touch gesture, then recovers', () => {
    const next = vi.fn()
    const { handleTouchStart, handleTouchEnd } = useTouchSwipe(next, vi.fn())

    handleTouchStart(start(200, 100, 2))
    handleTouchEnd(end(100, 100, 1)) // one finger still down
    handleTouchEnd(end(100, 100, 0)) // last finger up
    expect(next).not.toHaveBeenCalled()

    handleTouchStart(start(200, 100))
    handleTouchEnd(end(100, 100))
    expect(next).toHaveBeenCalledTimes(1)
  })
})
