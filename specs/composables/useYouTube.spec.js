import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref } from 'vue'
import { useYouTube } from '../../src/composables/useYouTube.js'

describe('useYouTube composable', () => {
  let props
  let select

  beforeEach(() => {
    // Set up DOM with a script tag (needed for loadYouTubeApi)
    document.body.innerHTML = '<script src="test.js"></script><div id="youtube-player-0"></div><div id="youtube-player-1"></div>'

    props = {
      media: [
        { type: 'image', src: 'test.jpg' },
        { type: 'youtube', id: 'abc123' },
        { type: 'youtube', id: 'def456' }
      ]
    }
    select = ref(0)

    // Clean up global state
    delete window.YT
    delete window.onYouTubeIframeAPIReady
  })

  afterEach(() => {
    document.body.innerHTML = ''
    delete window.YT
    delete window.onYouTubeIframeAPIReady
  })

  test('initializes with empty visited indices', () => {
    const { visitedYoutubeIndices } = useYouTube(props, select)
    expect(visitedYoutubeIndices.value.size).toBe(0)
  })

  test('markVisited adds index to visited set', () => {
    const { markVisited, visitedYoutubeIndices } = useYouTube(props, select)

    markVisited(1)
    expect(visitedYoutubeIndices.value.has(1)).toBe(true)

    markVisited(2)
    expect(visitedYoutubeIndices.value.has(2)).toBe(true)
    expect(visitedYoutubeIndices.value.size).toBe(2)
  })

  test('initYouTubePlayer returns early if media type is not youtube', () => {
    const { initYouTubePlayer } = useYouTube(props, select)

    // Should not throw when trying to init non-YouTube media
    expect(() => initYouTubePlayer(0)).not.toThrow()
  })

  test('initYouTubePlayer returns early if iframe does not exist', () => {
    document.body.innerHTML = '' // Remove iframes

    const mockPlayer = vi.fn()
    const MockPlayer = vi.fn(function() { return mockPlayer() })
    window.YT = { Player: MockPlayer }

    const { initYouTubePlayer } = useYouTube(props, select)

    initYouTubePlayer(1)

    // Should not have created a player
    expect(MockPlayer).not.toHaveBeenCalled()
  })

  test('initYouTubePlayer loads API if YT is not defined', () => {
    const { initYouTubePlayer } = useYouTube(props, select)

    initYouTubePlayer(1)

    // Should have set up the callback
    expect(window.onYouTubeIframeAPIReady).toBeDefined()
    expect(typeof window.onYouTubeIframeAPIReady).toBe('function')
  })

  test('initYouTubePlayer loads API if YT.Player is not defined', () => {
    window.YT = {} // YT exists but no Player

    const { initYouTubePlayer } = useYouTube(props, select)

    initYouTubePlayer(1)

    // Should have set up the callback
    expect(window.onYouTubeIframeAPIReady).toBeDefined()
  })

  test('initYouTubePlayer creates player when YT API is ready', () => {
    const mockPlayer = { pauseVideo: vi.fn(), destroy: vi.fn() }
    const MockPlayer = vi.fn(function() { return mockPlayer })
    window.YT = { Player: MockPlayer }

    const { initYouTubePlayer } = useYouTube(props, select)

    initYouTubePlayer(1)

    expect(MockPlayer).toHaveBeenCalledWith('youtube-player-1', {
      events: {
        onReady: expect.any(Function),
        onError: expect.any(Function)
      }
    })
  })

  test('initYouTubePlayer does not create duplicate players', () => {
    const mockPlayer = { pauseVideo: vi.fn(), destroy: vi.fn() }
    const MockPlayer = vi.fn(function() { return mockPlayer })
    window.YT = { Player: MockPlayer }

    const { initYouTubePlayer } = useYouTube(props, select)

    initYouTubePlayer(1)
    initYouTubePlayer(1) // Call again

    // Should only be called once
    expect(MockPlayer).toHaveBeenCalledTimes(1)
  })

  test('onYouTubeIframeAPIReady callback initializes visited players', () => {
    const { initYouTubePlayer, markVisited } = useYouTube(props, select)

    // Mark YouTube indices as visited before API loads (indices 1 and 2 are YouTube, but we only have iframes for 0 and 1)
    // So we'll add iframe for index 2
    document.body.innerHTML += '<div id="youtube-player-2"></div>'

    markVisited(1)
    markVisited(2)

    // Trigger init which sets up the callback (use index 1 which is YouTube)
    initYouTubePlayer(1)

    // Now simulate API loading
    const mockPlayer = { pauseVideo: vi.fn(), destroy: vi.fn() }
    const MockPlayer = vi.fn(function() { return mockPlayer })
    window.YT = { Player: MockPlayer }

    window.onYouTubeIframeAPIReady()

    // Should have created players for both visited indices
    expect(MockPlayer).toHaveBeenCalledTimes(2)
  })

  test('pauseYouTubeVideo pauses the player', () => {
    const mockPlayer = {
      pauseVideo: vi.fn(),
      destroy: vi.fn()
    }
    const MockPlayer = vi.fn(function() { return mockPlayer })
    window.YT = { Player: MockPlayer }

    const { initYouTubePlayer, pauseYouTubeVideo } = useYouTube(props, select)

    initYouTubePlayer(1)
    pauseYouTubeVideo(1)

    expect(mockPlayer.pauseVideo).toHaveBeenCalled()
  })

  test('pauseYouTubeVideo handles errors gracefully', () => {
    const mockPlayer = {
      pauseVideo: vi.fn(() => { throw new Error('Pause failed') }),
      destroy: vi.fn()
    }
    const MockPlayer = vi.fn(function() { return mockPlayer })
    window.YT = { Player: MockPlayer }

    const { initYouTubePlayer, pauseYouTubeVideo } = useYouTube(props, select)

    initYouTubePlayer(1)

    // Should not throw
    expect(() => pauseYouTubeVideo(1)).not.toThrow()
  })

  test('pauseYouTubeVideo handles missing pauseVideo method', () => {
    const mockPlayer = { destroy: vi.fn() } // No pauseVideo
    const MockPlayer = vi.fn(function() { return mockPlayer })
    window.YT = { Player: MockPlayer }

    const { initYouTubePlayer, pauseYouTubeVideo } = useYouTube(props, select)

    initYouTubePlayer(1)

    // Should not throw
    expect(() => pauseYouTubeVideo(1)).not.toThrow()
  })

  test('pauseYouTubeVideo uses current select if no index provided', () => {
    const mockPlayer = {
      pauseVideo: vi.fn(),
      destroy: vi.fn()
    }
    const MockPlayer = vi.fn(function() { return mockPlayer })
    window.YT = { Player: MockPlayer }

    const { initYouTubePlayer, pauseYouTubeVideo } = useYouTube(props, select)

    select.value = 1
    initYouTubePlayer(1)

    pauseYouTubeVideo() // No index

    expect(mockPlayer.pauseVideo).toHaveBeenCalled()
  })

  test('cleanupYouTubePlayers destroys all players', () => {
    // Add iframe for index 2
    document.body.innerHTML += '<div id="youtube-player-2"></div>'

    const mockPlayer1 = { pauseVideo: vi.fn(), destroy: vi.fn() }
    const mockPlayer2 = { pauseVideo: vi.fn(), destroy: vi.fn() }

    let callCount = 0
    const MockPlayer = vi.fn(function() {
      return callCount++ === 0 ? mockPlayer1 : mockPlayer2
    })
    window.YT = { Player: MockPlayer }

    const { initYouTubePlayer, cleanupYouTubePlayers } = useYouTube(props, select)

    initYouTubePlayer(1)  // Use YouTube indices (1 and 2)
    initYouTubePlayer(2)

    cleanupYouTubePlayers()

    expect(mockPlayer1.destroy).toHaveBeenCalled()
    expect(mockPlayer2.destroy).toHaveBeenCalled()
  })

  test('cleanupYouTubePlayers handles destroy errors', () => {
    const mockPlayer = {
      pauseVideo: vi.fn(),
      destroy: vi.fn(() => { throw new Error('Destroy failed') })
    }
    const MockPlayer = vi.fn(function() { return mockPlayer })
    window.YT = { Player: MockPlayer }

    const { initYouTubePlayer, cleanupYouTubePlayers } = useYouTube(props, select)

    initYouTubePlayer(1)

    // Should not throw despite error
    expect(() => cleanupYouTubePlayers()).not.toThrow()
  })

  test('cleanupYouTubePlayers handles missing destroy method', () => {
    const mockPlayer = { pauseVideo: vi.fn() } // No destroy
    const MockPlayer = vi.fn(function() { return mockPlayer })
    window.YT = { Player: MockPlayer }

    const { initYouTubePlayer, cleanupYouTubePlayers } = useYouTube(props, select)

    initYouTubePlayer(1)

    // Should not throw
    expect(() => cleanupYouTubePlayers()).not.toThrow()
  })
})
