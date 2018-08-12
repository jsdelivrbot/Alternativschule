import Vue from 'vue'
import Vuex from 'vuex'

import { createProvider } from './vue-apollo'
const provide = createProvider().provide()
const apolloClient = provide.$apolloProvider.defaultClient

Vue.use(Vuex)

import LOGGED_IN_USER from '@/graphql/LoggedInUser.gql'
import ALL_SUBJECTS_STUDENT from '@/graphql/SubjectsStudent.gql'


export default new Vuex.Store({
  state: {
    userId: null,
    db: {
      subjects: null
    },

    lernLevels: {
      history: {
        understanding: {
          bk: 10,
          gk: 9,
          ak1: 8,
          ak2: 7
        },
        reading: {
          bk: 1,
          gk: 2,
          ak1: 3,
          ak2: 4
        }
      }
    }
  },
  mutations: {
    setUserId (state, value) {
      state.userId = value
    },
    logout (state) {
      state.userId = null
    },

    setLernLevel (state, p) {
      state.lernLevels[p.subject][p.competence][p.level] = p.value
    },

    setSubjects (state, subjects) {
      state.db.subjects = subjects
    }
  },
  getters: {
    getUserId: state => state.userId
  },
  actions: {
    async logoutAction({ commit }) {
      return new Promise((resolve, reject) => {
        commit('logout')
        resolve()
      })
    },
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
    },

    async setApolloDataToStore({ commit }) {
      return new Promise((resolve, reject) => {
        apolloClient
          .query({ query: ALL_SUBJECTS_STUDENT })
          .then(response => {
            const subjects = JSON.parse(JSON.stringify(response.data.allSubjects))
            // console.log('--set db--')
            // console.log(subjects)
            commit('setSubjects', subjects)
            resolve()
          })
          .catch((error) => {
            console.error(error)
            reject()
          })
      })
    },
    async getDb({ self, state, dispatch }) {
      await dispatch('setApolloDataToStore')
      return state.db
    }
  }
})
