import { describe, test, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox.vue'

import { mediaWithOneImageWithoutType } from '../props'

describe('LightBox', () => {
  describe('given one image without type specified in the media array', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LightBox, {
        props: {
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
          wrapper.vm.previousImage = vi.fn()
          document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowLeft' }))
        })

        test('calls previousImage', () => {
          expect(wrapper.vm.previousImage).toHaveBeenCalled()
        })
      })

      describe('right arrow', () => {
        beforeEach(() => {
          wrapper.vm.nextImage = vi.fn()
          document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowRight' }))
        })

        test('calls nextImage', () => {
          expect(wrapper.vm.nextImage).toHaveBeenCalled()
        })
      })

      describe('esc', () => {
        beforeEach(() => {
          wrapper.vm.closeLightBox = vi.fn()
          document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Escape' }))
        })

        test('calls closeLightBox', () => {
          expect(wrapper.vm.closeLightBox).toHaveBeenCalled()
        })
      })
    })

    describe('mouse movement', () => {
      beforeEach(() => {
        vi.useFakeTimers()
        vi.spyOn(global, 'setTimeout')
      })

      describe('moving the mouse', () => {
        describe('when controls are shown', () => {
          beforeEach(() => {
            wrapper.vm.controlsHidden = false
          })

          describe('when interface is not hovered', () => {
            beforeEach(() => {
              wrapper.vm.interfaceHovered = false
              wrapper.find('.vib-container').trigger('mousemove')
            })

            test('leaves controlsHidden to be false', () => {
              expect(wrapper.vm.controlsHidden).toBe(false)
            })

            test('setTimeout is called once', () => {
              expect(setTimeout).toHaveBeenCalledTimes(1)
            })

            describe('when timeout is reached', () => {
              beforeEach(() => {
                vi.runOnlyPendingTimers()
              })

              test('controls are hidden', () => {
                expect(wrapper.vm.controlsHidden).toBe(true)
              })
            })
          })

          describe('when interface is hovered', () => {
            beforeEach(() => {
              wrapper.vm.interfaceHovered = true
              wrapper.find('.vib-container').trigger('mousemove')
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
            wrapper.vm.controlsHidden = true
            wrapper.find('.vib-container').trigger('mousemove')
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
        wrapper.vm.imageTransitionName = 'test'
      })

      describe('.enableImageTransition', () => {
        beforeEach(() => {
          wrapper.vm.handleMouseActivity = vi.fn()
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
