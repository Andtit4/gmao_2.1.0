import Vue from 'vue'
import VueRouter from 'vue-router'
import Sign from '@/pages/sign.vue'
import About from '@/pages/about.vue'
import Dash from '@/pages/dash.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Sign-in',
    component: Sign
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/dash/:id',
    name: 'Dash',
    component: Dash,
    props: true
  },
  // Définissez vos routes ici
]

const router = new VueRouter({
  mode: 'history', // Utilisez "hash" si vous souhaitez utiliser des URLs avec des hash (#)
  linkActiveClass: "active",
  routes
})

export default router
