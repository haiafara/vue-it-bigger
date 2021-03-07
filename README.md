# Vue It Bigger!

[![npm](https://img.shields.io/npm/v/vue-it-bigger?color=%2341BB13)](https://www.npmjs.com/package/vue-it-bigger)
[![Build Status](https://travis-ci.org/haiafara/vue-it-bigger.svg?branch=master)](https://travis-ci.org/haiafara/vue-it-bigger)
[![codecov](https://codecov.io/gh/haiafara/vue-it-bigger/branch/master/graph/badge.svg)](https://codecov.io/gh/haiafara/vue-it-bigger)
[![Depfu](https://badges.depfu.com/badges/069e198b8d20824c7de448b3506afcde/overview.svg)](https://depfu.com/github/haiafara/vue-it-bigger?project_id=12241)

A simple image / (YouTube) video lightbox component for Vue.js. Based on [vue-image-lightbox](https://github.com/pexea12/vue-image-lightbox).

[![Vue It Bigger Screenshot](https://imgur.com/89eZHa7.jpg)](https://haiafara.github.io/vue-it-bigger/)

Click on the screenshot above for a **demo**.

## Features

* Unobtrusive interface that disappears after a few seconds, reappears on mouse activity
* Optional thumbnail strip with all of the gallery's media
* Can show an HTML enabled caption under each image or video
* Can play the slideshow automatically
* All of the graphics (previous, next and close buttons) can be customized via slots
* Can skip to next / previous media programatically

# Improvements over vue-image-lightbox

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

```
npm install vue-it-bigger
yarn add vue-it-bigger
```

## Usage

You can view [App.vue](src/App.vue) or [the demo](https://haiafara.github.io/vue-it-bigger/) for an usage example.

In the `<script>` section of your component import it:

```javascript
import LightBox from 'vue-it-bigger'
import('vue-it-bigger/dist/vue-it-bigger.min.css') // when using webpack
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
## Using it with NuxtJs

Create a file named `lightbox.js` under the `plugins` directory with following contents:

```javascript
import Vue from 'vue'

import LightBox from 'vue-it-bigger'
import('vue-it-bigger/dist/vue-it-bigger.min.css')

const plugin = {
  install() {
    Vue.component('LightBox', LightBox)
  },
}

Vue.use(plugin)
```

Add the plugin in `nuxt.config.js`:

```javascript
plugins: [
  {
    src: '~/plugins/lightbox.js',
    ssr: false
  }
]
```

Use it in any of your components:

```html
<no-ssr placeholder="Loading...">
  <!-- this component will only be rendered on client-side -->
  <LightBox
    :media="lightBoxMedia"
  ></LightBox>
</no-ssr>
```

## Options

### Properties
<table>
  <thead>
    <tr>
      <th>name</th>
      <th>type</th>
      <th>default</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>media</td>
      <td>Array</td>
      <td>required</td>
      <td>Media array to display</td>
    </tr>
    <tr>
      <td>showLightBox</td>
      <td>Boolean</td>
      <td>true</td>
      <td>Whether to show lightbox or not at the beginning</td>
    </tr>
    <tr>
      <td>startAt</td>
      <td>Number</td>
      <td>0</td>
      <td>Index of the image that you want to start at</td>
    </tr>
    <tr>
      <td>nThumbs</td>
      <td>Number</td>
      <td>7</td>
      <td>Number of thumbnail images</td>
    </tr>
    <tr>
      <td>showThumbs</td>
      <td>Boolean</td>
      <td>true</td>
      <td>Whether to show thumbnails or not</td>
    </tr>
    <tr>
      <td>autoPlay</td>
      <td>Boolean</td>
      <td>false</td>
      <td>Move to next image automatically</td>
    </tr>
    <tr>
      <td>autoPlayTime</td>
      <td>Number</td>
      <td>3000 (ms)</td>
      <td>Time to stop at an image before move on to next image</td>
    </tr>
    <tr>
      <td>interfaceHideTime</td>
      <td>Number</td>
      <td>3000 (ms)</td>
      <td>Time after which the interface is hidden</td>
    </tr>
    <tr>
      <td>showCaption</td>
      <td>Boolean</td>
      <td>false</td>
      <td>Whether to show caption or not</td>
    </tr>
    <tr>
      <td>disableScroll</td>
      <td>Boolean</td>
      <td>true</td>
      <td>set to `true` to avoid scrolling views behind lightbox</td>
    </tr>
    <tr>
      <td>lengthToLoadMore</td>
      <td>Number</td>
      <td>0</td>
      <td>Minimum length unto end to emit load more event</td>
    </tr>
    <tr>
      <td>closable</td>
      <td>Boolean</td>
      <td>true</td>
      <td>Display the close button at the right top corner or not. ESC clicking-close will also be disabled if closable is set to false.</td>
    </tr>
    <tr>
      <td>closeText</td>
      <td>String</td>
      <td>Close (Esc)</td>
      <td>Text for the close button</td>
    </tr>
    <tr>
      <td>previousText</td>
      <td>String</td>
      <td>Previous</td>
      <td>Text for the previous image button</td>
    </tr>
    <tr>
      <td>nextText</td>
      <td>String</td>
      <td>Next</td>
      <td>Text for the next image button</td>
    </tr>
  </tbody>
</table>

### Methods
<table>
  <thead>
    <tr>
      <th>name</th>
      <th>arguments</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>nextImage</td>
      <td>()</td>
      <th>Move to next image</th>
    </tr>
    <tr>
      <td>previousImage</td>
      <td>()</td>
      <td>Move to previous image</td>
    </tr>
    <tr>
      <td>closeLightBox</td>
      <td>()</td>
      <td>Close lightbox</td>
    </tr>
    <tr>
      <td>showImage</td>
      <td>(index)</td>
      <td>Show the image at index</td>
    </tr>
  </tbody>
</table>

### Slots

#### close
The content of the close button.

#### footer
The content of the footer under the image.

##### Slot props
<table>
  <thead>
    <tr>
      <th>name</th>
      <th>type</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>current</td>
      <td>integer</td>
      <td>Number of the current image displayed</td>
    </tr>
    <tr>
      <td>total</td>
      <td>integer</td>
      <td>Number of images</td>
    </tr>
  </tbody>
</table>

#### previous
The previous button on the main image.

#### next
The next button on the main image.

#### customCaption
The caption of the current image.

##### Slot props
<table>
  <thead>
    <tr>
      <th>name</th>
      <th>type</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>currentMedia</td>
      <td>Object</td>
      <td>The currently displayed object from the media array</td>
    </tr>
  </tbody>
</table>

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

## Development (NPM / Yarn)

Clone the repository, cd into it and run:

```
npm run dev
yarn dev
```

After you add or modify something make sure the tests still pass:

```
npm run test
yarn test
```

## Credits

* Thanks [@anavsv](https://github.com/anavsv) for helping with the YouTube embed styling
* Original CSS was based on [react-images](https://github.com/jossmac/react-images)
* vue-image-lightbox authored by [@pexea12](https://github.com/pexea12)
* [Other contributors](https://github.com/haiafara/vue-it-bigger/graphs/contributors)

## License

This project is licensed under the the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
