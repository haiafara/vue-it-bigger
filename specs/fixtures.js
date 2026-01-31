const mediaWithOneImageWithoutType = [
  {
    thumb: 'http://test/test-thumb.jpg',
    src: 'http://test/test-image.jpg'
  }
]

const mediaWithOneImageWithType = [
  {
    thumb: 'http://test/test-thumb.jpg',
    src: 'http://test/test-image.jpg',
    type: 'image'
  }
]

const mediaWithOneVideoWithoutAutoplay = [
  {
    type: 'video',
    thumb: 'http://test/test-thumb.jpg',
    sources: [
      {
        src: 'http://test/test-video.mp4'
      }
    ]
  }
]

const mediaWithOneVideoWithAutoplay = [
  {
    type: 'video',
    thumb: 'http://test/test-thumb.jpg',
    autoplay: true,
    sources: [
      {
        src: 'http://test/test-video.mp4'
      }
    ]
  }
]

const mediaWithOneYoutube = [
  {
    type: 'youtube',
    thumb: 'http://test/test-thumb.jpg',
    id: 'testid'
  }
]

const mediaWithNineImages = [
  {
    thumb: 'http://test/test-thumb-1.jpg',
    src: 'http://test/test-image-1.jpg'
  },
  {
    thumb: 'http://test/test-thumb-2.jpg',
    src: 'http://test/test-image-2.jpg'
  },
  {
    thumb: 'http://test/test-thumb-3.jpg',
    src: 'http://test/test-image-3.jpg'
  },
  {
    thumb: 'http://test/test-thumb-4.jpg',
    src: 'http://test/test-image-4.jpg'
  },
  {
    thumb: 'http://test/test-thumb-5.jpg',
    src: 'http://test/test-image-5.jpg'
  },
  {
    thumb: 'http://test/test-thumb-6.jpg',
    src: 'http://test/test-image-6.jpg'
  },
  {
    thumb: 'http://test/test-thumb-7.jpg',
    src: 'http://test/test-image-7.jpg'
  },
  {
    thumb: 'http://test/test-thumb-8.jpg',
    src: 'http://test/test-image-8.jpg'
  },
  {
    thumb: 'http://test/test-thumb-9.jpg',
    src: 'http://test/test-image-9.jpg'
  }
]

const mediaWithSrcset = [
  {
    thumb: 'http://test/test-thumb.jpg',
    src: 'http://test/test-image.jpg',
    srcset: 'http://test/test-image-2x.jpg 2x',
    caption: 'Test caption'
  }
]

const mediaWithCaption = [
  {
    thumb: 'http://test/test-thumb.jpg',
    src: 'http://test/test-image.jpg',
    caption: '<strong>Bold caption</strong>'
  }
]

const mediaWithTwoImages = [
  {
    thumb: 'http://test/test-thumb-1.jpg',
    src: 'http://test/test-image-1.jpg'
  },
  {
    thumb: 'http://test/test-thumb-2.jpg',
    src: 'http://test/test-image-2.jpg'
  }
]

const mediaMixed = [
  {
    thumb: 'http://test/thumb-1.jpg',
    src: 'http://test/img-1.jpg'
  },
  {
    type: 'video',
    thumb: 'http://test/thumb-2.jpg',
    sources: [
      {
        src: 'http://test/vid.mp4',
        type: 'video/mp4'
      }
    ]
  },
  {
    type: 'youtube',
    thumb: 'http://test/thumb-3.jpg',
    id: 'abc123'
  }
]

const mediaWithNonStringThumb = [
  {
    thumb: undefined,
    src: 'http://test/test-image.jpg'
  },
  {
    thumb: null,
    src: 'http://test/test-image-2.jpg'
  }
]

export {
  mediaWithOneImageWithoutType,
  mediaWithOneImageWithType,
  mediaWithOneVideoWithoutAutoplay,
  mediaWithOneVideoWithAutoplay,
  mediaWithOneYoutube,
  mediaWithNineImages,
  mediaWithSrcset,
  mediaWithCaption,
  mediaWithTwoImages,
  mediaMixed,
  mediaWithNonStringThumb
}
