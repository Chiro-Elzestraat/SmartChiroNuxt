const getDefaultState = () => {
  return {
    items: [
      {
        title: 'Leden',
        icon: 'mdi-account-group',
        to: '/leden',
        rol: 'leider'
      },
      { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
      { title: 'Onze Chiro', icon: 'mdi-home-city', to: '/onzeChiro', rol: 'leider' },
      { title: 'Uitstappen', icon: 'mdi-tent', to: '/uitstap' },
      { title: 'Mijn account', icon: 'mdi-account', to: '/account' },
      { title: 'Instellingen', icon: 'mdi-cog', to: '/instellingen' }
    ]
  }
}

export const state = getDefaultState()

export const mutations = {
  setExtraItems(state, items) {
    console.log(items)
    state.items = [...items, ...state.items]
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
    localStorage.removeItem('extraMenu')
  }
}
