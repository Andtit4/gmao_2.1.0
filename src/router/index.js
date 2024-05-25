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
import PlanifieList from '@/views/preventive/plannifie/list.vue'
import TraiterPlannif from '@/views/chef_equipe/HomeView.vue'
import ListPlannificationVue from '@/views/chef_equipe/ListPlannification.vue'
import ListPlannificationBySite from '@/views/chef_equipe/list/ListPlannification.vue'
import NotFound from '@/views/NotFound.vue'
import CentralView from '@/views/centraux/superviseur/CentralView.vue'
import CentralList from '@/views/centraux/superviseur/CentralList.vue'

const routes = [
  {
    path: '/:catchAll(.*)',
    component: NotFound,
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/',
    name: 'Login',
    component: Login
  }, {
    meta: {
      title: 'Zone Central',
      requiresAuth: true
    },
    path: '/central/:type/:pass',
    name: 'CentralZone',
    component: CentralView
  },
  {
    meta: {
      title: 'Traiter',
      requiresAuth: true
    },
    path: '/traiter/:type/:pass',
    name: 'Traiter',
    component: TraiterPlannif
  },
  {
    meta: {
      title: 'Liste'
      , requiresAuth: true
    },
    path: '/plannification/site/:type/:pass',
    name: 'ListePlannificationSite',
    component: ListPlannificationBySite
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    },
    path: '/dashboard/:type/:pass',
    name: 'Dashboard',
    component: Home,
  },
  {
    meta: {
      title: 'Sites'
      , requiresAuth: true
    },
    path: '/site/:type/:pass',
    name: 'sites',
    component: Site
  },
  {
    meta: {
      title: 'Zones'
      , requiresAuth: true
    },
    path: '/zone/:type/:pass',
    name: 'zone',
    component: Zone
  },
  {
    meta: {
      title: 'Sites'
      , requiresAuth: true
    },
    path: '/site/list/:type/:pass',
    name: 'List',
    component: SiteList
  },
  {
    meta: {
      title: 'Intervenants'
      , requiresAuth: true
    },
    path: '/intervenant/:type/:pass',
    name: 'intervenant',
    component: Intervenant
  },
  {
    meta: {
      title: 'Intervenants'
      , requiresAuth: true
    },
    path: '/intervenant/list/:type/:pass',
    name: 'intervenants',
    component: IntervenantList
  },
  {
    meta: {
      title: 'Equipements'
      , requiresAuth: true
    },
    path: '/equipement/:type/:pass',
    name: 'equipement',
    component: Equipement
  },
  {
    meta: {
      title: 'Equipements'
      , requiresAuth: true
    },
    path: '/equipement/list/:type/:pass',
    name: 'equipement list',
    component: EquipementList
  },
  {
    meta: {
      title: 'Articles'
      , requiresAuth: true
    },
    path: '/article/:type/:pass',
    name: 'article',
    component: ArticleView
  },
  {
    meta: {
      title: 'Historiques'
      , requiresAuth: true
    },
    path: '/historique/:type/:pass',
    name: 'historique list',
    component: HistoriqueEquipement
  },
  {
    meta: {
      title: 'Sortie'
      , requiresAuth: true
    },
    path: '/sorti/:type/:pass',
    name: 'sorti list',
    component: SortiEquipement
  },

  {
    meta: {
      title: 'MP'
      , requiresAuth: true
    },
    path: '/preventive/classique/:type/:pass',
    name: 'preventiveClassique',
    component: ClassiqueView
  },
  {
    meta: {
      title: 'PLANNIFIE'
      , requiresAuth: true
    },
    path: '/preventive/plannifie/:type/:pass',
    name: 'plannifie',
    component: PlanifieView
  },
  {
    meta: {
      title: 'PLANNIFICATION'
      , requiresAuth: true
    },
    path: '/preventive/plannification/:type/:pass',
    name: 'plannifications',
    component: PlanifieList
  },
  {
    meta: {
      title: 'Profile'
      , requiresAuth: true
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },



]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Guard de navigation global
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Vérifier l'authentification de l'utilisateur
    const token = localStorage.getItem('token')
    if (!token) {
      // Rediriger vers la page de connexion si non authentifié
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
