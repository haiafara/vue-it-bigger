import { ref } from 'vue'

export function useYouTube(props, select) {
  // Non-reactive Map: Vue's Proxy wrapping breaks YT.Player API methods
  const youtubePlayers = new Map()

  const visitedYoutubeIndices = ref(new Set())
  const youtubeApiLoaded = ref(false)

  function loadYouTubeApi() {
    if (youtubeApiLoaded.value) return

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    // Set up global callback for YouTube API
    window.onYouTubeIframeAPIReady = () => {
      youtubeApiLoaded.value = true
      // Initialize players for all visited YouTube items
      visitedYoutubeIndices.value.forEach((index) => {
        initYouTubePlayer(index)
      })
    }
  }

  function initYouTubePlayer(index) {
    if (index === undefined) index = select.value

    if (!props.media[index] || props.media[index].type !== 'youtube') {
      return
    }

    const iframeId = 'youtube-player-' + index
    const iframe = document.getElementById(iframeId)

    if (!iframe) return

    // If API is not loaded yet, load it
    if (!window.YT || !window.YT.Player) {
      loadYouTubeApi()
      return
    }

    // Skip if player already exists for this index
    if (youtubePlayers.has(index)) {
      return
    }

    const player = new window.YT.Player(iframeId, {
      events: {
        onReady: () => {},
        onError: () => {},
      },
    })

    youtubePlayers.set(index, player)
  }

  function pauseYouTubeVideo(index) {
    if (index === undefined) index = select.value

    const player = youtubePlayers.get(index)
    if (player && typeof player.pauseVideo === 'function') {
      try {
        player.pauseVideo()
      } catch {
        // Error pausing YouTube video
      }
    }
  }

  function markVisited(index) {
    visitedYoutubeIndices.value.add(index)
  }

  function cleanupYouTubePlayers() {
    youtubePlayers.forEach((player) => {
      if (player && typeof player.destroy === 'function') {
        try {
          player.destroy()
        } catch {
          // Error destroying YouTube player
        }
      }
    })
    youtubePlayers.clear()
  }

  return {
    visitedYoutubeIndices,
    youtubeApiLoaded,
    initYouTubePlayer,
    pauseYouTubeVideo,
    markVisited,
    cleanupYouTubePlayers,
  }
}
