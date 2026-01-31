# Vue It Bigger!

[![npm](https://img.shields.io/npm/v/vue-it-bigger?color=%2341BB13)](https://www.npmjs.com/package/vue-it-bigger)
[![codecov](https://codecov.io/gh/haiafara/vue-it-bigger/branch/master/graph/badge.svg)](https://codecov.io/gh/haiafara/vue-it-bigger)
[![Depfu](https://badges.depfu.com/badges/d97efabdc36483941354cb65cd36ed01/overview.svg)](https://depfu.com/github/haiafara/vue-it-bigger?project_id=13757)

A simple image / (YouTube) video lightbox component for Vue.js 3.

[![Vue It Bigger Screenshot](https://imgur.com/89eZHa7.jpg)](https://haiafara.github.io/vue-it-bigger/)

Click on the screenshot above for a **demo**.

## Features

* Unobtrusive interface that disappears after a few seconds, reappears on mouse activity
* Optional thumbnail strip with all of the gallery's media
* Can show an HTML enabled caption under each image or video
* Can play the slideshow automatically
* All of the graphics (previous, next and close buttons) can be customized via slots
* Can skip to next / previous media programatically
* Allows embedding YouTube videos
* Lightbox opens and closes with a short fade
* Media's width is no longer limited (stretches to the full width / height of the window)
* When opening the lightbox the media doesn't flicker
* Moved caption bar and image counter off the media to the bottom of the screen
* Moved thumbnails to the top of the screen (as the bottom is now used by the caption bar)
* All interface elements have a background for better visibility
* Simplified CSS

## Installation

You know the drill:

```bash
npm install vue-it-bigger
# or
yarn add vue-it-bigger
```

## Usage

You can view [App.vue](demo/App.vue) or [the demo](https://haiafara.github.io/vue-it-bigger/) for an usage example.

In the `<script>` section of your component import it:

```javascript
import LightBox from 'vue-it-bigger'
import 'vue-it-bigger/dist/vue-it-bigger.css'
```

Add it to the list of used components:

```javascript
export default {
  components: {
    LightBox,
  },
}
```

And use it in the `<template>` section:

```html
<LightBox :media="media"></LightBox>
```

The `media` prop has the following structure:

```javascript
[
  { // For an image
    type: 'image', // Can be omitted for image
    thumb: 'http://example.com/thumb.jpg',
    src: 'http://example.com/image.jpg',
    caption: 'Caption to display. HTML <b>enabled</b>', // Optional
    srcset: '...' // Optional for displaying responsive images
  },
  { // For a YouTube video
    type: 'youtube',
    thumb: 'https://img.youtube.com/vi/WsptdUFthWI/hqdefault.jpg',
    id: 'WsptdUFthWI',
    caption: 'HTML <b>enabled</b> caption to display' // Optional
  },
  { // For a video that can be played in the <video> tag
    type: 'video',
    thumb: 'https://s3-us-west-1.amazonaws.com/powr/defaults/image-slider2.jpg',
    sources: [
      {
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video/mp4'
      }
    ],
    caption: '<h4>Monsters Inc.</h4>',
    width: 800, // Required
    height: 600, // Required
    autoplay: true // Optional: Autoplay video when the lightbox opens
  }
]
```
## Using it with Nuxt 3

Create a file named `lightbox.client.js` under the `plugins` directory with following contents:

```javascript
import LightBox from 'vue-it-bigger'
import 'vue-it-bigger/dist/vue-it-bigger.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('LightBox', LightBox)
})
```

Use it in any of your components:

```html
<ClientOnly>
  <!-- this component will only be rendered on client-side -->
  <LightBox
    :media="lightBoxMedia"
  ></LightBox>
</ClientOnly>
```

## Options

### Properties

| name | type | default | description |
|------|------|---------|-------------|
| media | Array | required | Media array to display |
| showLightBox | Boolean | true | Whether to show lightbox or not at the beginning |
| startAt | Number | 0 | Index of the image that you want to start at |
| nThumbs | Number | 7 | Number of thumbnail images |
| showThumbs | Boolean | true | Whether to show thumbnails or not |
| autoPlay | Boolean | false | Move to next image automatically |
| autoPlayTime | Number | 3000 (ms) | Time to stop at an image before move on to next image |
| interfaceHideTime | Number | 3000 (ms) | Time after which the interface is hidden |
| showCaption | Boolean | false | Whether to show caption or not |
| disableScroll | Boolean | true | set to `true` to avoid scrolling views behind lightbox |
| lengthToLoadMore | Number | 0 | Minimum length unto end to emit load more event |
| closable | Boolean | true | Display the close button at the right top corner or not. ESC clicking-close will also be disabled if closable is set to false. |
| closeText | String | Close (Esc) | Text for the close button |
| previousText | String | Previous | Text for the previous image button |
| nextText | String | Next | Text for the next image button |

### Methods

| name | arguments | description |
|------|-----------|-------------|
| nextImage | () | Move to next image |
| previousImage | () | Move to previous image |
| closeLightBox | () | Close lightbox |
| showImage | (index) | Show the image at index |

### Slots

#### close
The content of the close button.

#### footer
The content of the footer under the image.

##### Slot props

| name | type | description |
|------|------|-------------|
| current | integer | Number of the current image displayed |
| total | integer | Number of images |

#### previous
The previous button on the main image.

#### next
The next button on the main image.

#### customCaption
The caption of the current image.

##### Slot props

| name | type | description |
|------|------|-------------|
| currentMedia | Object | The currently displayed object from the media array |

Usage example:

```javascript
<LightBox
  ref="customCaptionLightbox"
  :media="media"
  :show-caption="true"
>
  <template v-slot:customCaption="slotProps">
    {{ slotProps.currentMedia.caption }}<br>
    There could be some description here.
  </template>
</LightBox>
```

#### videoIcon
The Icon used for videos

### Events

- `onOpened`: Emit when the lightbox is opened.
- `onClosed`: Emit when the lightbox is closed.
- `onLastIndex`: Emit when the current image is the last one of the list.
- `onFirstIndex`: Emit when the current image is the first one of the list.
- `onStartIndex`: Emit when the current image is at the `startAt` index (specified in the properties).
- `onLoad`: Emit when there are `lengthToLoadMore` images left in the array (specified in the properties). For example, if `lengthToLoadMore = 2` and there are 7 images in your array, when you reach index 4 (which means there are 2 images left which are not discovered yet), this event will be emitted. After that, if the image array are updated and there are totally 15 images, the event will be emitted at index 12.

## Development

Clone the repository, cd into it and run:

```bash
yarn install
yarn dev
```

The demo app will be available at http://localhost:1805

After you add or modify something make sure the tests still pass:

```bash
yarn test
yarn lint
```

To build the library:

```bash
yarn build
```

## Release

1. Make sure everything works locally by running `yarn dev`, `yarn build`, and `yarn test`
2. Bump the version in [package.json](package.json)
3. Draft a new release on the [releases page](https://github.com/haiafara/vue-it-bigger/releases)
    - Create a tag with the prefix **v** and the version, eg: **v1.0.0**
    - Prefix the release title with the tag, eg: **v1.0.0 - Vue 3 Migration**
4. Publish the release

## Credits

* Based on [vue-image-lightbox](https://github.com/pexea12/vue-image-lightbox) by [@pexea12](https://github.com/pexea12)
* Thanks Ana Vidra for helping with the YouTube embed styling
* Original CSS was based on [react-images](https://github.com/jossmac/react-images)
* [Other contributors](https://github.com/haiafara/vue-it-bigger/graphs/contributors)

## License

This project is licensed under the the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
