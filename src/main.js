import Vue from 'vue'

import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import LoaderImg from '../assets/images/loading_apple.gif'

Vue.use(VueLazyload,{
  loading: LoaderImg
})

new Vue({
  el: '#app',
  render: h => h(App)
})

