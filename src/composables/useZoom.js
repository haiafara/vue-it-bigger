import { ref, computed, onBeforeUnmount } from 'vue'

const ZOOM_STEP = 1.5
const WHEEL_SENSITIVITY = 0.002

export function useZoom(props, currentMedia, zoomEl) {
  const scale = ref(1)
  const translateX = ref(0)
  const translateY = ref(0)
  const isPanning = ref(false)
  const isPinching = ref(false)

  const isZoomed = computed(() => scale.value > 1)
  const isMaxZoom = computed(() => scale.value >= props.maxZoom)

  const canZoom = computed(() => {
    const media = currentMedia.value
    return (
      props.zoomable &&
      !!media &&
      (media.type === undefined || media.type === 'image')
    )
  })

  const transformStyle = computed(() => ({
    transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
    transition: isPanning.value || isPinching.value ? 'none' : undefined,
  }))

  function clampScale(value) {
    return Math.min(Math.max(value, 1), Math.max(props.maxZoom, 1))
  }

  function clampPan() {
    const el = zoomEl.value
    const width = el ? el.offsetWidth : 0
    const height = el ? el.offsetHeight : 0
    const maxX = Math.max(0, (width * scale.value - window.innerWidth) / 2)
    const maxY = Math.max(0, (height * scale.value - window.innerHeight) / 2)
    translateX.value = Math.min(Math.max(translateX.value, -maxX), maxX)
    translateY.value = Math.min(Math.max(translateY.value, -maxY), maxY)
  }

  // originX / originY are relative to the centre of the viewport
  function zoomTo(newScale, originX = 0, originY = 0) {
    const next = clampScale(newScale)
    const ratio = next / scale.value
    translateX.value = originX - (originX - translateX.value) * ratio
    translateY.value = originY - (originY - translateY.value) * ratio
    scale.value = next
    if (next === 1) {
      translateX.value = 0
      translateY.value = 0
    } else {
      clampPan()
    }
  }

  function zoomIn() {
    if (canZoom.value) zoomTo(scale.value * ZOOM_STEP)
  }

  function zoomOut() {
    if (canZoom.value) zoomTo(scale.value / ZOOM_STEP)
  }

  function resetZoom() {
    scale.value = 1
    translateX.value = 0
    translateY.value = 0
    isPanning.value = false
    isPinching.value = false
    stopMousePan()
  }

  function toViewportOrigin(clientX, clientY) {
    return [clientX - window.innerWidth / 2, clientY - window.innerHeight / 2]
  }

  // --- Scroll wheel ---

  function handleWheel(event) {
    if (!canZoom.value) return
    event.preventDefault()
    const [x, y] = toViewportOrigin(event.clientX, event.clientY)
    zoomTo(scale.value * Math.exp(-event.deltaY * WHEEL_SENSITIVITY), x, y)
  }

  // --- Mouse panning ---

  let panStartX = 0
  let panStartY = 0
  let panOriginX = 0
  let panOriginY = 0

  function onMouseMove(event) {
    translateX.value = panOriginX + (event.clientX - panStartX)
    translateY.value = panOriginY + (event.clientY - panStartY)
    clampPan()
  }

  function onMouseUp() {
    isPanning.value = false
    stopMousePan()
  }

  function stopMousePan() {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  function handleMouseDown(event) {
    if (!isZoomed.value || event.button !== 0) return
    event.preventDefault()
    isPanning.value = true
    panStartX = event.clientX
    panStartY = event.clientY
    panOriginX = translateX.value
    panOriginY = translateY.value
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  // --- Touch: pinch and one-finger pan ---

  let pinchStartDistance = 0
  let pinchStartScale = 1

  function touchDistance(touches) {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY,
    )
  }

  function touchMidpoint(touches) {
    return toViewportOrigin(
      (touches[0].clientX + touches[1].clientX) / 2,
      (touches[0].clientY + touches[1].clientY) / 2,
    )
  }

  function startOneFingerPan(touch) {
    isPanning.value = true
    panStartX = touch.clientX
    panStartY = touch.clientY
    panOriginX = translateX.value
    panOriginY = translateY.value
  }

  function handleZoomTouchStart(event) {
    if (!canZoom.value) return
    if (event.touches.length === 2) {
      isPanning.value = false
      isPinching.value = true
      pinchStartDistance = touchDistance(event.touches)
      pinchStartScale = scale.value
    } else if (event.touches.length === 1 && isZoomed.value) {
      startOneFingerPan(event.touches[0])
    }
  }

  function handleZoomTouchMove(event) {
    if (!canZoom.value) return
    if (isPinching.value && event.touches.length === 2) {
      event.preventDefault()
      const distance = touchDistance(event.touches)
      const [x, y] = touchMidpoint(event.touches)
      zoomTo((pinchStartScale * distance) / pinchStartDistance, x, y)
    } else if (isPanning.value && event.touches.length === 1) {
      event.preventDefault()
      const touch = event.touches[0]
      translateX.value = panOriginX + (touch.clientX - panStartX)
      translateY.value = panOriginY + (touch.clientY - panStartY)
      clampPan()
    }
  }

  function handleZoomTouchEnd(event) {
    if (event.touches.length < 2) isPinching.value = false
    if (event.touches.length === 1 && isZoomed.value) {
      // A finger remains after a pinch: continue as a pan from here
      startOneFingerPan(event.touches[0])
    } else if (event.touches.length === 0) {
      isPanning.value = false
    }
  }

  onBeforeUnmount(stopMousePan)

  return {
    scale,
    translateX,
    translateY,
    isZoomed,
    isMaxZoom,
    isPanning,
    isPinching,
    canZoom,
    transformStyle,
    zoomTo,
    zoomIn,
    zoomOut,
    resetZoom,
    handleWheel,
    handleMouseDown,
    handleZoomTouchStart,
    handleZoomTouchMove,
    handleZoomTouchEnd,
  }
}
