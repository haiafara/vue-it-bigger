# Vue It Bigger!

[![npm](https://img.shields.io/npm/v/vue-it-bigger?color=%2341BB13)](https://www.npmjs.com/package/vue-it-bigger)
[![codecov](https://codecov.io/gh/haiafara/vue-it-bigger/branch/master/graph/badge.svg)](https://codecov.io/gh/haiafara/vue-it-bigger)
[![Depfu](https://badges.depfu.com/badges/c2455f6851f255bac3d00f45fc89571b/overview.svg)](https://depfu.com/github/haiafara/vue-it-bigger?project_id=71083)

A simple image / (YouTube) video lightbox component for Vue 3.

[![Vue It Bigger Screenshot](https://imgur.com/89eZHa7.jpg)](https://haiafara.github.io/vue-it-bigger/)

Click on the screenshot above for a **demo**.

## Features

* Unobtrusive interface that disappears after a few seconds, reappears on mouse activity
* Optional thumbnail strip with all of the gallery's media
* Can show an HTML enabled caption under each image or video
* Can play the slideshow automatically
* All of the graphics can be customized via slots
* Can be controlled programmatically (change media, zoom, toggle full screen)
* Zoom images with the magnifier buttons, the scroll wheel, the keyboard, or pinch to zoom on touch devices; drag to pan while zoomed
* Full screen toggle (button or keyboard) for all media types
* Allows embedding YouTube videos
* Lightbox opens and closes with a short fade

## Installation

You know the drill:

```bash
npm install vue-it-bigger
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

## Zoom

Images can be zoomed in the lightbox (videos and YouTube embeds can't). It's enabled by default and works with:

| input | action |
|-------|--------|
| Magnifier + / − buttons | Zoom in / out by a step of 1.5× (shown at the top left) |
| Scroll wheel | Zoom in / out towards the mouse pointer |
| `+` / `=` and `-` keys | Zoom in / out |
| `0` key | Reset the zoom |
| Pinch (touch devices) | Zoom towards the midpoint between the fingers |
| Drag (mouse or one finger) | Pan the image while zoomed |

While an image is zoomed in, swiping doesn't move to the next or previous image. Use the arrows, the thumbnails or the arrow keys instead. The zoom resets whenever you move to another image or close the lightbox.

The zoom is limited to `maxZoom` times the original size (4 by default). To change it, or to turn zooming off entirely:

```html
<LightBox :media="media" :max-zoom="6"></LightBox>
<LightBox :media="media" :zoomable="false"></LightBox>
```

The buttons' graphics can be replaced with the `zoomIn` and `zoomOut` slots, and their tooltips with the `zoomInText` and `zoomOutText` properties. You can also zoom programmatically through the `zoomIn`, `zoomOut` and `resetZoom` methods (e.g. `this.$refs.lightbox.zoomIn()`).

## Full screen

A button next to the zoom buttons (top left) switches the lightbox to full screen and back, and so does the `f` key. It works for images, videos and YouTube embeds. On video slides the browser's own full screen button is hidden where the browser allows it (Safari ignores that), so there is a single full screen control.

Pressing `Esc` while in full screen only leaves full screen (this is the browser's behavior); pressing it again closes the lightbox. Closing the lightbox always exits full screen.

The button is hidden on browsers that don't support the Fullscreen API (for example Safari on iPhone). To hide it everywhere:

```html
<LightBox :media="media" :fullscreenable="false"></LightBox>
```

Use the `enterFullscreen` and `exitFullscreen` slots to replace the icons, the `enterFullscreenText` and `exitFullscreenText` properties for the tooltips, the `onFullscreenChange` event to react to changes, and the `toggleFullscreen` method to switch programmatically (browsers only allow entering full screen from a user action, such as a click).

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
| zoomable | Boolean | true | Allow zooming images (buttons, scroll wheel, keyboard and pinch) |
| maxZoom | Number | 4 | Maximum zoom factor |
| zoomInText | String | Zoom in | Text for the zoom in button |
| zoomOutText | String | Zoom out | Text for the zoom out button |
| fullscreenable | Boolean | true | Show the full screen button and allow toggling full screen (button, `f` key) |
| enterFullscreenText | String | Enter full screen (F) | Text for the enter full screen button |
| exitFullscreenText | String | Exit full screen (F) | Text for the exit full screen button |

### Methods

| name | arguments | description |
|------|-----------|-------------|
| showImage | (index) | Show the image at index |
| zoomIn | () | Zoom in on the current image |
| zoomOut | () | Zoom out of the current image |
| resetZoom | () | Reset the zoom of the current image |
| toggleFullscreen | () | Enter or exit full screen |

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

#### zoomIn
The content of the zoom in button.

#### zoomOut
The content of the zoom out button.

#### enterFullscreen
The content of the full screen button while not in full screen.

#### exitFullscreen
The content of the full screen button while in full screen.

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

#### imageOverlay
Content rendered on top of the currently displayed image, sized and positioned to match the image box, not the surrounding viewport. Only shows up for image slides; video and YouTube slides skip it. Pointer events are off on the overlay by default so it doesn't block swipe or click navigation — turn them back on for individual elements in the slot if you need something in there to be clickable. Handy for drawing arrows or highlight boxes over a photo.

##### Slot props

| name | type | description |
|------|------|-------------|
| currentMedia | Object | The currently displayed object from the media array |
| index | integer | The index of the currently displayed media item |

Usage example:

```javascript
<LightBox
  ref="overlayLightbox"
  :media="media"
>
  <template v-slot:imageOverlay="{ currentMedia }">
    <MyAnnotationsOverlay :annotations="currentMedia.annotations" />
  </template>
</LightBox>
```

#### videoIcon
The Icon used for videos

### Events

- `onOpened`: Emit when the lightbox is opened.
- `onClosed`: Emit when the lightbox is closed.
- `onFullscreenChange`: Emit when the lightbox enters or exits full screen. The argument is `true` when entering and `false` when exiting.
- `onLastIndex`: Emit when the current image is the last one of the list.
- `onFirstIndex`: Emit when the current image is the first one of the list.
- `onStartIndex`: Emit when the current image is at the `startAt` index (specified in the properties).
- `onLoad`: Emit when there are `lengthToLoadMore` images left in the array (specified in the properties). For example, if `lengthToLoadMore = 2` and there are 7 images in your array, when you reach index 4 (which means there are 2 images left which are not discovered yet), this event will be emitted. After that, if the image array are updated and there are totally 15 images, the event will be emitted at index 12.

## Development

Clone the repository, cd into it and run:

```bash
npm install
npm run dev
```

The demo app will be available at http://localhost:1805

After you add or modify something make sure the tests still pass:

```bash
npm test
npm run lint
```

To build the library:

```bash
npm run build
```

## Release

1. Make sure everything works locally by running `npm run dev`, `npm run build`, and `npm test`
2. Bump the version in [package.json](package.json)
3. Add an entry for the new version in [CHANGELOG.md](CHANGELOG.md) following the [Keep a Changelog](https://keepachangelog.com/) format
4. Commit and push the changes to master
5. Draft a new release on the [releases page](https://github.com/haiafara/vue-it-bigger/releases)
    - Create a tag with the prefix **v** and the version, eg: **v1.0.0**
    - Prefix the release title with the tag, eg: **v1.0.0 - Vue 3 Migration**
6. Publish the release

The publish workflow will automatically validate that the release tag matches the version in `package.json` and that `CHANGELOG.md` has an entry for the version, then build and publish to npm.

## Credits

* Based on [vue-image-lightbox](https://github.com/pexea12/vue-image-lightbox) by [@pexea12](https://github.com/pexea12)
* Thanks Ana Vidra for helping with the YouTube embed styling
* Original CSS was based on [react-images](https://github.com/jossmac/react-images)
* [Other contributors](https://github.com/haiafara/vue-it-bigger/graphs/contributors)

## License

This project is licensed under the the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
