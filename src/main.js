import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css'

import Vue from 'vue'
import ElementUI from 'element-ui'
import axios from 'axios'

import router from './router'
import App from './App'

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  created() {
    const url = process.env.API_ROOT
    axios.interceptors.request.use(function (config) {
      if (config.url.indexOf(url) === -1) {
        config.url = url + config.url
      }
      return config;
    }, function (error) {
      return Promise.reject(error)
    })
  }
})
