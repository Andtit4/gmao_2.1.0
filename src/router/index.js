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
  },
  {
    meta: {
      title: 'Traiter'
    },
    path: '/traiter/:type/:pass',
    name: 'Traiter',
    component: TraiterPlannif
  },
  {
    meta: {
      title: 'Liste'
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
      title: 'PLANNIFICATION'
    },
    path: '/preventive/plannification/:type/:pass',
    name: 'plannifications',
    component: PlanifieList
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

// Guard de navigation global
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Vérifier l'authentification de l'utilisateur
    const isAuthenticated = true;
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion si non authentifié
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
