import { ref, computed } from 'vue'

export function useNavigation(props) {
  const select = ref(props.startAt)
  const slideDirection = ref('next')
  const imageTransitionsEnabled = ref(false)

  const imageTransitionName = computed(() => {
    if (!imageTransitionsEnabled.value) return 'vib-image-no-transition'
    return slideDirection.value === 'next'
      ? 'vib-image-slide-next'
      : 'vib-image-slide-prev'
  })

  const currentMedia = computed(() => props.media[select.value])

  const thumbIndex = computed(() => {
    const halfDown = Math.floor(props.nThumbs / 2)

    if (select.value >= halfDown && select.value < props.media.length - halfDown)
      return {
        begin: select.value - halfDown + (1 - props.nThumbs % 2),
        end: select.value + halfDown,
      }

    if (select.value < halfDown)
      return {
        begin: 0,
        end: props.nThumbs - 1,
      }

    return {
      begin: props.media.length - props.nThumbs,
      end: props.media.length - 1,
    }
  })

  const imagesThumb = computed(() =>
    props.media.map(({ thumb, type }) => ({ thumb, type }))
  )

  function showImage(index) {
    slideDirection.value = index > select.value ? 'next' : 'prev'
    select.value = index
  }

  function nextImage() {
    slideDirection.value = 'next'
    select.value = (select.value + 1) % props.media.length
  }

  function previousImage() {
    slideDirection.value = 'prev'
    select.value = (select.value + props.media.length - 1) % props.media.length
  }

  function enableImageTransition() {
    imageTransitionsEnabled.value = true
  }

  function disableImageTransition() {
    imageTransitionsEnabled.value = false
  }

  function preloadAdjacentImages() {
    const len = props.media.length
    if (len <= 1) return

    const nextIndex = (select.value + 1) % len
    const prevIndex = (select.value + len - 1) % len

    ;[nextIndex, prevIndex].forEach(index => {
      const item = props.media[index]
      if (item.type === undefined || item.type === 'image') {
        const img = new Image()
        img.src = item.src
        if (item.srcset) {
          img.srcset = item.srcset
        }
      }
    })
  }

  return {
    select,
    slideDirection,
    imageTransitionsEnabled,
    imageTransitionName,
    currentMedia,
    thumbIndex,
    imagesThumb,
    showImage,
    nextImage,
    previousImage,
    enableImageTransition,
    disableImageTransition,
    preloadAdjacentImages,
  }
}
