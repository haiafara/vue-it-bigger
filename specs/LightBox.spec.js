import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox'

import { mediaWithOneImage, mediaWithOneVideo, mediaWithNineImages } from './props'

describe('LightBox', () => {
  describe('given an empty media array', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LightBox, {
        propsData: {
          media: [],
          showLightBox: false
        }
      })
    })

    test('does not render the container div', () => {
      expect(wrapper.find('.vib-container').exists()).toBe(false)
    })

    describe('onLightBoxOpen', () => {
      beforeEach(() => {
        wrapper.vm.onLightBoxOpen()
      })

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
      beforeEach(() => {
        wrapper.vm.onLightBoxClose()
      })

      test('emits onClosed', () => {
        expect(wrapper.emitted().onClosed).toBeTruthy()
      })

      test('removes the no-scroll class from the html element', () => {
        expect(document.querySelector('html').classList.contains('no-scroll')).toBe(false)
      })

      test('removes the vib-open class from the body element', () => {
        expect(document.querySelector('body').classList.contains('vib-open')).toBe(false)
      })

    })

    describe('onToggleLightBox(true)', () => {
      beforeEach(() => {
        wrapper.vm.onLightBoxOpen = jest.fn()
        wrapper.vm.onToggleLightBox(true)
      })

      test('calls onLightBoxOpen', () => {
        expect(wrapper.vm.onLightBoxOpen).toHaveBeenCalled()
      })
    })

    describe('onToggleLightBox()', () => {
      beforeEach(() => {
        wrapper.vm.onLightBoxClose = jest.fn()
        wrapper.vm.onToggleLightBox()
      })

      test('calls onLightBoxClose', () => {
        expect(wrapper.vm.onLightBoxClose).toHaveBeenCalled()
      })
    })

    describe('when the component is destroyed', () => {
      let container

      beforeEach(() => {
        document.removeEventListener = jest.fn()
        wrapper.destroy()
      })

      test('removeEventListener is called on the document', () => {
        expect(document.removeEventListener).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('given one item in the media array', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LightBox, {
        propsData: {
          media: ['test']
        }
      })
    })

    test('does render the container div', () => {
      expect(wrapper.find('.vib-container').exists()).toBe(true)
    })
  })

  describe('given one image in the media array', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LightBox, {
        propsData: {
          media: mediaWithOneImage
        }
      })
    })

    test('renders the image', () => {
      expect(wrapper.find('img.vib-image').exists()).toBe(true)
    })

    test('renders one active thumbnail element', () => {
      expect(wrapper.find('div.vib-thumbnail-active').exists()).toBe(true)
    })

    describe('keypresses', () => {
      describe('left arrow', () => {
        beforeEach(() => {
          wrapper.vm.previousImage = jest.fn()
          document.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 37 }))
        })

        test('calls previousImage', () => {
          expect(wrapper.vm.previousImage).toHaveBeenCalled()
        })
      })

      describe('right arrow', () => {
        beforeEach(() => {
          wrapper.vm.nextImage = jest.fn()
          document.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 39 }))
        })

        test('calls nextImage', () => {
          expect(wrapper.vm.nextImage).toHaveBeenCalled()
        })
      })

      describe('esc', () => {
        beforeEach(() => {
          wrapper.vm.closeLightBox = jest.fn()
          document.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 27 }))
        })

        test('calls closeLightBox', () => {
          expect(wrapper.vm.closeLightBox).toHaveBeenCalled()
        })
      })
    })

    describe('mouse movement', () => {
      beforeEach(() => {
        jest.useFakeTimers()
      })

      describe('moving the mouse', () => {
        describe('when controls are shown', () => {
          beforeEach(() => {
            wrapper.setData({ controlsHidden: false })
            wrapper.findComponent({ ref: 'container' }).trigger('mousemove')
          })

          test('leaves controlsHidden to be false', () => {
            expect(wrapper.vm.controlsHidden).toBe(false)
          })

          test('setTimeout is called once', () => {
            expect(setTimeout).toHaveBeenCalledTimes(1)
          })

          describe('when timeout is reached', () => {
            beforeEach(() => {
              jest.runOnlyPendingTimers()
            })

            test('controls are hidden', () => {
              expect(wrapper.vm.controlsHidden).toBe(true)
            })
          })
        })

        describe('when controls are hidden', () => {
          beforeEach(() => {
            wrapper.setData({ controlsHidden: true })
            wrapper.findComponent({ ref: 'container' }).trigger('mousemove')
          })

          test('sets controlsHidden to false', () => {
            expect(wrapper.vm.controlsHidden).toBe(false)
          })

          test('setTimeout is called once', () => {
            expect(setTimeout).toHaveBeenCalledTimes(1)
          })
        })
      })
    })

    describe('transitions', () => {
      beforeEach(() => {
        wrapper.setData({ imageTransitionName: 'test' })
      })

      describe('.enableImageTransition', () => {
        beforeEach(() => {
          wrapper.vm.handleMouseActivity = jest.fn()
          wrapper.vm.enableImageTransition()
        })

        test('calls handleMouseActivity', () => {
          expect(wrapper.vm.handleMouseActivity).toHaveBeenCalled()
        })

        test('sets imageTransitionName correctly', () => {
          expect(wrapper.vm.imageTransitionName).toBe('vib-image-transition')
        })
      })

      describe('.disableImageTransition', () => {
        beforeEach(() => {
          wrapper.vm.disableImageTransition()
        })

        test('sets imageTransitionName correctly', () => {
          expect(wrapper.vm.imageTransitionName).toBe('vib-image-no-transition')
        })
      })
    })
  })

  describe('given one video in the media array', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LightBox, {
        propsData: {
          media: mediaWithOneVideo
        }
      })
    })

    afterEach(() => {
      wrapper.destroy()
    })

    test('renders one video element', () => {
      expect(wrapper.find('video').exists()).toBe(true)
    })

    test('renders one active thumbnail element', () => {
      expect(wrapper.find('div.vib-thumbnail-active').exists()).toBe(true)
    })
  })

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
