import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export function useFullscreen(props, emit, containerRef) {
  const isFullscreen = ref(false)

  const isSupported = computed(
    () =>
      props.fullscreenable &&
      !!(document.fullscreenEnabled || document.webkitFullscreenEnabled),
  )

  function currentElement() {
    return document.fullscreenElement || document.webkitFullscreenElement
  }

  // Runs the browser call, swallowing both sync throws and rejected promises
  // (e.g. when the request isn't triggered by a user gesture)
  function attempt(fn) {
    new Promise((resolve) => resolve(fn())).catch(() => {})
  }

  function onFullscreenChange() {
    const element = currentElement()
    const active = !!element && element === containerRef.value
    if (active !== isFullscreen.value) {
      isFullscreen.value = active
      emit('onFullscreenChange', active)
    }
  }

  function enterFullscreen() {
    const el = containerRef.value
    if (!isSupported.value || !el) return
    const request = el.requestFullscreen || el.webkitRequestFullscreen
    attempt(() => request.call(el))
  }

  function exitFullscreen() {
    if (!isFullscreen.value) return
    const exit = document.exitFullscreen || document.webkitExitFullscreen
    attempt(() => exit.call(document))
  }

  function toggleFullscreen() {
    if (isFullscreen.value) exitFullscreen()
    else enterFullscreen()
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', onFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
    exitFullscreen()
  })

  return {
    isFullscreen,
    isSupported,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  }
}
