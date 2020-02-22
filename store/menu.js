const getDefaultState = () => {
  return {
    items: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
      { title: 'Mijn account', icon: 'mdi-account', to: '/account' },
      { title: 'Instellingen', icon: 'mdi-settings', to: '/instellingen' }
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
