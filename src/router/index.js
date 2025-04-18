import { createRouter, createWebHashHistory } from 'vue-router'
// import Style from '@/views/StyleView.vue'
import Home from '@/views/HomeView.vue'
import Login from '@/views/LoginView.vue'
import Zone from '@/views/sites/zone/zone.vue'
import Site from '@/views/sites/sitesView.vue'
import Intervenant from '@/views/intervenant/IntervenantView.vue'
import IntervenantList from '@/views/intervenant/intervenantList.vue'
import Equipement from '@/views/equipement/equipementView.vue'
import EquipementList from '@/views/equipement/equipementList.vue'
import HistoriqueEquipement from '@/views/equipement/historique/historiqueEquipement.vue'
import SortiEquipement from '@/views/equipement/sortis/sortiView.vue'
import ArticleView from '@/views/equipement/article/articleView.vue'
import SiteList from '@/views/sites/list.vue'
import ClassiqueView from '@/views/preventive/classique/ClassiqueView.vue'
import PlanifieView from '@/views/preventive/plannifie/plannifieView.vue'
import PlanifieList from '@/views/preventive/plannifie/list.vue'
import TraiterPlannif from '@/views/chef_equipe/HomeView.vue'
import ListPlannificationVue from '@/views/chef_equipe/ListPlannification.vue'
import ListPlannificationBySite from '@/views/chef_equipe/list/ListPlannification.vue'
import NotFound from '@/views/NotFound.vue'
import CentralView from '@/views/centraux/superviseur/CentralView.vue'
import CentralList from '@/views/centraux/superviseur/CentralList.vue'
import RefuelingView from '@/views/Refuelings/Refueling.vue'
import RefuelingViewForUser from '@/views/Refuelings/User/Refueling.vue'
import DashboardCentraux from '@/views/centraux/DashboardView.vue'
import EquipementCentral from '@/views/centraux/superviseur/equipement/EquipementCentral.vue'
import zoneView from '@/views/centraux/superviseur/zone/zoneView.vue'
import salleView from '@/views/centraux/superviseur/salle/salleView.vue'
import plannificationView from '@/views/centraux/superviseur/plannif/plannificationView.vue'
import plannificationList from '@/views/centraux/intervention/plannificationList.vue'
import plannificationListForCentraux from '@/views/centraux/plannifications/ListPlannification.vue'

const routes = [{
        path: '/:catchAll(.*)',
        component: NotFound
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
            title: 'Zone Central',
            requiresAuth: true
        },
        path: '/central/:type/:pass',
        name: 'CentralZone',
        component: CentralView
    },
    {
        meta: {
            title: 'Refueling',
            requiresAuth: true
        },
        path: '/refueling/user/:type/:pass',
        name: 'RefuelingUser',
        component: RefuelingViewForUser
    },
    {
        meta: {
            title: 'Refueling',
            requiresAuth: true
        },
        path: '/refueling/:type/:pass',
        name: 'RefuelingView',
        component: RefuelingView
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
            title: 'Liste',
            requiresAuth: true
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
        component: Home
    },
    {
        meta: {
            title: 'Sites',
            requiresAuth: true
        },
        path: '/site/:type/:pass',
        name: 'sites',
        component: Site
    },
    {
        meta: {
            title: 'Zones',
            requiresAuth: true
        },
        path: '/zone/:type/:pass',
        name: 'zone',
        component: Zone
    },
    {
        meta: {
            title: 'Sites',
            requiresAuth: true
        },
        path: '/site/list/:type/:pass',
        name: 'List',
        component: SiteList
    },
    {
        meta: {
            title: 'Intervenants',
            requiresAuth: true
        },
        path: '/intervenant/:type/:pass',
        name: 'intervenant',
        component: Intervenant
    },
    {
        meta: {
            title: 'Intervenants',
            requiresAuth: true
        },
        path: '/intervenant/list/:type/:pass',
        name: 'intervenants',
        component: IntervenantList
    },
    {
        meta: {
            title: 'Equipements',
            requiresAuth: true
        },
        path: '/equipement/:type/:pass',
        name: 'equipement',
        component: Equipement
    },
    {
        meta: {
            title: 'Equipements',
            requiresAuth: true
        },
        path: '/equipement/list/:type/:pass',
        name: 'equipement list',
        component: EquipementList
    },
    {
        meta: {
            title: 'Articles',
            requiresAuth: true
        },
        path: '/article/:type/:pass',
        name: 'article',
        component: ArticleView
    },
    {
        meta: {
            title: 'Historiques',
            requiresAuth: true
        },
        path: '/historique/:type/:pass',
        name: 'historique list',
        component: HistoriqueEquipement
    },
    {
        meta: {
            title: 'Sortie',
            requiresAuth: true
        },
        path: '/sorti/:type/:pass',
        name: 'sorti list',
        component: SortiEquipement
    },

    {
        meta: {
            title: 'MP',
            requiresAuth: true
        },
        path: '/preventive/classique/:type/:pass',
        name: 'preventiveClassique',
        component: ClassiqueView
    },
    {
        meta: {
            title: 'PLANNIFIE',
            requiresAuth: true
        },
        path: '/preventive/plannifie/:type/:pass',
        name: 'plannifie',
        component: PlanifieView
    },
    {
        meta: {
            title: 'PLANNIFICATION',
            requiresAuth: true
        },
        path: '/preventive/plannification/:type/:pass',
        name: 'plannifications',
        component: PlanifieList
    },
    {
        meta: {
            title: 'DASHBOARD',
            requiresAuth: true
        },
        path: '/dashboard/centraux/:type/:pass',
        name: 'dashboard_centraux',
        component: DashboardCentraux
    },
    {
        meta: {
            title: 'EQUIPEMENT CENTRAL',
            requiresAuth: true
        },
        path: '/dashboard/equipement/centraux/:type/:pass',
        name: 'equipement_centraux',
        component: EquipementCentral
    },
    {
        meta: {
            title: 'ZONE CENTRALE',
            requiresAuth: true
        },
        path: '/dashboard/zone/centraux/:type/:pass',
        component: zoneView
    },
    {
        meta: {
            title: 'SALLE CENTRALE',
            requiresAuth: true
        },
        path: '/dashboard/salle/centraux/:type/:pass',
        component: salleView
    }, {
        meta: {
            title: 'PLANNIFICATION',
            requiresAuth: true
        },
        path: '/dashboard/plannification/centraux/:type/:pass',
        component: plannificationView
    },
    {
        meta: {
            title: 'PLANNIFICATION CENTRAUX',
            requiresAuth: true
        },
        path: '/dashboard/plannification/centraux/list/:type/:pass',
        component: plannificationListForCentraux

    }, {
        meta: {
            title: 'Intervention',

            requiresAuth: true
        },
        path: '/dashboard/intervention/centraux/:type/:pass',
        name: 'InterventionCentral',
        component: plannificationList
    },
    {
        meta: {
            title: 'Profile',
            requiresAuth: true
        },
        path: '/profile/:type/:pass',
        name: 'profile',
        component: () =>
            import ('@/views/ProfileView.vue')
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
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        // Vérifier l'authentification de l'utilisateur
        const token = localStorage.getItem('token')
        if (!token) {
            // Rediriger vers la page de connexion si non authentifié
            next('/')
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router