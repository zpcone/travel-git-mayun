// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import axios from 'axios'
import 'common/css/index.less'

Vue.prototype.$axios = axios
FastClick.attach(document.body)
Vue.config.productionTip = false
Vue.use(VueLazyload, {
  loading: require('common/images/default.png'),
  error: require('common/images/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
