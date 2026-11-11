export function useTouchSwipe(nextImage, previousImage, isBlocked = () => false) {
  let touchStartX = 0
  let touchStartY = 0
  let multiTouch = false

  function handleTouchStart(event) {
    if (event.touches.length > 1) multiTouch = true
    touchStartX = event.touches[0].clientX
    touchStartY = event.touches[0].clientY
  }

  function handleTouchEnd(event) {
    const wasMultiTouch = multiTouch
    // The gesture is over once the last finger lifts
    if (!event.touches || event.touches.length === 0) multiTouch = false

    if (wasMultiTouch || isBlocked()) return

    const touchEndX = event.changedTouches[0].clientX
    const touchEndY = event.changedTouches[0].clientY
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY

    // Detect horizontal swipe (more horizontal than vertical movement)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        previousImage()
      } else {
        nextImage()
      }
    }
  }

  return { handleTouchStart, handleTouchEnd }
}
