import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox'

import { mediaWithNineImages } from '../props'

describe('LightBox', () => {
  describe('given multiple images in the media array', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LightBox, {
        propsData: {
          media: mediaWithNineImages
        }
      })
    })

    test('the rendered image is the first image from the media array', () => {
      expect(wrapper.find('img.vib-image').element.src).toBe(mediaWithNineImages[0].src)
    })

    test('the active thumbnail is the first thumbnail from the media array', () => {
      expect(wrapper.find('div.vib-thumbnail-active').element.style.backgroundImage).toBe('url(' + mediaWithNineImages[0].thumb + ')')
    })

    // thumbnails

    test('there is one active thumbnail', () => {
      expect(wrapper.findAll('div.vib-thumbnail-active').length).toBe(1)
    })

    test('there are six other thumbnails displayed', () => {
      expect(wrapper.findAll('div.vib-thumbnail:not([style*="display: none"])').length).toBe(6)
    })

    test('the first thumbnail displayed has vib-thumbnail-active', () => {
      expect(wrapper.findAll('.vib-thumbnail-wrapper div:not([style*="display: none"])').at(0).element.classList.contains('vib-thumbnail-active')).toBe(true)
    })

    test('the last thumbnail displayed is the seventh from the media array', () => {
      expect(wrapper.findAll('.vib-thumbnail-wrapper div:not([style*="display: none"])').at(6).element.style.backgroundImage).toBe('url(' + mediaWithNineImages[6].thumb + ')')
    })

    describe('showImage with the last image index', () => {
      const imageIndex = 8

      beforeEach(() => {
        wrapper.vm.showImage(imageIndex)
      })

      test('the rendered image is the image with the given index from the media array', () => {
        expect(wrapper.find('img.vib-image').element.src).toBe(mediaWithNineImages[imageIndex].src)
      })

      test('the active thumbnail is the one with the given index from the media array', () => {
        expect(wrapper.find('div.vib-thumbnail-active').element.style.backgroundImage).toBe('url(' + mediaWithNineImages[imageIndex].thumb + ')')
      })

      test('the first thumbnail displayed is the third from the media array', () => {
        expect(wrapper.findAll('.vib-thumbnail-wrapper div:not([style*="display: none"])').at(0).element.style.backgroundImage).toBe('url(' + mediaWithNineImages[2].thumb + ')')
      })

      test('the last thumbnail displayed is the ninth from the media array', () => {
        expect(wrapper.findAll('.vib-thumbnail-wrapper div:not([style*="display: none"])').at(6).element.style.backgroundImage).toBe('url(' + mediaWithNineImages[8].thumb + ')')
      })
    })

    describe('showImage with the middle image index', () => {
      const imageIndex = 4

      beforeEach(() => {
        wrapper.vm.showImage(imageIndex)
      })

      test('the first thumbnail displayed is the second from the media array', () => {
        expect(wrapper.findAll('.vib-thumbnail-wrapper div:not([style*="display: none"])').at(0).element.style.backgroundImage).toBe('url(' + mediaWithNineImages[1].thumb + ')')
      })

      test('the last thumbnail displayed is the eigth from the media array', () => {
        expect(wrapper.findAll('.vib-thumbnail-wrapper div:not([style*="display: none"])').at(6).element.style.backgroundImage).toBe('url(' + mediaWithNineImages[7].thumb + ')')
      })
    })

    describe('when the component is destroyed', () => {
      let container

      beforeEach(() => {
        jest.useFakeTimers()
        jest.spyOn(global, 'clearInterval')
        container = wrapper.findComponent({ ref: 'container' }).element
        container.removeEventListener = jest.fn()
        wrapper.destroy()
      })

      test('clearInterval is not called', () => {
        expect(clearInterval).not.toHaveBeenCalled()
      })

      test('removeEventListener is called on the container 3 times', () => {
        expect(container.removeEventListener).toHaveBeenCalledTimes(3)
      })
    })
  })
})
