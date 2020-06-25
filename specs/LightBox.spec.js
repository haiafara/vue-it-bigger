import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox'

describe('LightBox', () => {
  describe('given an empty media array', () => {
    const wrapper = mount(LightBox, {
      propsData: {
        media: []
      }
    })

    test('does not render the container div', () => {
      expect(wrapper.find('.vib-container').exists()).toBe(false)
    })

    describe('onLightBoxOpen', () => {
      wrapper.vm.onLightBoxOpen()

      test('emits onOpened', () => {
        expect(wrapper.emitted().onOpened).toBeTruthy()
      })

      test('adds the no-scroll class to the html element', () => {
        expect(document.querySelector('html').classList.contains('no-scroll')).toBe(true)
      })

      test('adds the vib-open class to the body element', () => {
        expect(document.querySelector('body').classList.contains('vib-open')).toBe(true)
      })
    })

    describe('onLightBoxClose', () => {
      wrapper.vm.onLightBoxClose()

      test('emits onClosed', () => {
        expect(wrapper.emitted().onClosed).toBeTruthy()
      })
    })

    describe('onToggleLightBox(true)', () => {
      wrapper.vm.onLightBoxOpen = jest.fn()
      wrapper.vm.onToggleLightBox(true)

      test('calls onLightBoxOpen', () => {
        expect(wrapper.vm.onLightBoxOpen).toHaveBeenCalled()
      })
    })

    describe('onToggleLightBox()', () => {
      wrapper.vm.onLightBoxClose = jest.fn()
      wrapper.vm.onToggleLightBox()

      test('calls onLightBoxClose', () => {
        expect(wrapper.vm.onLightBoxClose).toHaveBeenCalled()
      })
    })
  })

  describe('given one item in the media array', () => {
    const wrapper = mount(LightBox, {
      propsData: {
        media: ['test']
      }
    })

    test('does render the container div', () => {
      expect(wrapper.find('.vib-container').exists()).toBe(true)
    })
  })

  describe('given one image in the media array', () => {
    const wrapper = mount(LightBox, {
      propsData: {
        media: [
          {
            thumb: 'test-thumb.jpg',
            src: 'test-image.jpg'
          }
        ]
      }
    })

    test('renders the image', () => {
      expect(wrapper.find('img.vib-image').exists()).toBe(true)
    })

    test('renders one active thumbnail element', () => {
      expect(wrapper.find('div.vib-thumbnail-active').exists()).toBe(true)
    })
  })

  describe('given one video in the media array', () => {
    const wrapper = mount(LightBox, {
      propsData: {
        media: [
          {
            type: 'video',
            thumb: 'test-thumb.jpg',
            sources: [
              {
                src: 'test-video.mp4'
              }
            ]
          }
        ]
      }
    })

    test('renders one video element', () => {
      expect(wrapper.find('video').exists()).toBe(true)
    })

    test('renders one active thumbnail element', () => {
      expect(wrapper.find('div.vib-thumbnail-active').exists()).toBe(true)
    })
  })

  describe('given multiple images in the media array', () => {
    const media = [
      {
        thumb: 'http://test/test-thumb-1.jpg',
        src: 'http://test/test-image-1.jpg'
      },
      {
        thumb: 'test-thumb-2.jpg',
        src: 'test-image-2.jpg'
      },
      {
        thumb: 'test-thumb-3.jpg',
        src: 'test-image-3.jpg'
      }
    ]

    const wrapper = mount(LightBox, {
      propsData: {
        media: media
      }
    })

    test('the rendered image is the first image', () => {
      expect(wrapper.find('img.vib-image').element.src).toBe(media[0].src)
    })

    test('the active thumbnail is the first thumbnail', () => {
      expect(wrapper.find('div.vib-thumbnail-active').element.style.backgroundImage).toBe('url(' + media[0].thumb + ')')
    })
  })
})
