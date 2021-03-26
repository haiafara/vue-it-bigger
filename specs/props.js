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

const mediaWithOneVideo = [
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

export { mediaWithOneImageWithoutType, mediaWithOneImageWithType, mediaWithOneVideo, mediaWithOneYoutube, mediaWithNineImages }
