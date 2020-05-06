const imageDomain = 'https://vue-image-lightbox-evolved.rusiczki.net/'

const media = [
  {
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRx1TQ3PfnhWmLUWcxrGj3atDCZVTVBKetMOWVVQ4ipIStW03pY',
    sources: [
      {
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video/mp4',
      },
    ],
    type: 'video',
    caption: 'Monsters Inc.',
    width: 800,
    height: 600,
  },
  {
    thumb: imageDomain + '01-zell-am-see-thumbnail.jpg',
    src: imageDomain + '01-zell-am-see.jpg',
    caption: 'Zell am See',
    width: 1620,
    height: 1080
  },
  {
    thumb: imageDomain + '02-balea-lake-chalet-thumbnail.jpg',
    src: imageDomain + '02-balea-lake-chalet.jpg',
    caption: 'Balea Lake Chalet',
    width: 1614,
    height: 1080
  },
  {
    thumb: imageDomain + '03-maybug-thumbnail.jpg',
    src: imageDomain + '03-maybug.jpg',
    caption: 'Maybug',
    width: 1613,
    height: 1080
  },
  {
    thumb: imageDomain + '04-rc-car-thumbnail.jpg',
    src: imageDomain + '04-rc-car.jpg',
    caption: 'RC Car',
    width: 1623,
    height: 1080
  },
  {
    thumb: imageDomain + '05-tourists-thumbnail.jpg',
    src: imageDomain + '05-tourists.jpg',
    caption: 'Tourists',
    width: 1613,
    height: 1080
  },
  {
    thumb: imageDomain + '06-dog-thumbnail.jpg',
    src: imageDomain + '06-dog.jpg',
    caption: 'Dog',
    width: 1440,
    height: 1080
  },
  {
    thumb: imageDomain + '07-beer-thumbnail.jpg',
    src: imageDomain + '07-beer.jpg',
    caption: 'Mmm, Beer! - This should be a short description, as it is after all, beer, but let\'s make it long so that we can test how the footer looks',
    width: 1620,
    height: 1080
  },
  {
    thumb: imageDomain + '08-roosters-crest-thumbnail.jpg',
    src: imageDomain + '08-roosters-crest.jpg',
    caption: 'The Rooster\'s Crest',
    width: 1620,
    height: 1080
  },
]

export default media
