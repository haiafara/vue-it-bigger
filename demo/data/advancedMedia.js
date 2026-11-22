// Rich media dataset for advanced demos
// This demonstrates extended media objects with metadata for custom slots

const imageDomain = 'https://vue-it-bigger.rusiczki.net/'

export const richMedia = [
  // YouTube videos for video icon slot demo
  {
    type: 'youtube',
    id: 'WsptdUFthWI',
    thumb: 'https://img.youtube.com/vi/WsptdUFthWI/hqdefault.jpg',
    caption: 'Closer - The Chainsmokers ft. Halsey',
    title: 'Closer - The Chainsmokers ft. Halsey',
    description: 'Boyce Avenue ft. Sarah Hyland cover on Spotify & Apple',
    camera: 'YouTube Video',
    location: 'Music Video'
  },
  // HTML5 video for video slot demo
  {
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRx1TQ3PfnhWmLUWcxrGj3atDCZVTVBKetMOWVVQ4ipIStW03pY',
    sources: [
      {
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video/mp4',
      },
    ],
    type: 'video',
    caption: 'Big Buck Bunny',
    title: 'Big Buck Bunny',
    description: 'Open source animated short film',
    width: 800,
    height: 600,
  },
  // Images with rich metadata for custom caption slot
  {
    thumb: imageDomain + '01-zell-am-see-thumbnail.jpg',
    src: imageDomain + '01-zell-am-see.jpg',
    srcset: imageDomain + '01-zell-am-see.jpg 1x, ' + imageDomain + '01-zell-am-see.jpg 2x',
    caption: 'Zell am See, Austria',
    title: 'Zell am See',
    camera: 'Canon EOS 5D Mark III, 24-70mm f/2.8',
    location: 'Zell am See, Austria',
    description: 'Crystal clear alpine lake surrounded by mountains in the heart of the Austrian Alps.'
  },
  {
    thumb: imageDomain + '02-balea-lake-chalet-thumbnail.jpg',
    src: imageDomain + '02-balea-lake-chalet.jpg',
    srcset: imageDomain + '02-balea-lake-chalet.jpg 1x, ' + imageDomain + '02-balea-lake-chalet.jpg 2x',
    caption: 'Balea Lake Chalet, Romania',
    title: 'Balea Lake Chalet',
    camera: 'Canon EOS 5D Mark III, 16-35mm f/2.8',
    location: 'Balea Lake, Făgăraș Mountains, Romania',
    description: 'Mountain refuge at 2,034m altitude, accessible by cable car or the famous Transfăgărășan road.'
  },
  {
    thumb: imageDomain + '03-maybug-thumbnail.jpg',
    src: imageDomain + '03-maybug.jpg',
    srcset: imageDomain + '03-maybug.jpg 1x, ' + imageDomain + '03-maybug.jpg 2x',
    caption: 'Maybug',
    title: 'Maybug Close-up',
    camera: 'Canon EOS 5D Mark III, 100mm f/2.8 Macro',
    location: 'Macro Photography',
    description: 'Detailed macro shot of a maybug (cockchafer beetle) showing intricate details of its exoskeleton.'
  },
  {
    thumb: imageDomain + '04-rc-car-thumbnail.jpg',
    src: imageDomain + '04-rc-car.jpg',
    srcset: imageDomain + '04-rc-car.jpg 1x, ' + imageDomain + '04-rc-car.jpg 2x',
    caption: 'RC Car in Action',
    title: 'Remote Control Car',
    camera: 'Canon EOS 5D Mark III, 70-200mm f/2.8',
    location: 'Action Photography',
    description: 'High-speed radio-controlled car captured mid-jump with motion blur effect.'
  },
  {
    thumb: imageDomain + '05-tourists-thumbnail.jpg',
    src: imageDomain + '05-tourists.jpg',
    srcset: imageDomain + '05-tourists.jpg 1x, ' + imageDomain + '05-tourists.jpg 2x',
    caption: 'Mountain Hikers',
    title: 'Two Tourists on a Mountain',
    camera: 'Canon EOS 5D Mark III, 24-70mm f/2.8',
    location: 'Alpine Hiking Trail',
    description: 'Hikers enjoying the panoramic view from a mountain peak on a beautiful sunny day.'
  },
  {
    thumb: imageDomain + '06-dog-thumbnail.jpg',
    src: imageDomain + '06-dog.jpg',
    srcset: imageDomain + '06-dog.jpg 1x, ' + imageDomain + '06-dog.jpg 2x',
    caption: 'Portrait of a Dog',
    title: 'Dog Portrait',
    camera: 'Canon EOS 5D Mark III, 85mm f/1.8',
    location: 'Pet Photography',
    description: 'Candid portrait of a friendly dog with shallow depth of field and natural lighting.'
  },
  {
    thumb: imageDomain + '07-beer-thumbnail.jpg',
    src: imageDomain + '07-beer.jpg',
    srcset: imageDomain + '07-beer.jpg 1x, ' + imageDomain + '07-beer.jpg 2x',
    caption: 'Craft Beer',
    title: 'Golden Beer in Glass',
    camera: 'Canon EOS 5D Mark III, 50mm f/1.4',
    location: 'Product Photography',
    description: 'Refreshing craft beer with foam head, capturing the golden color and condensation on the glass.'
  },
  {
    thumb: imageDomain + '08-roosters-crest-thumbnail.jpg',
    src: imageDomain + '08-roosters-crest.jpg',
    srcset: imageDomain + '08-roosters-crest.jpg 1x, ' + imageDomain + '08-roosters-crest.jpg 2x',
    caption: 'The Rooster\'s Crest',
    title: 'The Rooster\'s Crest Mountain Peak',
    camera: 'Canon EOS 5D Mark III, 70-200mm f/2.8',
    location: 'Piatra Craiului Mountains, Romania',
    description: 'Dramatic limestone ridge known as "Creasta Cocoșului" offering challenging hiking routes.'
  },
]

// Generate additional media items for lazy loading demo
// This creates simple placeholder items to demonstrate the lazy loading pattern
export const generateMediaItems = (count, startIndex = 0) => {
  const items = []
  for (let i = 0; i < count; i++) {
    const index = startIndex + i
    // Cycle through the rich media items
    const sourceItem = richMedia[index % richMedia.length]
    items.push({
      ...sourceItem,
      caption: `${sourceItem.title} (Item ${index + 1})`,
    })
  }
  return items
}

// Get initial media set for lazy loading
export const getInitialMedia = (count = 15) => {
  return generateMediaItems(count, 0)
}
