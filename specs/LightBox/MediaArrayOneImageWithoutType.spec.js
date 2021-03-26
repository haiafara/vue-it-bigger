import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox'

import { mediaWithOneImageWithoutType } from '../props'

describe('LightBox', () => {
  describe('given one image without type specified in the media array', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LightBox, {
        propsData: {
          media: mediaWithOneImageWithoutType
        }
      })
    })

    test('renders the image', () => {
      expect(wrapper.find('img.vib-image').exists()).toBe(true)
    })

    test('renders one active thumbnail element', () => {
      expect(wrapper.find('div.vib-thumbnail-active').exists()).toBe(true)
    })

    test('the thumbnail does not have the video icon', () => {
      expect(wrapper.find('div.vib-thumbnail-active svg').exists()).toBe(false)
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
          })

          describe('when interface is not hovered', () => {
            beforeEach(() => {
              wrapper.setData({ interfaceHovered: false })
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

          describe('when interface is hovered', () => {
            beforeEach(() => {
              wrapper.setData({ interfaceHovered: true })
              wrapper.findComponent({ ref: 'container' }).trigger('mousemove')
            })

            test('leaves controlsHidden to be false', () => {
              expect(wrapper.vm.controlsHidden).toBe(false)
            })

            test('setTimeout is not called', () => {
              expect(setTimeout).not.toHaveBeenCalled()
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
})