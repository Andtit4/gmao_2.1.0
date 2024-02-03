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

let type = await Cookies.get('type')
let pass = Cookies.get('pass')
let data

console.log('\n\ntype = ', type)

if (type == 'superviseur') {
  data = [
    {
      to: '/dashboard/' + type + '/' + pass,
      icon: mdiMonitor,
      label: 'Dashboard'
    },

    /* {
      label: 'Sites',
      icon: mdiTable,
      menu: [
        {
          label: 'Zone',
          to: '/zone/' + type + '/' + pass
        },
        {
          label: 'Ajouter',
          to: '/site/' + type + '/' + pass
        },
        {
          label: 'Liste',
          to: '/site/list/' + type + '/' + pass
        }
      ]
    }, */
    /* {
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
    }, */
    /* {
      label: 'PDR',
      icon: mdiViewList,
      menu: [
        {
          label: 'Ajouter',
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
    }, */
    {
      label: 'MP',
      icon: mdiViewList,
      menu: [
        /* {
          label: 'Zone',
          to: '/preventive/classique/' + type + '/' + pass
        }, */
        {
          label: 'Plannifier',
          to: '/preventive/plannifie/' + type + '/' + pass
        },
        {
          label: 'Plannifications',
          to: '/preventive/plannification/' + type + '/' + pass
        }
      ]
    }
    /*
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
} else if (type == "chef_equipe") {
  data = [
    {
      to: '/dashboard/' + type + '/' + pass,
      icon: mdiMonitor,
      label: 'Dashboard'
    }, {
      label: 'Sites',
      icon: mdiTable,
      menu: [
        {
          label: 'Zone',
          to: '/zone/' + type + '/' + pass
        },
        {
          label: 'Ajouter',
          to: '/site/' + type + '/' + pass
        },
        {
          label: 'Liste',
          to: '/site/list/' + type + '/' + pass
        }
      ]
    }, {
      label: 'Plannif.',
      icon: mdiLock,
      to: '/traiter/' + type + '/' + pass,
    }
  ]

} else {
  data = [
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
          label: 'Zone',
          to: '/zone/' + type + '/' + pass
        },
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
      label: 'PDR',
      icon: mdiViewList,
      menu: [
        {
          label: 'Ajouter',
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
    },
    {
      label: 'MP',
      icon: mdiViewList,
      menu: [
        {
          label: 'Zone',
          to: '/preventive/classique/' + type + '/' + pass
        },
        {
          label: 'Plannifier',
          to: '/preventive/plannifie/' + type + '/' + pass
        },
        {
          label: 'Plannifications',
          to: '/preventive/plannification/' + type + '/' + pass
        }

      ]
    },
    {
      label: 'Plannif.',
      icon: mdiLock,
      to: '/traiter/' + type + '/' + pass,
    }

  ]
}

export default data
