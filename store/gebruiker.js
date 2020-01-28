export const state = () => ({
  user: {
    isLoggedIn: false,
    data: {} // nog een extra property maken voor het bijhouden van welke menutjes zichtbaar zijn voor de gebruiker
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
  }
}

export const actions = {
  fetchUser({ commit }, user) {
    commit('setLoggedIn', false)
    console.log(user)
    if (user !== null) {
      commit('setUserData', user.toJSON())
    } else {
      commit('setUserData', null)
      this.$router.push('/account')
    }
  }
}
