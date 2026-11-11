import { describe, test, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox.vue'

import { mediaWithTwoImagesWithType } from '../fixtures'

describe('LightBox - Unmounting', () => {
  let wrapper

  const html = () => document.querySelector('html').classList
  const body = () => document.querySelector('body').classList

  function mountBox(props = {}) {
    wrapper = mount(LightBox, {
      props: { media: mediaWithTwoImagesWithType, ...props }
    })
    return wrapper
  }

  afterEach(() => {
    wrapper.unmount()
    html().remove('no-scroll')
    body().remove('vib-open')
  })

  test('unmounting while open restores scrolling and the body class', () => {
    mountBox()
    expect(html().contains('no-scroll')).toBe(true)
    expect(body().contains('vib-open')).toBe(true)

    wrapper.unmount()
    expect(html().contains('no-scroll')).toBe(false)
    expect(body().contains('vib-open')).toBe(false)
  })

  test('only releases the body class when disableScroll is false', () => {
    mountBox({ disableScroll: false })
    expect(html().contains('no-scroll')).toBe(false)
    expect(body().contains('vib-open')).toBe(true)

    wrapper.unmount()
    expect(html().contains('no-scroll')).toBe(false)
    expect(body().contains('vib-open')).toBe(false)
  })

  test('unmounting after closing keeps working', async () => {
    mountBox()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(html().contains('no-scroll')).toBe(false)

    wrapper.unmount()
    expect(body().contains('vib-open')).toBe(false)
  })

  test('unmounting a closed lightbox leaves the page classes alone', () => {
    mountBox({ showLightBox: false })
    // e.g. another lightbox opened after this one was mounted
    html().add('no-scroll')
    body().add('vib-open')

    wrapper.unmount()
    expect(html().contains('no-scroll')).toBe(true)
    expect(body().contains('vib-open')).toBe(true)
  })
})
