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
  addItem(state, item) {
    console.log(item)
    if (item !== null) {
      state.items = [item, ...state.items]
      const extraItems = JSON.parse(localStorage.getItem('extraMenu')) || [item]
      if (extraItems) {
        console.log(extraItems)
        extraItems.forEach((extraItem) => {
          console.log('extraitem: ' + extraItem.title)
          if (extraItem.title !== item.title) {
            extraItems.push(item)
          }
        })
      }
      console.log(JSON.stringify(extraItems))
      localStorage.removeItem('extraMenu')
      localStorage.setItem('extraMenu', JSON.stringify(extraItems))
    }
  },
  setExtraItems(state, items) {
    console.log(items)
    items = JSON.parse(items)
    state.items = [...items, ...state.items]
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
    localStorage.removeItem('extraMenu')
  }
}
