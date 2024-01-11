import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette,
  mdiReact
} from '@mdi/js'
import Cookies from 'js-cookie'

let type = Cookies.get('type')
let pass = Cookies.get('pass')

export default [
  {
    to: '/dashboard/' + type + '/' + pass,
    icon: mdiMonitor,
    label: 'Dashboard'
  },
  {
    label: 'Sites',
    icon: mdiTable,
    menu: [
      {
        label: 'Ajouter',
        to: '/site/' + type + '/' + pass
      },
      {
        label: 'Liste',
        to: '/site/list/' + type + '/' + pass
      }
    ]
  },
  {
    label: 'Intervenants',
    icon: mdiViewList,
    menu: [
      {
        label: 'Ajouter',
        to: '/intervenant/' + type + '/' + pass
      },
      {
        label: 'Liste',
        to: '/intervenant/list/' + type + '/' + pass
      }
    ]
  },
  {
    label: 'Matériels',
    icon: mdiViewList,
    menu: [
      {
        label: 'Ajouter un materiel',
        to: '/equipement/' + type + '/' + pass
      },
      {
        label: 'Liste matériel',
        to: '/equipement/list/' + type + '/' + pass
      },
      {
        label: 'Entrées',
        to: '/article/' + type + '/' + pass
      },
      {
        label: 'Sortie',
        to: '/sorti/' + type + '/' + pass
      },
      {
        label: 'Historique',
        to: '/historique/' + type + '/' + pass
      }
    ]
  }
  /*  {
    to: '/tables',
    label: 'Tables',
    icon: mdiTable
  },
  {
    to: '/forms',
    label: 'Forms',
    icon: mdiSquareEditOutline
  },
  {
    to: '/ui',
    label: 'UI',
    icon: mdiTelevisionGuide
  },
  {
    to: '/responsive',
    label: 'Responsive',
    icon: mdiResponsive
  },
  {
    to: '/',
    label: 'Styles',
    icon: mdiPalette
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle
  },
  {
    to: '/login',
    label: 'Login',
    icon: mdiLock
  },
  {
    to: '/error',
    label: 'Error',
    icon: mdiAlertCircle
  },
  {
    label: 'Dropdown',
    icon: mdiViewList,
    menu: [
      {
        label: 'Item One'
      },
      {
        label: 'Item Two'
      }
    ]
  },
  {
    href: 'https://github.com/justboil/admin-one-vue-tailwind',
    label: 'GitHub',
    icon: mdiGithub,
    target: '_blank'
  },
  {
    href: 'https://github.com/justboil/admin-one-react-tailwind',
    label: 'React version',
    icon: mdiReact,
    target: '_blank'
  } */
]
