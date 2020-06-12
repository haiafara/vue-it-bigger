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
      expect(wrapper.find('.vue-lb-container').exists()).toBe(false)
    })
  })

  describe('given one item in the media array', () => {
    const wrapper = mount(LightBox, {
      propsData: {
        media: ['test']
      }
    })

    test('does render the container div', () => {
      expect(wrapper.find('.vue-lb-container').exists()).toBe(true)
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
      expect(wrapper.find('img.vue-lb-image').exists()).toBe(true)
    })

    test('renders one active thumbnail element', () => {
      expect(wrapper.find('div.vue-lb-thumbnail-active').exists()).toBe(true)
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
      expect(wrapper.find('div.vue-lb-thumbnail-active').exists()).toBe(true)
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
      expect(wrapper.find('img.vue-lb-image').element.src).toBe(media[0].src)
    })

    test('the active thumbnail is the first thumbnail', () => {
      expect(wrapper.find('div.vue-lb-thumbnail-active').element.style.backgroundImage).toBe('url(' + media[0].thumb + ')')
    })
  })
})
