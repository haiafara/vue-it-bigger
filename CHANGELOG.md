# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-01

### Added
- YouTube API integration for programmatic video control
- Directional slide transitions that indicate navigation direction
- Image preloading for adjacent images to improve the user experience
- Package version display in demo footer
- Test coverage for YouTube integration and interaction

### Changed
- **BREAKING**: Refactored LightBox component from Options API to Composition API using `<script setup>`
- Extracted logic into separate composables for better code organization:
  - `useNavigation`: handles image selection, transitions, and preloading
  - `useUIControls`: manages mouse activity and controls visibility
  - `useTouchSwipe`: implements touch gesture detection
  - `useYouTube`: manages YouTube player integration
  - `useLightboxLifecycle`: handles open/close lifecycle events
- Preserved YouTube playback state when navigating between media items
- Updated tests to verify DOM state instead of internal component state
- Reorganized the LightBox test suite into focused files for rendering, interaction, and props/events
- Removed Nuxt usage instructions from README (dropping Nuxt support)
- Consolidated anchor styles in demo
- Extracted demo deployment into reusable workflow

### Fixed
- YouTube videos now pause when closing the lightbox
- YouTube player instances are properly cleaned up on component unmount
- YouTube iframes are preserved outside transitions to prevent destruction during navigation

### Dependencies
- Updated Vite from v6.0.5 to v7.3.1
- Updated Vitest from v2.1.8 to v4.0.18
- Updated @vitejs/plugin-vue from v5.2.1 to v6.0.3
- Updated @vitest/coverage-v8 from v2.1.8 to v4.0.18
- Updated jsdom to v27.4.0
- Upgraded Codecov action from v4 to v5

## [1.0.0] - 2026-01-31

### Added
- Vue 3 support with updated component APIs
- Vite build system for development and production builds
- Vitest testing framework replacing Jest
- Native touch event handling for swipe gestures (replaced Hammerjs)
- ESM module format with dual CJS/ESM exports
- ESLint flat config format
- CI workflows for Node.js 20.x/22.x with latest action versions
- Demo application in dedicated `demo/` directory
- Explicit emits declaration for all component events
- Enhanced publish workflow with version validation and changelog check
- Separate deploy-demo job for GitHub Pages deployment
- New npm scripts: `build:demo`, `preview`, `test:watch`, `test:coverage`
- `vue3` keyword to package.json
- Coverage reporting with Vitest

### Changed
- **BREAKING**: Requires Vue 3.3.0 or higher
- **BREAKING**: CSS import path changed from `vue-it-bigger/dist/vue-it-bigger.min.css` to `vue-it-bigger/dist/vue-it-bigger.css`
- **BREAKING**: Component lifecycle hook `beforeDestroy` renamed to `beforeUnmount`
- Replaced Webpack with Vite for build system
- Replaced Jest with Vitest for testing
- Removed legacy CSS vendor prefixes
- Updated keyboard event handling from `event.keyCode` to `event.key`
- Removed `$set` usage (Vue 3 reactivity improvements)
- Updated Vue 3 transition class names (`enter` → `enter-from`)
- Updated icon component imports to include `.vue` extension
- Converted HTML tables to markdown tables in README for better formatting
- Removed prominent references to vue-image-lightbox from README and package.json
- Updated to `@vue/test-utils` v2
- Added `type: "module"` to package.json

### Removed
- Hammerjs dependency (replaced with native touch events)
- Webpack build configuration
- Jest testing framework
- `jsconfig.json` file
- Contributors list from package.json

## [0.3.2] - 2023-01-20

### Changed
- Updated ESLint to version 8.32.0
- Updated eslint-plugin-vue to version 9.9.0
- Updated babel-loader to version 9.1.2
- Updated all babel7 packages to version 7.20.12

## [0.3.1] - 2022-12-18

### Changed
- Updated ESLint to version 8.30.0
- Updated mini-css-extract-plugin to version 2.7.2
- Updated ESLint to version 8.29.0
- Updated mini-css-extract-plugin to version 2.7.1
- Updated all babel7 packages to version 7.20.5
- Updated eslint-plugin-vue to version 9.8.0
- Updated ESLint to version 8.28.0
- Updated mini-css-extract-plugin to version 2.7.0
- Updated css-loader to version 6.7.2
- Updated ESLint to version 8.27.0
- Updated css-minimizer-webpack-plugin to version 4.2.2
- Updated chokidar to version 3.5.3
- Updated copy-webpack-plugin to version 11.0.0
- Updated eslint-plugin-vue to version 9.7.0
- Updated css-loader to version 6.7.1
- Updated babel-loader to version 9.1.0
- Fixed jest upgrade related issues
- Updated jest to version 29.3.1
- Fixed build errors after package upgrades and other optimizations
- Updated terser-webpack-plugin to version 5.3.6
- Upgraded to vue-template-compiler 2.7.14
- Upgraded to vue 2.7.14
- Updated vue-loader to version 17.0.1
- Updated @babel/runtime to version 7.20.1
- Updated @babel/plugin-transform-runtime to version 7.19.6
- Updated all babel7 packages to version 7.20.2
- Updated babel-loader to version 8.2.5

