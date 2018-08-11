import Vue from 'vue'
import Vuex from 'vuex'
import { createProvider } from './vue-apollo'
const provide = createProvider().provide()
const apolloClient = provide.$apolloProvider.defaultClient

Vue.use(Vuex)

import LOGGED_IN_USER from '@/graphql/LoggedInUser.gql'

export default new Vuex.Store({
  state: {
    userId: null
  },
  mutations: {
    setUserId (state, value) {
      state.userId = value
    }
  },
  getters: {
    getUserId: state => state.userId
  },
  actions: {
    async setUserId ({ commit }) {
      return new Promise((resolve, reject) => {
        apolloClient
          .query({ query: LOGGED_IN_USER })
          .then(response => {
            commit('setUserId', response.data.loggedInUser.id)
            resolve()
          })
      })
    },
    async getUserId ({ self, state, dispatch }) {
      await dispatch('setUserId')
      return state.userId
    }
  }
})
