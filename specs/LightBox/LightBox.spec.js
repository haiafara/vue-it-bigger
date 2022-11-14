import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox'

import { mediaWithNineImages } from '../props'

describe('LightBox', () => {
  describe('when the lightbox is not open on component mount', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LightBox, {
        propsData: {
          media: mediaWithNineImages,
          showLightBox: false
        }
      })
    })

    test('the container div has display:none', () => {
      expect(wrapper.find('.vib-container').element.style.display).toBe('none')
    })

    describe('showImage(1)', () => {
      beforeEach(() => {
        wrapper.vm.showImage(1)
      })

      test('the container div is displayed', () => {
        expect(wrapper.find('.vib-container').element.style.display).toBe('')
      })

      test('the rendered image is the second image from the media array', () => {
        expect(wrapper.find('img.vib-image').element.src).toBe(mediaWithNineImages[1].src)
      })

      describe('showImage(0)', () => {
        beforeEach(() => {
          wrapper.vm.showImage(0)
        })

        test('the rendered image is the first image from the media array', () => {
          expect(wrapper.find('img.vib-image').element.src).toBe(mediaWithNineImages[0].src)
        })
      })
    })
  })

  describe('when the lightbox is opened with autoplay', () => {
    let wrapper

    beforeEach(() => {
      jest.useFakeTimers()
      jest.spyOn(global, 'setInterval')
      jest.spyOn(global, 'clearInterval')
      wrapper = mount(LightBox, {
        propsData: {
          media: mediaWithNineImages,
          autoPlay: true
        }
      })
    })

    test('setInterval is called once', () => {
      expect(setInterval).toHaveBeenCalledTimes(1)
      expect(setInterval).toHaveBeenLastCalledWith(wrapper.vm.nextImage, 3000)
    })

    describe('when the component is destroyed', () => {
      beforeEach(() => {
        wrapper.destroy()
      })

      test('clearInterval is called once', () => {
        expect(clearInterval).toHaveBeenCalledTimes(1)
      })
    })

  })
})
