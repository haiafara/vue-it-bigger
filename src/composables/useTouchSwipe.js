export function useTouchSwipe(nextImage, previousImage) {
  let touchStartX = 0
  let touchStartY = 0

  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX
    touchStartY = event.touches[0].clientY
  }

  function handleTouchEnd(event) {
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
