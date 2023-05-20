import Vue from 'vue'
import App from './App.vue'
import Vuesax from 'vuesax'
import { BootstrapVue, IconsPlugin } from  'bootstrap-vue' 
import router from './router'

import 'vuesax/dist/vuesax.css'
import  'bootstrap/dist/css/bootstrap.css' 
import  'bootstrap-vue/dist/bootstrap-vue.css' 
import './assets/fonts/global-font.css'
import Soft from "./soft-ui";

// import './assets/bootstrap/scss/_variables.scss'

Vue.use(BootstrapVue) 
Vue.use(IconsPlugin)
Vue.use(Soft)
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
  router,
  render: h => h(App),
}).$mount('#app')