## [0.3.0] - 2022-11-14

### Changed
- Upgraded to Vue 2.7.14
- Updated vue-loader to version 17.0.1
- Updated all babel7 packages to version 7.20.2
- Updated babel-loader to version 8.2.5

## [0.2.2] - 2021-03-26

### Fixed
- Fixes for new webpack and other packages
- Updated build scripts to remove `--hide-modules` flag

### Changed
- Updated style-loader to version 2.0.0
- Updated @babel/preset-env to version 7.13.12

## [0.2.1] - 2021-03-07

### Changed
- Updated package description to specify "(YouTube) video"
- Updated ESLint to version 7.21.0
- Updated all babel7 packages to version 7.13.8

## [0.1.1] - 2020-10-05

### Changed
- Updated style-loader to version 1.3.0

## [0.1.0] - 2020-10-04

### Changed
- Updated mini-css-extract-plugin to version 0.11.3
- Updated ESLint to version 7.10.0

## [0.0.7] - 2020-10-04

### Changed
- Updated mini-css-extract-plugin to version 0.11.3

## [0.0.6] - 2020-10-04

### Changed
- Updated mini-css-extract-plugin to version 0.11.3
- Updated ESLint to version 7.10.0

## [0.0.5] - 2020-09-11

### Changed
- Updated mini-css-extract-plugin to version 0.11.1
- Updated copy-webpack-plugin to version 6.1.0

## [0.0.4] - 2020-09-11

### Changed
- Updated @babel/core to version 7.11.6
- Updated ESLint to version 7.8.1
- Updated all babel7 packages to version 7.11.5
- Updated file-loader to version 6.1.0
- Updated html-webpack-plugin to version 4.4.1
- Updated jest to version 26.4.2

## [0.0.3] - 2020-08-17

### Changed
- Updated ESLint to version 7.7.0
- Updated jest to version 26.4.0
- Updated jest to version 26.3.0
- Updated all babel7 packages to version 7.11.1
- Updated terser-webpack-plugin to version 3.1.0
- Updated ESLint to version 7.6.0
- Updated css-loader to version 4.1.1
- Updated @babel/core to version 7.11.0

## [0.0.2] - 2020-06-25

### Changed
- Updated jest to version 26.1.0
- Updated vue-loader to version 15.9.3
- Updated ESLint to version 7.3.1
- Updated all babel7 packages to version 7.10.3
- Updated ESLint to version 7.3.0

## [0.0.1] - 2020-06-19

### Added
- Project renamed from `vue-image-lightbox-evolved` to `vue-it-bigger`
- Updated repository URL to https://github.com/haiafara/vue-it-bigger

### Changed
- Updated main entry point to `dist/vue-it-bigger.min.js`

## [8.0.4] - 2020-06-19

### Changed
- Updated @babel/core to version 7.11.4
- Updated all vue packages to version 2.6.12
- Updated jest to version 26.4.1

## [8.0.3] - 2020-04-26

### Added
- Coverage configuration

### Changed
- Updated html-webpack-plugin to version 4.3.0
- Updated all babel7 packages to version 7.9.6
- Updated jest to version 25.5.4
- Updated vue-loader to version 15.9.2

## [8.0.2] - 2020-04-26

### Added
- Build script for github pages
- Demo page preparation

### Changed
- Updated webpack-cli to version 3.3.11
- Updated html-webpack-plugin to version 4.2.0
- Updated webpack-dev-server to version 3.10.3
- Updated webpack to version 4.43.0
- Updated url-loader to version 4.1.0
- Updated mini-css-extract-plugin to version 0.9.0
- Updated file-loader to version 6.0.0
- Updated css-loader to version 3.5.3
- Updated babel-loader to version 8.1.0
- Updated terser-webpack-plugin to version 2.3.6
- Updated eslint-plugin-vue to version 6.2.2
- Updated rimraf to version 3.0.2
- Updated vue-loader to version 15.9.1

## [8.0.1] - 2020-04-26

### Added
- Testing infrastructure with jest

### Changed
- Removed vue-lazyload dependency

## [7.0.0] - 2020-02-25

### Added
- Video display feature for YouTube videos

### Changed
- Updated author name to "Nguyen P. Thien Dzung"
- Updated ESLint to version 6.8.0
- Updated all dependencies

