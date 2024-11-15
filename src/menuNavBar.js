import {
  mdiAccount,
  mdiLogout,
  mdiThemeLightDark,
} from '@mdi/js'
let type = localStorage.getItem('type_utilisateur')
let pass = localStorage.getItem('pass')

export default [
  {
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: 'My Profile',
        to: '/profile/' + type + '/' + pass
      },
      {
        isDivider: true
      },
      {
        icon: mdiLogout,
        label: 'Log Out',
        to: '/',
        isLogout: true
      }
    ]
  },
  {
    icon: mdiThemeLightDark,
    label: 'Light/Dark',
    isDesktopNoLabel: true,
    isToggleLightDark: true
  },

  {
    icon: mdiLogout,
    label: 'Log out',
    isDesktopNoLabel: true,
    to: '/',
    isLogout: true
  }
]
