import { ref } from 'vue'

export function useLightboxLifecycle(
  props, emit, videoRef,
  pauseYouTubeVideo, preloadAdjacentImages, addKeyEventHandler
) {
  const lightBoxShown = ref(props.showLightBox)

  function onLightBoxOpen() {
    emit('onOpened')

    if (props.disableScroll) {
      document.querySelector('html').classList.add('no-scroll')
    }

    document.querySelector('body').classList.add('vib-open')
    document.addEventListener('keydown', addKeyEventHandler)

    if (videoRef.value && videoRef.value.autoplay) {
      videoRef.value.play()
    }

    preloadAdjacentImages()
  }

  // Undo what opening the lightbox did to the page (scroll lock, body class)
  function releasePage() {
    if (props.disableScroll) {
      document.querySelector('html').classList.remove('no-scroll')
    }

    document.querySelector('body').classList.remove('vib-open')
  }

  function onLightBoxClose() {
    emit('onClosed')

    releasePage()
    document.removeEventListener('keydown', addKeyEventHandler)

    if (videoRef.value) {
      videoRef.value.pause()
      videoRef.value.currentTime = '0'
    }

    // Pause YouTube video when closing lightbox
    pauseYouTubeVideo()
  }

  function onToggleLightBox(value) {
    if (value) onLightBoxOpen()
    else onLightBoxClose()
  }

  function closeLightBox() {
    if (videoRef.value) videoRef.value.pause()
    // Pause YouTube video when closing lightbox
    pauseYouTubeVideo()
    if (!props.closable) return
    lightBoxShown.value = false
  }

  return {
    lightBoxShown,
    closeLightBox,
    onToggleLightBox,
    releasePage,
  }
}