## [6.4.0] - 2019-09-02

### Added
- Alt attribute to images

### Changed
- Updated all dependencies including @babel packages, babel-loader, hammerjs, vue-lazyload, css-loader, eslint, file-loader, html-webpack-plugin, jest, mini-css-extract-plugin, optimize-css-assets-webpack-plugin, rimraf, style-loader, url-loader, vue, vue-loader, vue-template-compiler, webpack, webpack-cli, webpack-dev-server

## [6.3.0] - 2019-07-07

### Added
- Slot support (pull request #55)

### Changed
- Updated all babel7 packages
- Updated babel-loader to version 8.2.2
- Updated @babel/core to version 7.12.9
- Updated ESLint to version 7.14.0
- Updated all babel7 packages to version 7.12.7
- Updated babel-loader to version 8.2.1
- Updated ESLint to version 7.13.0
- Updated jest to version 26.6.3
- Updated jest to version 26.6.2
- Updated vue-loader to version 15.9.5
- Updated file-loader to version 6.2.0
- Updated vue-loader to version 15.9.4
- Updated ESLint to version 7.12.1
- Updated ESLint to version 7.12.0
- Updated jest to version 26.6.1
- Updated jest to version 26.6.0
- Updated @babel/core to version 7.12.3
- Updated all babel7 packages to version 7.12.0
- Updated jest to version 26.5.3
- Updated ESLint to version 7.11.0
- Updated file-loader to version 6.1.1
- Updated url-loader to version 4.1.1
- Updated terser-webpack-plugin to version 4.2.3
- Updated jest to version 26.5.2

## [6.2.1] - 2019-06-11

### Changed
- Updated all babel7 packages
- Updated babel-loader to version 8.0.6
- Updated @babel/preset-env to version 7.5.5
- Updated copy-webpack-plugin to version 5.1.1
- Updated css-loader to version 3.2.0
- Updated eslint to version 6.3.0
- Updated file-loader to version 4.2.0
- Updated html-webpack-plugin to version 4.3.0
- Updated jest to version 24.9.0
- Updated mini-css-extract-plugin to version 0.8.0
- Updated optimize-css-assets-webpack-plugin to version 5.0.3
- Updated rimraf to version 3.0.0
- Updated style-loader to version 1.0.0
- Updated url-loader to version 2.1.0
- Updated vue to version 2.6.10
- Updated vue-loader to version 15.7.1
- Updated vue-template-compiler to version 2.6.10
- Updated webpack to version 4.39.3
- Updated webpack-cli to version 3.3.7
- Updated webpack-dev-server to version 3.8.0

## [6.1.1] - 2019-01-28

### Fixed
- SSR issue with hammerjs window check

### Changed
- Updated style-loader to version 0.21.0
- Updated uglifyjs-webpack-plugin to version 1.2.5
- Updated url-loader to version 1.0.1
- Updated webpack to version 4.16.5
- Updated webpack-cli to version 3.0.8
- Updated webpack-dev-server to version 3.1.4

## [6.1.0] - 2019-01-28

### Added
- Slot support (pull request #55)

## [6.0.1] - 2018-09-13

### Changed
- Added build files

## [6.0.0] - 2018-06-18

### Added
- Production build mode flag

### Changed
- Replaced vue-touch with hammerjs
- Updated vue-lazyload to version 1.2.6
- Updated all babel7 packages
- Updated babel-loader to version 7.1.5
- Updated copy-webpack-plugin to version 4.5.2
- Updated css-loader to version 1.0.0
- Updated eslint to version 5.0.1
- Updated file-loader to version 1.1.11
- Updated html-webpack-plugin to version 3.2.0
- Updated jest to version 23.2.0
- Updated mini-css-extract-plugin to version 0.4.1
- Updated optimize-css-assets-webpack-plugin to version 4.0.2
- Updated rimraf to version 2.6.2
- Updated style-loader to version 0.21.0
- Updated uglifyjs-webpack-plugin to version 1.2.5
- Updated url-loader to version 1.0.1
- Updated vue to version 2.5.16
- Updated vue-loader to version 15.2.4
- Updated vue-template-compiler to version 2.5.16
- Updated webpack to version 4.16.5
- Updated webpack-cli to version 3.0.8
- Updated webpack-dev-server to version 3.1.4

## [5.7.0] - 2018-04-25

### Changed
- Updated all babel7 packages
- Updated babel-loader to version 7.1.5
- Updated copy-webpack-plugin to version 4.5.2
- Updated css-loader to version 1.0.0
- Updated eslint to version 5.0.1
- Updated file-loader to version 1.1.11
- Updated html-webpack-plugin to version 3.2.0
- Updated jest to version 23.2.0
- Updated mini-css-extract-plugin to version 0.4.1
- Updated optimize-css-assets-webpack-plugin to version 4.0.2
- Updated rimraf to version 2.6.2
- Updated style-loader to version 0.21.0
- Updated uglifyjs-webpack-plugin to version 1.2.5
- Updated url-loader to version 1.0.1
- Updated vue to version 2.5.16
- Updated vue-loader to version 15.2.4
- Updated vue-template-compiler to version 2.5.16
- Updated webpack to version 4.16.5
- Updated webpack-cli to version 3.0.8
- Updated webpack-dev-server to version 3.1.4

## [5.6.0] - 2018-04-09

### Changed
- Updated all babel7 packages
- Updated babel-loader to version 7.1.5
- Updated copy-webpack-plugin to version 4.5.2
- Updated css-loader to version 1.0.0
- Updated eslint to version 5.0.1
- Updated file-loader to version 1.1.11
- Updated html-webpack-plugin to version 3.2.0
- Updated jest to version 23.2.0
- Updated mini-css-extract-plugin to version 0.4.1
- Updated optimize-css-assets-webpack-plugin to version 4.0.2
- Updated rimraf to version 2.6.2
- Updated style-loader to version 0.21.0
- Updated uglifyjs-webpack-plugin to version 1.2.5
- Updated url-loader to version 1.0.1
- Updated vue to version 2.5.16
- Updated vue-loader to version 15.2.4
- Updated vue-template-compiler to version 2.5.16
- Updated webpack to version 4.16.5
- Updated webpack-cli to version 3.0.8
- Updated webpack-dev-server to version 3.1.4

## [5.5.3] - 2017-08-09

### Changed
- Updated all dependencies

## [5.5.2] - 2017-07-04

### Changed
- Built min file

## [5.5.1] - 2017-07-02

### Changed
- Updated all dependencies

## [5.5.0] - 2017-06-30

### Added
- OptimizeCSSPlugin

### Changed
- Updated optimize-css-assets-webpack-plugin to version 2.0.0

## [5.4.3] - 2017-06-15

### Fixed
- Import path changed from `src/components/Lightbox.vue` to `dist/vue-image-lightbox.min.js`

## [5.4.2] - 2017-06-15

### Fixed
- Changed cancel bubble to stop propagation

## [5.4.1] - 2017-06-09

### Changed
- Build update

## [5.4.0] - 2017-06-09

### Added
- Swipe gesture support using vue-touch

## [5.3.1] - 2017-06-09

### Fixed
- Fixed image with no src and caption issues

## [5.3.0] - 2017-06-07

### Changed
- Added library UMD build
- Updated build configuration

## [5.2.1] - 2017-05-27

### Changed
- Updated webpack configuration

## [5.2.0] - 2017-05-23

### Changed
- Updated to webpack 2
- Removed deprecated loaders and plugins
- Updated all dependencies

## [5.1.11] - 2017-03-17

### Fixed
- Close button now properly closes lightbox

## [5.1.10] - 2017-03-15

### Changed
- Updated vue-lazyload dependency

## [5.1.9] - 2017-03-15

### Changed
- Version bump

## [5.1.8] - 2017-03-14

### Changed
- Version bump

## [5.1.7] - 2017-03-13

### Changed
- Version bump

## [5.1.6] - 2017-03-13

### Fixed
- Fixed close lightbox when clicking background

## [5.1.5] - 2017-03-13

### Fixed
- Added clearInterval for autoplay

## [5.1.4] - 2017-03-13

### Changed
- Added build files

## [5.1.3] - 2017-03-11

### Changed
- Added remove event listener

## [5.1.2] - 2017-03-11

### Changed
- Version update

## [5.1.1] - 2017-03-10

### Fixed
- Added close lightbox when clicking empty area

## [5.1.0] - 2017-03-10

### Added
- Show caption option

## [5.0.2] - 2017-02-14

### Changed
- Built min file

## [5.0.1] - 2017-02-14

### Fixed
- Fixed key issue

## [5.0.0] - 2017-02-14

### Added
- Major release with Vue 2.1.10

### Changed
- Updated all dependencies
- Updated vue-loader to version 11.0.0
- Updated vue-template-compiler to version 2.1.10
- Updated webpack to version 1.12.2
- Updated webpack-dev-server to version 1.12.0

---

## Historical Versions (vue-image-lightbox)

The project was originally named `vue-image-lightbox` and later renamed to `vue-image-lightbox-evolved` before becoming `vue-it-bigger`. The changelog above captures the history from the rename onwards. Earlier versions (1.0.0 through 8.0.4) were released under the `vue-image-lightbox` name.
