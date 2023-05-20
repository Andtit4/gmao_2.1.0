import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from  'bootstrap-vue' 
import Vuesax from 'vuesax'

import 'vuesax/dist/vuesax.css'

// Importation des fichiers CSS Bootstrap et BootstrapVue (l'ordre est important) 
import  'bootstrap/dist/css/bootstrap.css' 
import  'bootstrap-vue/dist/bootstrap-vue.css' 

// Rendre BootstrapVue disponible dans tout votre projet 
Vue.use(BootstrapVue) // Installer éventuellement le plugin de composants d'icône BootstrapVue 
Vue.use(IconsPlugin)
Vue.use(Vuesax)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
