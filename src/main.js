import Vue from 'vue'

import App from './App.vue'
import CustomCaptionApp from './CustomCaptionApp.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})

new Vue({
  el: '#custom-caption-app',
  render: h => h(CustomCaptionApp)
})
