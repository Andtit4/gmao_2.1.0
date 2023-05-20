
/* import { createStore } from 'vuex'

export const store = createStore({
  state: {
    countdown: 5400 // 1h30 en secondes
  },
  mutations: {
    decrementCountdown(state) {
      state.countdown--
    }
  },
  actions: {
    startCountdown({ commit }) {
      setInterval(() => {
        commit('decrementCountdown')
      }, 1000)
    }
  },
  getters: {
    hour(state) {
      return Math.floor(state.countdown / 3600)
    },
    minute(state) {
      return Math.floor((state.countdown % 3600) / 60)
    },
    second(state) {
      return state.countdown % 60
    }
  }
}) */


