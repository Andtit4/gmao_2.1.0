import { createRouter, createWebHashHistory } from 'vue-router'
// import Style from '@/views/StyleView.vue'
import Home from '@/views/HomeView.vue'
import Login from '@/views/LoginView.vue'
import Zone from '@/views/sites/zone/zone.vue'
import Site from '@/views/sites/sitesView.vue'
import Intervenant from "@/views/intervenant/IntervenantView.vue"
import IntervenantList from '@/views/intervenant/intervenantList.vue'
import Equipement from '@/views/equipement/equipementView.vue'
import EquipementList from '@/views/equipement/equipementList.vue'
import HistoriqueEquipement from '@/views/equipement/historique/historiqueEquipement.vue'
import SortiEquipement from '@/views/equipement/sortis/sortiView.vue'
import ArticleView from '@/views/equipement/article/articleView.vue'
import SiteList from '@/views/sites/list.vue';
import ClassiqueView from '@/views/preventive/classique/ClassiqueView.vue'
import PlanifieView from '@/views/preventive/plannifie/plannifieView.vue'

const routes = [
  /*  {
    meta: {
      title: 'Select style'
    },
    path: '/',
    name: 'style',
    component: Login
  }, */
  {
    meta: {
      title: 'Login'
    },
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard'
    },
    path: '/dashboard/:type/:pass',
    name: 'Dashboard',
    component: Home
  },
  {
    meta: {
      title: 'Sites'
    },
    path: '/site/:type/:pass',
    name: 'sites',
    component: Site
  },
  {
    meta: {
      title: 'Zones'
    },
    path: '/zone/:type/:pass',
    name: 'zone',
    component: Zone
  },
  {
    meta: {
      title: 'Sites'
    },
    path: '/site/list/:type/:pass',
    name: 'List',
    component: SiteList
  },
  {
    meta: {
      title: 'Intervenants'
    },
    path: '/intervenant/:type/:pass',
    name: 'intervenant',
    component: Intervenant
  },
  {
    meta: {
      title: 'Intervenants'
    },
    path: '/intervenant/list/:type/:pass',
    name: 'intervenants',
    component: IntervenantList
  },
  {
    meta: {
      title: 'Equipements'
    },
    path: '/equipement/:type/:pass',
    name: 'equipement',
    component: Equipement
  },
  {
    meta: {
      title: 'Equipements'
    },
    path: '/equipement/list/:type/:pass',
    name: 'equipement list',
    component: EquipementList
  },
  {
    meta: {
      title: 'Articles'
    },
    path: '/article/:type/:pass',
    name: 'article',
    component: ArticleView
  },
  {
    meta: {
      title: 'Historiques'
    },
    path: '/historique/:type/:pass',
    name: 'historique list',
    component: HistoriqueEquipement
  },
  {
    meta: {
      title: 'Sortie'
    },
    path: '/sorti/:type/:pass',
    name: 'sorti list',
    component: SortiEquipement
  },
  {
    meta: {
      title: 'Tables'
    },
    path: '/tables',
    name: 'tables',
    component: Site
  },
  {
    meta: {
      title: 'MP'
    },
    path: '/preventive/classique/:type/:pass',
    name: 'preventiveClassique',
    component: ClassiqueView
  },
  {
    meta: {
      title: 'PLANNIFIE'
    },
    path: '/preventive/plannifie/:type/:pass',
    name: 'plannifie',
    component: PlanifieView
  },
  {
    meta: {
      title: 'Forms'
    },
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/FormsView.vue')
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: {
      title: 'Ui'
    },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue')
  },
  {
    meta: {
      title: 'Responsive layout'
    },
    path: '/responsive',
    name: 'responsive',
    component: () => import('@/views/ResponsiveView.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    meta: {
      title: 'Error'
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
