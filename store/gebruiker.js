export const state = () => ({
  user: {
    isLoggedIn: false,
    data: {}
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
