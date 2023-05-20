import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from  'bootstrap-vue' 
import Vuesax from 'vuesax'

import 'vuesax/dist/vuesax.css'
import  'bootstrap/dist/css/bootstrap.css' 
import  'bootstrap-vue/dist/bootstrap-vue.css' 
import './assets/fonts/global-font.css'

Vue.use(BootstrapVue) 
Vue.use(IconsPlugin)
Vue.use(Vuesax, {
  colors: {
    primary:'#facb13',
    success:'#6ca749',
    danger:'rgb(242, 19, 93)',
    warning:'rgb(255, 130, 0)',
    dark:'rgb(36, 33, 69)'
  }
})
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
