import { mdiMonitor, mdiLock, mdiTable, mdiViewList, mdiOil, mdiPlus } from '@mdi/js'

let type = localStorage.getItem('type')
let pass = localStorage.getItem('pass')
let data

if (type == 'superviseur') {
  data = [
    {
      to: '/dashboard/' + type + '/' + pass,
      icon: mdiMonitor,
      label: 'Dashboard'
    },
    {
      label: 'MP',
      icon: mdiViewList,
      menu: [
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
      label: 'Refueling',
      icon: mdiOil,
      menu: [
        {
          icon: mdiPlus,
          label: 'Add - List',
          to: '/refueling/' + type + '/' + pass
        }
      ]
    }
  ]
} else if (type == 'chef_equipe') {
  data = [
    {
      to: '/dashboard/' + type + '/' + pass,
      icon: mdiMonitor,
      label: 'Dashboard'
    },
    {
      label: 'Plannif.',
      icon: mdiLock,
      to: '/traiter/' + type + '/' + pass
    },
    {
      label: 'Refueling',
      icon: mdiOil,
      to: '/refueling/user/' + type + '/' + pass
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
          label: 'Matériels',
          to: '/equipement/' + type + '/' + pass
        },
        {
          label: 'Stocks',
          to: '/equipement/list/' + type + '/' + pass
        },
        {
          label: 'Mouvements',
          to: '/article/' + type + '/' + pass
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
      label: 'Centraux',
      icon: mdiMonitor,
      menu: [
        {
          label: 'Dashboard',
          to: '/dashboard/centraux/' + type + '/' + pass
        },
        {
          label: 'Equipement',
          to: '/dashboard/equipement/centraux/' + type + '/' + pass
        },
        {
          label: 'Central',
          to: '/central/' + type + '/' + pass
        }
      ]
    },
    {
      label: 'Refueling',
      icon: mdiOil,
      menu: [
        {
          icon: mdiPlus,
          label: 'Add - List',
          to: '/refueling/' + type + '/' + pass
        }
      ]
    }
  ]
}

export default data
