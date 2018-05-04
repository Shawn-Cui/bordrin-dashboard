import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css'

import Vue from 'vue'
import ElementUI from 'element-ui'
import axios from 'axios'
import moment from 'moment'

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
    axios.interceptors.request.use(config => {
      if (config.url.indexOf(url) === -1) {
        config.url = url + config.url
      }
      if (config.url.indexOf('login') === -1) {
        let token = localStorage.getItem('BDToken') || ''
        console.log(config.params)
        config.params = {
          'access_token': token
        }
        console.log(config.params)        
      }
      return config
    }, error => {
      return Promise.reject(error)
    })

    axios.interceptors.response.use(res => {
      console.log(res)
      return res
    }, error => {
      let response = error.response
      if (response && response.status === 401) {
        console.log(this, this.$router)
        this.$router.push({
          name : 'login'
        })
      }
      return Promise.reject(error)
    })

    Vue.filter('formatDateTime', function (value) {
      if (value) {
        if (typeof value === 'string') {
          return moment(String(value)).format('YYYY-MM-DD hh:mm')
        } else if (typeof value === 'number') {
          return moment.unix(value / 1000).format('YYYY-MM-DD hh:mm')
        }
      }
    })
  }
})
