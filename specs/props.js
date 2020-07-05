const mediaWithOneImage = [
  {
    thumb: 'test-thumb.jpg',
    src: 'test-image.jpg'
  }
]

const mediaWithOneVideo = [
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

export { mediaWithOneImage, mediaWithOneVideo, mediaWithNineImages }
