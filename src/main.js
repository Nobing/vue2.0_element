import Vue from 'vue'
import App from './App'
import router from './router'
import Vuelazyload from 'vue-lazyload'

import './common/stylus/index.styl'

Vue.config.productionTip = false

Vue.use(Vuelazyload, {
  loading: require('common/images/loading.gif')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
