import { mount } from '@vue/test-utils'
import LightBox from '@/LightBox'

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
})