import { ref } from 'vue'

export function useUIControls(props) {
  const controlsHidden = ref(false)
  const interfaceHovered = ref(false)
  let interactionTimer = null

  function startInteractionTimer() {
    interactionTimer = setTimeout(() => {
      controlsHidden.value = true
    }, props.interfaceHideTime)
  }

  function stopInteractionTimer() {
    interactionTimer = null
  }

  function handleMouseActivity() {
    clearTimeout(interactionTimer)

    if (controlsHidden.value) {
      controlsHidden.value = false
    }

    if (interfaceHovered.value) {
      stopInteractionTimer()
    } else {
      startInteractionTimer()
    }
  }

  function clearInteraction() {
    clearTimeout(interactionTimer)
  }

  return {
    controlsHidden,
    interfaceHovered,
    handleMouseActivity,
    startInteractionTimer,
    stopInteractionTimer,
    clearInteraction,
  }
}
