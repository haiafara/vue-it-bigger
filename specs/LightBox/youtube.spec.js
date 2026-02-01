import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox.vue'

import {
  mediaWithOneYoutube,
  mediaMixed
} from '../fixtures'

describe('LightBox - YouTube Integration', () => {
  let wrapper

  beforeEach(() => {
    // Mock YT API to avoid loading issues
    window.YT = {
      Player: vi.fn().mockImplementation(() => ({
        pauseVideo: vi.fn(),
        destroy: vi.fn()
      }))
    }
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    document.querySelector('html').classList.remove('no-scroll')
    document.querySelector('body').classList.remove('vib-open')
    delete window.YT
    delete window.onYouTubeIframeAPIReady
    vi.restoreAllMocks()
  })

  test('renders YouTube iframe when media type is youtube', async () => {
    wrapper = mount(LightBox, {
      props: {
        media: mediaWithOneYoutube
      }
    })

    await wrapper.vm.$nextTick()

    // The iframe should be rendered after component mounts
    const iframe = wrapper.find('iframe[id^="youtube-player-"]')
    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('src')).toContain('youtube.com/embed/testid')
  })

  test('marks YouTube video as visited when navigating to it', async () => {
    wrapper = mount(LightBox, {
      props: {
        media: mediaMixed, // [image, video, youtube]
        startAt: 0
      }
    })

    // YouTube iframe should not be in DOM initially
    expect(wrapper.find('iframe[id="youtube-player-2"]').exists()).toBe(false)

    // Navigate to YouTube (index 2)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await wrapper.vm.$nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await wrapper.vm.$nextTick()

    // Now iframe should exist (marked as visited)
    expect(wrapper.find('iframe[id="youtube-player-2"]').exists()).toBe(true)
  })

  test('YouTube iframe persists when navigating away and back', async () => {
    wrapper = mount(LightBox, {
      props: {
        media: mediaMixed,
        startAt: 2 // Start at YouTube
      }
    })

    await wrapper.vm.$nextTick()

    // Should have iframe after nextTick
    expect(wrapper.find('iframe[id="youtube-player-2"]').exists()).toBe(true)

    // Navigate away
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await wrapper.vm.$nextTick()

    // Navigate back
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    await wrapper.vm.$nextTick()

    // Iframe should still exist (preserves playback state)
    expect(wrapper.find('iframe[id="youtube-player-2"]').exists()).toBe(true)
  })

  test('displays video icon in thumbnail for YouTube videos', () => {
    wrapper = mount(LightBox, {
      props: {
        media: mediaMixed
      }
    })

    const thumbnails = wrapper.findAll('.vib-thumbnail, .vib-thumbnail-active')
    // The third thumbnail (YouTube) should have a video icon
    const youtubeThumbnail = thumbnails[2]
    expect(youtubeThumbnail.find('svg').exists()).toBe(true)
  })
})
