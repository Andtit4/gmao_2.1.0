import Vue from 'vue'
import App from './App.vue'
import Vuesax from 'vuesax'
import { BootstrapVue, IconsPlugin } from  'bootstrap-vue' 
import router from './router'

import 'vuesax/dist/vuesax.css'
import  'bootstrap/dist/css/bootstrap.css' 
import  'bootstrap-vue/dist/bootstrap-vue.css' 
import './assets/fonts/global-font.css'
import 'leaflet/dist/leaflet.css'
import Soft from "./soft-ui";
import Vuex from 'vuex';

// import './assets/bootstrap/scss/_variables.scss'

Vue.use(Vuex);
Vue.use(BootstrapVue) 
Vue.use(IconsPlugin)
Vue.use(Soft)
Vue.use(Vuesax)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
