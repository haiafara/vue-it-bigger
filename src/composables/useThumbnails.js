import { ref, computed, watch, onBeforeUnmount } from 'vue'

// A bit longer than the 0.3s slide of the strip (see style.css)
const SETTLE_MS = 350

export function useThumbnails(props, select, imagesThumb) {
  // The index the strip last settled on. While the strip slides from there to
  // the current index, every thumbnail in between has to be rendered.
  const anchor = ref(select.value)
  let timer = null

  watch(select, () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      anchor.value = select.value
    }, SETTLE_MS)
  })

  onBeforeUnmount(() => clearTimeout(timer))

  // Only a slice of the thumbnails is rendered, so that the browser doesn't
  // fetch all of them when the lightbox opens. The slice covers everything the
  // strip can show around the current index, plus a spare one on each side.
  const renderedThumbs = computed(() => {
    const spare = props.nThumbs + 1
    const first = Math.max(0, Math.min(anchor.value, select.value) - spare)
    const last = Math.min(
      imagesThumb.value.length - 1,
      Math.max(anchor.value, select.value) + spare
    )

    const thumbs = []
    for (let index = first; index <= last; index++) {
      thumbs.push({ index, ...imagesThumb.value[index] })
    }
    return thumbs
  })

  // The position of the strip is worked out in CSS from these
  const thumbStyle = computed(() => ({
    '--vib-thumbs-count': imagesThumb.value.length,
    '--vib-thumbs-max': props.nThumbs,
    '--vib-thumb-index': select.value,
  }))

  return { renderedThumbs, thumbStyle }
}
