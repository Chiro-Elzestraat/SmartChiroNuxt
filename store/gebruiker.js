export const state = () => ({
  user: {
    isLoggedIn: false,
    data: {}, // nog een extra property maken voor het bijhouden van welke menutjes zichtbaar zijn voor de gebruiker
    nieuweGebruiker: false,
    ouder: false,
    leider: false,
    secretaris: false,
    groepsleider: false,
    website: false
  }
})

export const mutations = {
  setUserData(state, user) {
    if (user !== null) {
      state.user.isLoggedIn = true
    }
    state.user.data = user
  },
  setLoggedIn(state, loggedIn) {
    state.user.isLoggedIn = loggedIn
  },
  setNieuweGebruiker(state, isNieuw) {
    state.user.nieuweGebruiker = isNieuw
  },
  setClaim(state, claim) {
    state.user[claim] = true
  },
  setOuder(state, ouder) {
    state.user.ouder = ouder
  },
  loguit(state){
    state.user.isLoggedIn = false
    state.user = {
      isLoggedIn: false,
      data: {},
      nieuweGebruiker: false,
      ouder: false,
      leider: false,
      secretaris: false,
    }
  }
}

export const actions = {
  fetchUser({ commit }, user) {
    commit('setLoggedIn', false)
    if (user !== null) {
      commit('setUserData', user.toJSON())
    } else {
      commit('setUserData', null)
      this.$router.push('/account')
    }
  }
}
